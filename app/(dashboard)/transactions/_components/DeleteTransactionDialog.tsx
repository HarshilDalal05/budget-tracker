"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { toast } from "sonner";
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
import { DeleteTransaction } from "../_actions/deleteTransaction";

type Props = { open: boolean; setOpen: (open: boolean) => void; id: string };

const DeleteTransactionDialog = ({ id, open, setOpen }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      toast.success("Transaction delete successfully", {
        id: id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: id,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to delte this transaction ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category ....", { id });
              deleteMutation.mutate(id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
