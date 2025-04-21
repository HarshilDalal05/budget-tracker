import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscationType } from "@/lib/types";
import SkeletonWrapper from "@/ui/SkeletonWrapper";
import { useQuery } from "@tanstack/react-query";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  PlusSquare,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@/prisma/app/generated/prisma/client";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

type Props = { type: TranscationType };

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            suppressHydrationWarning
            className="flex w-full border-seperate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <Trash2Icon /> Remove
          </Button>
        }
      />
    </div>
  );
};

const CategoryList = ({ type }: Props) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "income" ? (
                <BanknoteArrowDown className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
              ) : (
                <BanknoteArrowUp className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
              )}
              <div>
                {type === "income" ? "Incomes" : "Expenses"} categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable ? (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>{" "}
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols">
            {categoriesQuery.data.map((category: Category, key: number) => {
              return <CategoryCard key={key} category={category} />;
            })}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

export default CategoryList;
