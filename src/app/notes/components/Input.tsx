import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type InputProps = {
  id: string;
  type?: string;
  pfix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  function MyInput(props, ref) {
    const { type = "text", pfix, suffix, id, error, ...otherProps } = props;
    return (
      <div className="flex flex-col gap-1">
        <div
          className={clsx(
            error ? "border-red-600" : "",
            "bg-secondary flex w-fit items-center rounded-full focus-within:outline"
          )}
        >
          {pfix && (
            <label htmlFor={id} className="pl-2.5 pr-1.5">
              {pfix}
            </label>
          )}
          <input
            type={type}
            id={id}
            className="placeholder:text-secondary h-10 bg-transparent pr-4 outline-none"
            ref={ref}
            {...otherProps}
          />
          {suffix && (
            <label htmlFor={id} className="pl-2 pr-3">
              {suffix}
            </label>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

export default Input;
