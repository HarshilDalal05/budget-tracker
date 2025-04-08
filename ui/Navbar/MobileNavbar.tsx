"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeMenu } from "../ThemeMenu";
import { Logo, LogoMobile } from "../Logo";
import NavbarItem from "./NavItem";
import { NAVBAR_ITEMS } from "../constants";

type Props = {};

const MobileNavbar = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="block md:hidden border-separate bg-background">
      <nav className="flex items-center justify-between px-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size="icon" className="border">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[310px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 pt-4">
              {NAVBAR_ITEMS.map((item, i) => {
                return (
                  <NavbarItem
                    key={i}
                    link={item.link}
                    label={item.label}
                    onClick={() => setIsOpen((prev) => !prev)}
                  />
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeMenu />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
