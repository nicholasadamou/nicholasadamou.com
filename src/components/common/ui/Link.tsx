"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import clsx from "clsx";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type LinkProps = {
  children: ReactNode;
  className?: string;
  underline?: boolean;
} & NextLinkProps;

export default function Link(props: LinkProps) {
  const pathname = usePathname();
  const isExternal =
    !props.href.toString().startsWith("/") &&
    !props.href.toString().startsWith("#");
  const { underline, ...rest } = props;

  // Scroll to top when pathname changes (after navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <NextLink
      {...rest}
      onClick={handleClick}
      className={clsx(
        "underline-offset-4",
        (isExternal || underline) && "underline",
        props.className
      )}
      target={isExternal ? "_blank" : undefined}
    >
      {props.children}
    </NextLink>
  );
}
