import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "main";
  size?: "default" | "wide";
};

const containerSizeClass: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-[var(--container-max-width)]",
  wide: "max-w-[min(100%,90rem)]",
};

export function Container({
  as: Component = "div",
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
