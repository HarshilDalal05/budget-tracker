import React, { useCallback, useEffect, useState } from "react";

import { TranscationType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/prisma/app/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreateCategoryDialog from "./CreateCategoryDialog";

type Props = {
  type: TranscationType;
  onChange: (value: string) => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  category: any;
};

const CategoryPicker = ({ type, onChange, category }: Props) => {
  const [value, setValue] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const successCallback = useCallback((category: Category) => {
    setValue(category.name);
  }, []);

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [value, onChange]);

  return (
    <Select
      onValueChange={(category) => {
        setValue(category);
      }}
      value={category}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>

      <SelectContent>
        <CreateCategoryDialog type={type} successCallback={successCallback} />
        {categoriesQuery.data &&
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          categoriesQuery.data.map((category: Category, key: any) => {
            return (
              <SelectItem key={key} value={category.name}>
                <span role="img">{category.icon}</span>
                <span>{category.name}</span>
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );
};

export default CategoryPicker;
