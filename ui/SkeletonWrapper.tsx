import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
};

const SkeletonWrapper = ({ children, isLoading, fullWidth = true }: Props) => {
  if (!isLoading) return children;

  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
