import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
};

export default Loading;
