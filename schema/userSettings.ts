import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencyScheme = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((i) => i.value === value);
    if (!found) {
      throw new Error(`Invalid currency :${value}`);
    }

    return value;
  }),
});
