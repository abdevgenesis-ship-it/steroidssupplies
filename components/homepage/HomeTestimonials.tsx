import { Container } from "@/components/layout/container";
import { TestimonialsContent, type TestimonialItem } from "@/components/common/TestimonialsContent";
import { getTestimonials, getTestimonialsByPlacement } from "@/lib/sanityClient";
import type { Testimonial } from "@/types/sanity";

function normalizeTestimonials(testimonials: Testimonial[]) {
  return testimonials
    .map((item): TestimonialItem | null => {
      if (!item.quote || !item.name) {
        return null;
      }

      const rating = Number.isFinite(item.rating) ? Math.min(5, Math.max(1, item.rating || 5)) : 5;

      return {
        quote: item.quote,
        name: item.name,
        role: item.role || "Verified Buyer",
        location: item.location || "USA",
        rating,
        image: item.image,
        contextImage: item.contextImage,
      };
    })
    .filter((item): item is TestimonialItem => Boolean(item));
}

async function getHomeTestimonials() {
  try {
    const byPlacement = await getTestimonialsByPlacement("homepage");
    const normalizedPlacement = normalizeTestimonials(byPlacement);
    if (normalizedPlacement.length > 0) {
      return normalizedPlacement;
    }

    const all = await getTestimonials();
    return normalizeTestimonials(all);
  } catch {
    return [];
  }
}

type HomeTestimonialsProps = {
  badge: string;
  heading: string;
  intro: string;
};

export async function HomeTestimonials({ badge, heading, intro }: HomeTestimonialsProps) {
  const testimonials = await getHomeTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-background text-foreground">
      <Container className="section-y">
        <TestimonialsContent
          badgeText={badge}
          heading={heading}
          intro={intro}
          testimonials={testimonials}
          showQuoteIcon
        />
      </Container>
    </section>
  );
}
