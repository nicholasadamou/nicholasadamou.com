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
      variant="ghost"
      className={clsx(
        "rounded-lg px-4 py-2 text-sm transition-colors",
        active
          ? "text-primary nav-active decoration-react-link decoration-2"
          : "text-secondary hover:text-primary"
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
