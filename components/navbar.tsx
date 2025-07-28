import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import { Heart } from "lucide-react";

export const Navbar = () => {
  return (
    <NextUINavbar 
      maxWidth="xl" 
      position="sticky" 
      className="bg-background/70 backdrop-blur-md border-b border-divider"
    >
      {/* Left content */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <div className="text-2xl">🚚</div>
            <div className="flex flex-col">
              <p className="font-bold text-inherit text-lg">Food Truck Finder</p>
              <p className="text-xs text-default-500">Discover • Taste • Enjoy</p>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-8">
          {siteConfig.navItems &&
            siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium hover:text-primary transition-colors font-medium"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      {/* Right content */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-3 items-center">
          <Button
            as={Link}
            href={siteConfig.links.sponsor}
            target="_blank"
            color="danger"
            variant="flat"
            size="sm"
            startContent={<Heart size={16} />}
            className="font-medium"
          >
            Sponsor
          </Button>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile menu items */}
      <NavbarMenu className="bg-background/95 backdrop-blur-md">
        <div className="mx-4 mt-2 flex flex-col gap-3">
          {siteConfig.navItems &&
            siteConfig.navItems.map((item) => (
              <NavbarMenuItem key={item.href}>
                <NextLink 
                  className="w-full text-lg font-medium hover:text-primary transition-colors" 
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
          <NavbarMenuItem>
            <Button
              as={Link}
              href={siteConfig.links.sponsor}
              target="_blank"
              color="danger"
              variant="flat"
              size="md"
              startContent={<Heart size={18} />}
              className="w-full font-medium mt-4"
            >
              Support This Project
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};