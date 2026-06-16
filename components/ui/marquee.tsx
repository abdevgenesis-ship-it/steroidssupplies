import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: string;
  pauseOnHover?: boolean;
};

export function Marquee({
  children,
  className,
  reverse = false,
  duration = "28s",
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "flex w-max min-w-full gap-3",
        pauseOnHover && "marquee-pause-on-hover",
        reverse ? "animate-marquee-right" : "animate-marquee-left",
        className,
      )}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      {children}
    </div>
  );
}