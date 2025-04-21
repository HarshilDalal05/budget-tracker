"use server";

import React from "react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateTransactionModel from "./_components/CreateTransactionModel";
import Overview from "./_components/Overview";
import History from "./_components/History";

type Props = {};

const page = async (props: Props) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="flex flex-wrap items-center justify-between gap-6 p-8">
          <p className="text-3xl font-bold">Hello. {user.firstName} 👋 !!</p>

          <div className="flex items-center gap-3">
            <CreateTransactionModel
              trigger={
                <Button
                  variant="secondary"
                  className="border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-800 hover:text-white"
                >
                  New Income
                </Button>
              }
              type="income"
            />
            <CreateTransactionModel
              trigger={
                <Button
                  variant="secondary"
                  className="border-rose-500 bg-rose-600 text-white hover:bg-rose-800 hover:text-white"
                >
                  New Expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default page;
