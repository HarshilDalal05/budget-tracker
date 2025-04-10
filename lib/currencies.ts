export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-Us" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yan", locale: "ja-JP" },
  { value: "GBR", label: "£ Pound", locale: "en-GB" },
  { value: "INR", label: "₹ Rupee", locale: "en-IN" },
];

export type Currency = (typeof Currencies)[0];
