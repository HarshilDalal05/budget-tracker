"use client";

import React from "react";

import { toast } from "sonner";

import { TranscationType } from "@/lib/types";
import { Category } from "@/prisma/app/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { DeleteCategory } from "../_actions/categories";

type Props = {
  trigger: React.ReactNode;
  category: Category;
};

const DeleteCategoryDialog = ({ category, trigger }: Props) => {
  const deleteToast = `${category.name}-${category.type}`;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Category delete successfully", {
        id: deleteToast,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: deleteToast,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to delte this category ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category ....", { id: deleteToast });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TranscationType,
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
