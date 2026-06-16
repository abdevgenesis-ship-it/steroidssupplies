import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { LegalSection } from "@/lib/siteContent";

type AgeVerificationPolicyProps = {
  sections: LegalSection[];
  supportEmail?: string;
};

function renderEmail(paragraph: string, supportEmail?: string) {
  if (!supportEmail || !paragraph.includes(supportEmail)) {
    return renderTextWithBold(paragraph);
  }

  const [before, after] = paragraph.split(supportEmail, 2);
  return (
    <>
      {renderTextWithBold(before)}
      <a href={`mailto:${supportEmail}`} className="text-accent-foreground underline hover:opacity-75">
        {supportEmail}
      </a>
      {renderTextWithBold(after)}
    </>
  );
}

export function AgeVerificationPolicy({ sections, supportEmail }: AgeVerificationPolicyProps) {
  return (
    <div className="space-y-7 sm:space-y-8">
      {sections.map((section, index) => {
        const Heading = index === 0 ? "h2" : "h3";

        return (
          <section key={section.title} className="space-y-2">
            <Heading className="text-base font-semibold text-foreground sm:text-lg">{section.title}</Heading>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {renderEmail(paragraph, supportEmail)}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 ? (
              <ul className="list-outside list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {section.bullets.map((item) => (
                  <li key={item}>{renderEmail(item, supportEmail)}</li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
