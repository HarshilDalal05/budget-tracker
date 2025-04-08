"use client";

import React from "react";

import { UserButton } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Logo } from "../Logo";
import { ThemeMenu } from "../ThemeMenu";
import NavbarItem from "./NavItem";
import { NAVBAR_ITEMS } from "../constants";

type Props = {};

const DesktopNavbar = (props: Props) => {
  return (
    <div className="hidden md:block border-separate border-b bg-background ">
      <nav className="w-full flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4 w-full justify-between">
          <div className="flex">
            <Logo />
            <div className="flex h-full">
              <NavigationMenu>
                <NavigationMenuList>
                  {NAVBAR_ITEMS.map((item, i) => {
                    return (
                      <NavbarItem key={i} link={item.link} label={item.label} />
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeMenu />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;
