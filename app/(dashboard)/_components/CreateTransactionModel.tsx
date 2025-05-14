"use client";

import React, { useCallback, useState } from "react";

import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { TranscationType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { DateToUTCDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryPicker from "@/app/(dashboard)/_components/CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateTransaction } from "../_actions/transactions";

type Props = { trigger: React.ReactNode; type: TranscationType };

const CreateTransactionModel = ({ trigger, type }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction Created successfully ", {
        id: "create-transaction",
      });
      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      // After creating a transaction, we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setIsOpen((prev) => !prev);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong !!!", { id: "create-transaction" });
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Creating transaction ....", {
        id: "create-transaction",
      });

      mutate({ ...values, date: DateToUTCDate(values.date) });
    },
    [mutate]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m1",
                type === "income" ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {type}
            </span>{" "}
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    <span className="text-red-500">required</span>
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex my-2">
              Transaction: {form.watch("category")}
            </div>
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                        category={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction date</FormLabel>
                    <Popover
                      open={isPopoverOpen}
                      onOpenChange={setIsPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        remove="true"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(date);
                            setIsPopoverOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending ? "Create" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModel;
