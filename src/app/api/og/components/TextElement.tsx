import { ReactElement, ReactNode } from "react";
import { StyleConfig } from "../types";

/**
 * Enhanced text component with configurable styling
 * Used for rendering text elements in Open Graph images
 */
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
