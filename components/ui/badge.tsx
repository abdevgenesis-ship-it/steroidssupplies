import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-3xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[background-color,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-primary/45 bg-primary/12 text-primary backdrop-blur-sm [a]:hover:border-primary [a]:hover:bg-primary/20",
        secondary:
          "border-border bg-secondary text-secondary-foreground [a]:hover:border-primary/30 [a]:hover:bg-accent",
        destructive:
          "border-destructive/30 bg-destructive/12 text-destructive [a]:hover:border-destructive/45 [a]:hover:bg-destructive/20",
        outline:
          "border-border bg-background text-foreground [a]:hover:border-primary/25 [a]:hover:bg-muted",
        ghost:
          "border-transparent hover:border-border hover:bg-muted hover:text-foreground",
        link: "border-transparent text-primary underline-offset-4 backdrop-blur-none hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
