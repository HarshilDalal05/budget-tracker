import React from "react";
import { Logo } from "@/ui/Logo";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      <Logo />
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default layout;
