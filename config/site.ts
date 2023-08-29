export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Better-Craftplaces",
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
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/JUULdog"
	},
};
