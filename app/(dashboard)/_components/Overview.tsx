"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { UserSettings } from "@/prisma/app/generated/prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { MAX_DATE_RANGE_DAYS } from "./constants";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

type Props = {
  userSettings: UserSettings;
};

const Overview = ({ userSettings }: Props) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2 p-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allow range is ${MAX_DATE_RANGE_DAYS} 30`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="flex px-4 flex-col gap-5">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
};

export default Overview;
