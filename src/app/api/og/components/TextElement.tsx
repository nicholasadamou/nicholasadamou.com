import { ReactElement, ReactNode } from "react";
import { StyleConfig } from "../types";

export const TextElement = ({
  text,
  styles,
}: {
  text:
    | string
    | number
    | bigint
    | boolean
    | ReactElement
    | Iterable<ReactNode>
    | null
    | undefined;
  styles: StyleConfig;
}) => <div style={styles}>{text}</div>;
