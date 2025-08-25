import React from "react";

interface ListItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  component?: React.ReactNode;
}

export type { ListItem };
