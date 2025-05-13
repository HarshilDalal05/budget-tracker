import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
  const toDate = from ? queryParams.data?.from : null;

  const stats = await getCategoriesStats(user.id, fromDate, toDate);

  return Response.json(stats);
}
export type getCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(
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
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: criteria,
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
