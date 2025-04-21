import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/lib/types";
import React from "react";

type Props = {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  years: GetHistoryPeriodsResponseType;
};

const YearSelector = ({ period, setPeriod, years }: Props) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({ month: period.month, year: parseInt(value) });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years?.map((year, key) => {
          return (
            <SelectItem key={key} value={year.toString()}>
              {year}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default YearSelector;
