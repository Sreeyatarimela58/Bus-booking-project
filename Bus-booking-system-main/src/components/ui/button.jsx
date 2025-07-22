
import * as React from "react";

const Button = React.forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };