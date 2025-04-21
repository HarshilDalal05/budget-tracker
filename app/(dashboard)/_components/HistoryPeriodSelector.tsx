"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import SkeletonWrapper from "@/ui/SkeletonWrapper";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import YearSelector from "./YearSelector";
import MonthSelector from "./MothSelector";

type Props = {
  period: Period;
  timeframe: Timeframe;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  setTimeframe: React.Dispatch<React.SetStateAction<Timeframe>>;
};

const HistoryPeriodSelector = ({
  period,
  timeframe,
  setPeriod,
  setTimeframe,
}: Props) => {
  const historyPeriods = useQuery({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods?.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;
