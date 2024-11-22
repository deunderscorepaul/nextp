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
  import { GithubIcon, HeartFilledIcon } from "@/components/icons";
  import { Logo } from "@/components/icons";
  
  export const Navbar = () => {
	// Log siteConfig.navItems for debugging
	console.log("siteConfig.navItems:", siteConfig.navItems);
  
	return (
	  <NextUINavbar maxWidth="xl" position="sticky">
		{/* Left content */}
		<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
		  <NavbarBrand as="li" className="gap-3 max-w-fit">
			<NextLink className="flex justify-start items-center gap-1" href="/">
			  <Logo />
			  <p className="font-bold text-inherit">Better-Craftplaces</p>
			</NextLink>
		  </NavbarBrand>
		  <ul className="hidden lg:flex gap-4 justify-start ml-2">
			{siteConfig.navItems &&
			  siteConfig.navItems.map((item) => (
				<NavbarItem key={item.href}>
				  <NextLink
					className={clsx(
					  linkStyles({ color: "foreground" }),
					  "data-[active=true]:text-primary data-[active=true]:font-medium"
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
		  <NavbarItem className="hidden sm:flex gap-2">
			<ThemeSwitch />
		  </NavbarItem>
		  <NavbarItem className="hidden md:flex">
			<Button
			  isExternal
			  as={Link}
			  className="text-sm font-normal text-default-600 bg-default-100"
			  href={siteConfig.links.sponsor}
			  startContent={<HeartFilledIcon className="text-danger" />}
			  variant="flat"
			>
			  Sponsor
			</Button>
		  </NavbarItem>
		</NavbarContent>
  
		{/* Mobile menu */}
		<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
		  <ThemeSwitch />
		  <NavbarMenuToggle />
		</NavbarContent>
  
		{/* Mobile menu items */}
		<NavbarMenu>
		  {siteConfig.navItems &&
			siteConfig.navItems.map((item) => (
			  <NavbarMenuItem key={item.href}>
				<NextLink className="w-full" href={item.href}>
				  {item.label}
				</NextLink>
			  </NavbarMenuItem>
			))}
		</NavbarMenu>
	  </NextUINavbar>
	);
  };
  