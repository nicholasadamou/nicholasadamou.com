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
  <div className="border-secondary text-tertiary mt-7 flex gap-2 rounded-md border p-4">
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
