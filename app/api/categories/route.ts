import { z } from "zod";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]);

  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
