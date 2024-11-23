import { title } from "@/components/primitives";
import { Link } from "@nextui-org/link";

export default function AboutPage() {
	return (
		<div>
			<h1 className={title()}>About</h1>
			<div>
				<h2>Hey, </h2>
				<p>this is a free to use Foodtruck app based on the <Link href="https://craftplaces.com" target="_blank">Craftplaces.com</Link> API.
					if you would like to support this project and keep the site with the services behind it online, please consider joining 
					the Patreon with 1$ monthly. The Server costs me 5€ per Month and it would be cool if some of the cost can be gathered using Patreon. 
					If you want to support this project and the stuff to come in future you&apos;ll find a Sponsor Button in the top right corner.
					For any kind of Contact please Contact me trough this E-Mailadress: 

				</p>
				<div><p>admin.juuldog.dev</p></div>
			</div>
		</div>
	);
}
