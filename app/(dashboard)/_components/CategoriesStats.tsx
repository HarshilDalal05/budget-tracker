"use client";

import { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@/prisma/app/generated/prisma/client";
import SkeletonWrapper from "@/ui/SkeletonWrapper";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import CategoriesCard from "./CategoriesCard";

type Props = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
  range: boolean;
};

const CategoriesStats = ({ userSettings, from, to, range }: Props) => {
  const api: string = range
    ? `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
        to
      )}`
    : `/api/stats/categories`;
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () => fetch(api).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery?.data || []}
        />
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery?.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;
