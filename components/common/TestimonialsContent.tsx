import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { brandPlaceholderGradient } from "@/lib/theme";
import { Quote } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

const DESKTOP_AVATAR_SIZE = 80;
const CONTEXT_IMAGE_WIDTH = 720;
const CONTEXT_IMAGE_HEIGHT = 405;
const MOBILE_ROW_DURATION = "26s";
const MOBILE_ROW_DURATION_SLOW = "34s";
const DESKTOP_MARQUEE_DURATION = "32s";
const DESKTOP_MARQUEE_DURATION_LONG = "40s";
const DESKTOP_CARD_WIDTH = "w-[calc((min(100vw,80rem)-4rem-1rem)/3)]";
const MOBILE_CARD_WIDTH = "w-[min(88vw,24rem)]";
const MOBILE_REVIEW_GROUP_SIZE = 2;

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  image?: {
    asset?: {
      _ref: string;
    };
    alt?: string;
  };
  contextImage?: {
    asset?: {
      _ref: string;
    };
    alt?: string;
  };
};

type TestimonialsContentProps = {
  heading: string;
  intro?: string;
  badgeText?: string;
  headingId?: string;
  testimonials: TestimonialItem[];
  showQuoteIcon?: boolean;
  cardClassName?: string;
};

export function TestimonialsContent({
  heading,
  intro,
  badgeText,
  headingId,
  testimonials,
  showQuoteIcon = false,
  cardClassName,
}: TestimonialsContentProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const desktopMarqueeItems = [...testimonials, ...testimonials];
  const mobileRows = createMobileRows(testimonials);

  function renderCard(testimonial: TestimonialItem) {
    const contextImage = testimonial.contextImage?.asset
      ? testimonial.contextImage
      : testimonial.image?.asset
        ? testimonial.image
        : undefined;
    const avatarImage = testimonial.contextImage?.asset ? testimonial.image : undefined;

    return (
      <Card
        size="sm"
        className={cn(
          "border-foreground/10 flex h-full min-h-80 flex-col transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:z-10 hover:scale-[1.01] hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(196,30,58,0.35)]",
          cardClassName,
        )}
      >
        <CardContent className="relative flex h-full flex-col pt-5 text-center lg:pt-6">
          <div className="relative mb-4 h-34 w-full overflow-hidden rounded-xl border border-foreground/10">
            {contextImage?.asset ? (
              <Image
                src={urlFor(contextImage.asset._ref)
                  .width(CONTEXT_IMAGE_WIDTH)
                  .height(CONTEXT_IMAGE_HEIGHT)
                  .fit("crop")
                  .url()}
                alt={contextImage.alt || `${testimonial.name} testimonial context image`}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-xs font-medium text-foreground/75"
                style={{
                  background: brandPlaceholderGradient(),
                }}
              >
                Testimonial Context
              </div>
            )}
          </div>

          {showQuoteIcon ? (
            <span className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <Quote className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : null}

          <div className="mx-auto mb-4 h-14 w-14 overflow-hidden rounded-full shrink-0 lg:h-20 lg:w-20">
            {avatarImage?.asset ? (
              <Image
                src={urlFor(avatarImage.asset._ref)
                  .width(DESKTOP_AVATAR_SIZE)
                  .height(DESKTOP_AVATAR_SIZE)
                  .url()}
                alt={avatarImage.alt || testimonial.name}
                width={DESKTOP_AVATAR_SIZE}
                height={DESKTOP_AVATAR_SIZE}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-sm font-semibold text-foreground ring-1 ring-primary/20 lg:text-base"
                style={{
                  background: brandPlaceholderGradient(),
                }}
              >
                {getInitials(testimonial.name)}
              </div>
            )}
          </div>

          <p
            className={cn("text-muted-foreground", showQuoteIcon ? "mt-3 text-amber-500" : "")}
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {"★".repeat(testimonial.rating)}
            <span className="sr-only"> {testimonial.rating} out of 5</span>
          </p>

          <blockquote className="mt-3 text-sm leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          <footer className="mt-3 text-sm lg:mt-4">
            <cite className="not-italic font-medium">{testimonial.name}</cite>
            <span className="text-muted-foreground">
              {" "}
              — {testimonial.role}, {testimonial.location}
            </span>
          </footer>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        {badgeText ? (
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {badgeText}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
        ) : null}
        <h2
          id={headingId}
          className={cn(
            "font-heading leading-tight",
            badgeText ? "mt-2 text-2xl sm:text-3xl lg:text-4xl" : "text-2xl sm:text-3xl",
          )}
        >
          {heading}
        </h2>
        {intro ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>
        ) : null}
      </div>

      <div className="mt-8 md:hidden">
        <div className="space-y-3 overflow-hidden py-2">
          {mobileRows.map((row, rowIndex) => (
            <div key={`testimonial-mobile-row-${rowIndex}`} className="overflow-hidden py-1">
              <Marquee
                reverse={rowIndex % 2 === 1}
                duration={row.length > MOBILE_REVIEW_GROUP_SIZE ? MOBILE_ROW_DURATION_SLOW : MOBILE_ROW_DURATION}
                pauseOnHover
              >
                {row.map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${testimonial.location}-mobile-${rowIndex}-${index}`}
                    className={`${MOBILE_CARD_WIDTH} shrink-0`}
                  >
                    {renderCard(testimonial)}
                  </div>
                ))}
                {row.map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${testimonial.location}-mobile-dup-${rowIndex}-${index}`}
                    className={`${MOBILE_CARD_WIDTH} shrink-0`}
                    aria-hidden="true"
                  >
                    {renderCard(testimonial)}
                  </div>
                ))}
              </Marquee>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 hidden md:block">
        <div className="overflow-hidden py-2">
          <Marquee
            duration={testimonials.length > 3 ? DESKTOP_MARQUEE_DURATION_LONG : DESKTOP_MARQUEE_DURATION}
            className="gap-2"
            pauseOnHover
          >
            {desktopMarqueeItems.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${testimonial.location}-desktop-${index}`}
                className={`${DESKTOP_CARD_WIDTH} min-w-0 shrink-0`}
              >
                {renderCard(testimonial)}
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </>
  );
}

function createMobileRows(testimonials: TestimonialItem[]) {
  return [
    testimonials.filter((_, index) => index % 2 === 0),
    testimonials.filter((_, index) => index % 2 === 1),
  ].filter((row) => row.length > 0);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}