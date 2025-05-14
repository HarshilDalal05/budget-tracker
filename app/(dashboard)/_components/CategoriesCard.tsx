import React from "react";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route";

type Props = {
  formatter: Intl.NumberFormat;
  data: getCategoriesStatsResponseType | [];
  type: string;
};

const CategoriesCard = ({ formatter, data, type }: Props) => {
  const filteredData = data?.filter((i) => i.type === type);
  const total = filteredData?.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-8">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expenses"}
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData?.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selectd period
            <p className="text-sm text-muted-foreground">
              {`Try selecting a different period or adding new ${type}s`}
            </p>
          </div>
        )}
        {filteredData?.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item, key) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)} %)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      progresscolor={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default CategoriesCard;
