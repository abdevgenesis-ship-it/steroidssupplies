"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categoryPublicPath } from "@/config/seo"
import { isAnyCategorySectionActive } from "@/lib/categoryNav"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { CartSidebar } from "@/components/shop/CartSidebar"
import { useCart } from "@/hooks/useCart"
import type { Category } from "@/types/sanity"

type HeaderProps = {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const {
    itemCount: cartItemCount,
    items: cartItems,
    cartSidebarOpenSignal,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart()

  const categorySlugs = categories.map((c) => c.slug?.current)

  const quoteHref = "/wholesale-request"
  const categoriesMenuActive =
    isAnyCategorySectionActive(pathname, categorySlugs) || pathname.startsWith("/category")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "glass-chrome border-chrome-b" : "glass-chrome border-chrome-b-primary",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20 lg:h-24">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
              <Image
                src="/logo.png"
                alt="THCPensBulk — Bulk THC Vapes & Wholesale 510 Carts"
                width={48}
                height={48}
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain shrink-0"
                priority
              />
              <span className="whitespace-nowrap text-[15px] font-semibold font-heading tracking-widest sm:text-[20px] lg:text-[22px]">
                <span className="text-foreground">THC </span>
                <span className="text-primary">PENS </span>
                <span className="text-foreground">BULK</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center xl:mr-12">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1 lg:space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        "inline-flex items-center justify-center px-2 py-1.5 uppercase tracking-wider text-[13px] font-medium transition-colors hover:text-primary focus:outline-none",
                        pathname === "/" ? "text-primary" : "text-foreground",
                      )}
                    >
                      HOME
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent uppercase tracking-wider text-[13px] font-medium transition-colors hover:text-primary px-2", categoriesMenuActive ? "text-primary" : "text-foreground")}>CATEGORIES</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[min(92vw,760px)] p-4">
                      <div className="flex items-center justify-between gap-3 pb-3">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Browse by Category
                        </h2>
                        <Link
                          href="/products"
                          className="text-xs font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:opacity-80"
                        >
                          View all products
                        </Link>
                      </div>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {categories.map((category) => (
                          <ListItem
                            key={category.slug.current}
                            title={category.name}
                            href={categoryPublicPath(category.slug.current)}
                          >
                            {category.shortDescription}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className={cn(
                        "inline-flex items-center justify-center px-2 py-1.5 uppercase tracking-wider text-[13px] font-medium transition-colors hover:text-primary focus:outline-none",
                        pathname === "/products" ? "text-primary" : "text-foreground",
                      )}
                    >
                      SHOP
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/wholesale"
                      className={cn(
                        "inline-flex items-center justify-center px-2 py-1.5 uppercase tracking-wider text-[13px] font-medium transition-colors hover:text-primary focus:outline-none",
                        pathname === "/wholesale" ? "text-primary" : "text-foreground",
                      )}
                    >
                      WHOLESALE
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className={cn(
                        "inline-flex items-center justify-center px-2 py-1.5 uppercase tracking-wider text-[13px] font-medium transition-colors hover:text-primary focus:outline-none",
                        pathname === "/contact" ? "text-primary" : "text-foreground",
                      )}
                    >
                      CONTACT
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Get a Quote CTA — desktop only */}
            <Button asChild className="hidden lg:inline-flex">
              <Link href={quoteHref}>Get a Quote</Link>
            </Button>

            <CartSidebar
              items={cartItems}
              openSignal={cartSidebarOpenSignal}
              onIncrease={incrementItem}
              onDecrease={decrementItem}
              onRemove={removeItem}
              onClear={clearCart}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative group hover:bg-transparent hover:text-primary"
                  aria-label="Open shopping cart"
                >
                  <ShoppingBag
                    className="size-5 transition-transform group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                  {cartItemCount > 0 ? (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  ) : null}
                </Button>
              }
            />

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-screen max-w-sm p-4 pt-12 sm:p-6 sm:pt-14">
                  <SheetTitle className="text-left font-heading text-xl tracking-wide text-muted-foreground">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                  <nav className="mt-5 flex flex-col gap-3.5">
                    <Link href="/" className={cn("text-lg font-medium hover:text-primary transition-colors", pathname === "/" && "text-primary")}>
                      Home
                    </Link>
                    <Link href="/products" className={cn("text-lg font-medium hover:text-primary transition-colors", pathname === "/products" && "text-primary")}>
                      Shop
                    </Link>
                    <div className="flex flex-col gap-2">
                      <span className={cn("text-lg font-medium", categoriesMenuActive && "text-primary")}>Categories</span>
                      <div className="flex flex-col gap-2 pl-4 border-l">
                        {categories.map((category) => (
                          <Link 
                            key={category.slug.current} 
                            href={categoryPublicPath(category.slug.current)}
                            className={cn("hover:text-primary transition-colors", isAnyCategorySectionActive(pathname, [category.slug.current]) ? "text-primary font-medium" : "text-muted-foreground")}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/wholesale" className={cn("text-lg font-medium hover:text-primary transition-colors", pathname === "/wholesale" && "text-primary")}>
                      Wholesale / Bulk
                    </Link>
                    <Link href="/contact" className={cn("text-lg font-medium hover:text-primary transition-colors", pathname === "/contact" && "text-primary")}>
                      Contact
                    </Link>
                    <div className="mt-4 pt-4 border-t">
                      <Button asChild className="w-full">
                        <Link href={quoteHref}>Get a Quote</Link>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children ? (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          ) : null}
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
