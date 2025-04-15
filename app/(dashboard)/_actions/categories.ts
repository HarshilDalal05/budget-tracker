"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const body = CreateCategorySchema.safeParse(form);
  if (!body.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = body.data;

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });

  return category;
}
