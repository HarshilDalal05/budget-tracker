"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";

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

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const body = DeleteCategorySchema.safeParse(form);
  if (!body.success) {
    throw new Error("Bad request");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const categories = await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: body.data.name,
        type: body.data.type,
      },
    },
  });

  return categories;
}
