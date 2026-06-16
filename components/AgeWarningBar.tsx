import { Container } from "@/components/layout/container";

export function AgeWarningBar() {
  return (
    <div className="border-b border-border bg-secondary/70">
      <Container className="flex min-h-9 items-center justify-center py-2">
        <p className="text-center text-[10px] leading-relaxed font-medium uppercase tracking-[0.08em] text-foreground sm:text-xs">
          Must be 18+ to purchase. By continuing, you confirm your age.
        </p>
      </Container>
    </div>
  );
}
