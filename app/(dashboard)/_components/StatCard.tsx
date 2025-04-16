import { Card } from "@/components/ui/card";
import React, { ReactNode, useCallback } from "react";
import CountUp from "react-countup";

type Props = {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
};

const StatCard = ({ formatter, icon, title, value }: Props) => {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex flex-row h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-center gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimal="2"
          formattingFn={formatFn}
          className="text-2xl"
          duration={5}
        />
      </div>
    </Card>
  );
};

export default StatCard;
