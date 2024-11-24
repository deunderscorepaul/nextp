export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "JUULdog.dev",
	description: "Wer das ließt kann lesen...",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "About",
      href: "/about",
    }
	],
	links: {
    	sponsor: "https://patreon.com/JUULdog"
	},
};
