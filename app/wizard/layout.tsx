import React from "react";

type Props = { children: React.ReactNode };

const layout = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col h-screen w-full items-center justify-center">
      {children}
    </div>
  );
};

export default layout;
