"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchemaType,
  CreateTransactionSchema,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const body = CreateTransactionSchema.safeParse(form);

  if (!body.success) {
    throw new Error(body.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = body.data;

  const categoryRow = await prisma.category.findFirst({
    where: { userId: user.id, name: category },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  //NOTE : Don't get confused between $transaction (prisma) and prisma.transaction (table)

  const _transaction = await prisma.$transaction([
    // create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    //update month aggregate tables
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    //update year aggregate tables
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,

          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,

        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);

  return _transaction;
}
