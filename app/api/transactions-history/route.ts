import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { OverviewQuerySchema } from "@/schema/overview";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const fromDate = from ? queryParams.data?.from : null;
  const toDate = from ? queryParams.data?.to : null;

  const transactions = await getTransactionsHistory(user.id, fromDate, toDate);

  return Response.json(transactions);
}

export type GetTransetTransactionsHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(
  userId: string,
  from: Date | null,
  to: Date | null
) {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!userSettings) {
    throw new Error("User Settings not found");
  }

  let criteria;
  if (from && to) {
    criteria = {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    };
  } else {
    criteria = { userId };
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);
  const transactions = await prisma.transaction.findMany({
    where: criteria,
    orderBy: { date: "desc" },
  });

  return transactions.map((t) => ({
    ...t,
    formattedAmount: formatter.format(t.amount),
  }));
}
