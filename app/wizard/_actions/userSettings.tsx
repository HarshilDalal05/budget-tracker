"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { UpdateUserCurrencyScheme } from "@/schema/userSettings";

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
