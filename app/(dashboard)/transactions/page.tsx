"use client";

import React, { useState } from "react";

import { toast } from "sonner";
import { differenceInDays, startOfMonth } from "date-fns";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

import { MAX_DATE_RANGE_DAYS } from "../_components/constants";
import TransactionsTable from "./_components/TransactionsTable";

export default function Page() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <div className="border-b bg-card">
        <div className="p-6 flex flex-wrap items-center justify-between min-h-[100px]">
          <div>
            <p className="text-3xl font-bold">Transactions history</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShow((prev) => !prev)}
            >
              Add a range
            </Button>
            {show && (
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
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <TransactionsTable
          from={dateRange.from}
          to={dateRange.to}
          range={show}
        />
      </div>
    </>
  );
}
