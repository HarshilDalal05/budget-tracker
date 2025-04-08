"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { link: string; label: string; onClick?: () => void };

const NavbarItem = ({ label, link, onClick }: Props) => {
  const pathName = usePathname();
  const isActive = pathName === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          onClick && onClick();
        }}
      >
        {label}
      </Link>
    </div>
  );
};

export default NavbarItem;
