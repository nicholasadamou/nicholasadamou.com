import { ReactNode } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Link } from "@/components/ui/link";

type NavLinkProps = {
	href: string;
	children: ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
	const pathname = `/${usePathname().split("/")[1]}`;
	const active = pathname === href;

	return (
		<Link
			variant={active ? "secondary" : "ghost"}
			className={clsx(
				"px-4 py-2 rounded-lg text-sm hover:text-primary transition-colors",
				active ? "text-primary decoration-2 decoration-react-link" : "text-secondary",
			)}
			href={href}
		>
			{children}
		</Link>
	);
}
