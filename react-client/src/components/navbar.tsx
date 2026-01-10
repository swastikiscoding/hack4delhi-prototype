import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Link as RouterLink } from "react-router-dom";
import { Chip } from "@heroui/chip";
import { useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About ECTA", href: "/about" },
    { name: "Documentation", href: "/docs" },
    { name: "Citizen Login", href: "/login" },
  ];

  return (
    <HeroUINavbar
      className="backdrop-blur-xl bg-background/60 border-b border-default-200/40"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left Side - Logo & Brand */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="gap-3 max-w-fit">
          <RouterLink
            className="flex justify-start items-center gap-3 group"
            to="/"
          >
            {/* Modern animated logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative p-2 bg-gradient-to-br from-orange-500 via-orange-400 to-green-600 rounded-xl shadow-lg">
                <svg
                  className="text-white"
                  fill="none"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                ECTA
              </span>
              <span className="text-[10px] text-default-400 font-medium -mt-0.5 hidden sm:block">
                Electoral Commission Tech
              </span>
            </div>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center - Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        <NavbarItem>
          <RouterLink
            className="px-4 py-2 text-sm font-medium text-default-600 hover:text-foreground hover:bg-default-100 rounded-full transition-all duration-200"
            to="/"
          >
            Home
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            className="px-4 py-2 text-sm font-medium text-default-600 hover:text-foreground hover:bg-default-100 rounded-full transition-all duration-200"
            to="/about"
          >
            About
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink
            className="px-4 py-2 text-sm font-medium text-default-600 hover:text-foreground hover:bg-default-100 rounded-full transition-all duration-200"
            to="/docs"
          >
            Docs
          </RouterLink>
        </NavbarItem>
      </NavbarContent>

      {/* Right Side - Actions */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full gap-3"
        justify="end"
      >
        <NavbarItem>
          <Chip
            classNames={{
              base: "bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20",
              content: "text-green-600 dark:text-green-400 font-medium text-xs",
            }}
            size="sm"
            startContent={
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            }
            variant="flat"
          >
            Sepolia Testnet
          </Chip>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={RouterLink}
            className="font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200"
            radius="full"
            size="sm"
            to="/login"
            variant="solid"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Citizen Login
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 bg-background/95 backdrop-blur-xl">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <RouterLink
              className="w-full text-lg font-medium text-default-600 hover:text-primary py-3 block border-b border-default-100"
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </RouterLink>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-4">
          <Chip
            classNames={{
              base: "bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20",
              content: "text-green-600 dark:text-green-400 font-medium text-xs",
            }}
            size="sm"
            startContent={
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            }
            variant="flat"
          >
            Sepolia Testnet
          </Chip>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
