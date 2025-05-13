import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@/prisma/app/generated/prisma/client";
import SkeletonWrapper from "@/ui/SkeletonWrapper";
import { useQuery } from "@tanstack/react-query";
import { BanknoteArrowDown, BanknoteArrowUp, Wallet } from "lucide-react";
import React, { useMemo } from "react";
import StatCard from "./StatCard";

type Props = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
  range: boolean;
};

const StatsCards = ({ userSettings, from, to, range }: Props) => {
  const api:string = range
    ? `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
    : `/api/stats/balance`;
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () => fetch(api).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery?.data?.income || 0;
  const expense = statsQuery?.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <BanknoteArrowDown className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <BanknoteArrowUp className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Expense"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCards;
