import { Container } from "@/components/layout/container";
import type { Brand } from "@/types/sanity";

type HomeBrandPartnersProps = {
  brands: Brand[];
  eyebrow: string;
  heading: string;
  emptyMessage: string;
};

export function HomeBrandPartners({ brands, eyebrow, heading, emptyMessage }: HomeBrandPartnersProps) {
  const brandList = brands.slice(0, 5);

  return (
    <section className="bg-muted/50 text-foreground">
      <Container className="section-y-tight">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {eyebrow}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
        </div>

        {brandList.length > 0 ? (
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-md overflow-hidden rounded-lg border border-border/50 glass-surface">
              <table className="w-full border-collapse">
                <tbody>
                  {brandList.map((brand, index) => (
                    <tr 
                      key={brand._id} 
                      className={`transition-colors duration-300 hover:bg-muted/50 ${
                        index !== brandList.length - 1 ? "border-b border-border/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-center font-medium text-foreground/90 sm:text-lg">
                        {brand.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </Container>
    </section>
  );
}
