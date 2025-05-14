import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { OverviewQuerySchema } from "@/schema/overview";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const fromDate = from ? queryParams.data?.from : null;
  const toDate = from ? queryParams.data?.from : null;

  const stats = await getBalanceStats(user.id, fromDate, toDate);

  return Response.json(stats);
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(
  userId: string,
  from: Date | null,
  to: Date | null
) {
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

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: criteria,
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}
