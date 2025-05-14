import React from "react";

import Link from "next/link";
import { Logo } from "@/ui/Logo";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CurrencyComboBox from "./_components/CurrencyComboBox";



const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container flex max-w-3xl flex-col items-center gap-4 mb-4 px-5">
      <div>
        <h1 className="text-center text-3xl">
          Welcome,
          <span className="ml-2 font-bold">{user?.firstName ?? "User"}👋</span>
        </h1>

        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Lets &apos;s get started by setting up your currency
        </h2>

        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>

      <Separator />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your description currency for transaction
          </CardDescription>
          <CardContent className="px-0">
            <CurrencyComboBox />
          </CardContent>
        </CardHeader>
      </Card>

      <Separator />

      <Button className="w-full" asChild>
        <Link href={"/"}>I&apos;m done ! Take me to the dashboard</Link>
      </Button>

      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
};

export default Page;
