import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "INR",
      },
    });
  }

  // Revalidate the home page that uses the user currency
  revalidatePath("/");

  return Response.json(userSettings);
}
