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
        "rounded-lg px-4 py-2 text-sm transition-colors hover:text-primary",
        active
          ? "decoration-react-link text-primary decoration-2"
          : "text-secondary"
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
