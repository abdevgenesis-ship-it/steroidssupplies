import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border text-[12px] font-semibold uppercase tracking-widest whitespace-nowrap transition-[background-color,border-color,opacity,color,box-shadow] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-white shadow-sm hover:bg-[#7f1d1d] hover:border-[#7f1d1d]",
        outline:
          "border-primary/40 bg-background text-primary hover:border-primary hover:bg-primary/8 aria-expanded:border-primary/80 aria-expanded:bg-primary/6",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:border-primary/30 hover:bg-accent aria-expanded:border-primary/25 aria-expanded:bg-accent",
        accent:
          "border-highlight/50 bg-highlight/12 text-highlight hover:border-highlight/65 hover:bg-highlight/18 aria-expanded:border-highlight/60 aria-expanded:bg-highlight/16",
        ghost:
          "border-transparent bg-transparent text-foreground hover:border-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive:
          "border-destructive/35 bg-destructive/12 text-destructive backdrop-blur-md hover:border-destructive/48 hover:bg-destructive/20 focus-visible:border-destructive/45 focus-visible:ring-destructive/25 dark:hover:bg-destructive/22",
        link: "border-transparent rounded-none text-primary underline-offset-4 backdrop-blur-none hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-5 py-2.5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-2.5 text-[10px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-9 rounded-full normal-case tracking-normal",
        "icon-xs": "size-6 rounded-full normal-case tracking-normal [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full normal-case tracking-normal",
        "icon-lg": "size-10 rounded-full normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
