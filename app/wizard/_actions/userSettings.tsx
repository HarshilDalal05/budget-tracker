"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencyScheme } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  const body = UpdateUserCurrencyScheme.safeParse({ currency });

  if (!body.success) {
    throw body.error;
  }
  

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return userSettings;
}
