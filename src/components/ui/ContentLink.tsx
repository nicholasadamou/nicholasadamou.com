import type { ComponentProps } from "react";

export function ContentLink({
  href,
  children,
  title,
  id,
  className,
}: ComponentProps<"a">) {
  const external =
    !!href &&
    /^(https?:)?\/\//i.test(href) &&
    !/^https?:\/\/(www\.)?nicholasadamou\.com(?:[/?#]|$)/i.test(href);
  return (
    <a
      href={href}
      title={title}
      id={id}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
