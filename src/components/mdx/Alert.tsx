import React, { ReactNode } from "react";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

const Alert = ({
  children,
  type,
}: {
  children: ReactNode;
  type: "warning" | "info";
}): React.ReactElement => (
  <div className="mt-7 flex gap-2 rounded-md border border-secondary p-4 text-tertiary">
    <div className="w-fit">
      {type === "warning" ? (
        <ExclamationTriangleIcon className="h-5 w-5" />
      ) : (
        <InformationCircleIcon className="h-5 w-5" />
      )}
    </div>
    <div className="not-prose text-sm">{children}</div>
  </div>
);

export default Alert;
