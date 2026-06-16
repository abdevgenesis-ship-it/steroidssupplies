import { TestimonialsContent } from "@/components/common/TestimonialsContent";
import { getTestimonialsByPlacement } from "@/lib/sanityClient";
import type { MergedWholesalePage } from "@/lib/wholesale/content";
import type { Testimonial } from "@/types/sanity";

type WholesaleTestimonialsSectionProps = {
  content: MergedWholesalePage;
};

export async function WholesaleTestimonialsSection({ content }: WholesaleTestimonialsSectionProps) {
  let testimonials: Testimonial[] = [];

  try {
    testimonials = await getTestimonialsByPlacement("wholesale");
  } catch {
    testimonials = [];
  }

  const displayTestimonials =
    testimonials.length > 0
      ? testimonials
          .map((item) => ({
            quote: item.quote || "",
            name: item.name,
            role: item.role || "Verified Buyer",
            location: item.location || "USA",
            rating: Number.isFinite(item.rating) ? Math.min(5, Math.max(1, item.rating || 5)) : 5,
            image: item.image,
          }))
          .filter((item) => Boolean(item.quote && item.name))
          .slice(0, 3)
      : [];

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-background text-foreground"
    >
      <TestimonialsContent
        badgeText="Trusted by Buyers"
        headingId="testimonials-heading"
        heading={content.testimonialsHeading}
        intro={content.testimonialsIntro}
        testimonials={displayTestimonials}
        showQuoteIcon
      />
    </section>
  );
}