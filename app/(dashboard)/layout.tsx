import React from "react";
import Navbar from "@/ui/Navbar";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col h-scren w-full">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default layout;
