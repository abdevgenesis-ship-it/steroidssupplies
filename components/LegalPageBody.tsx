import type { LegalSection } from "@/lib/siteContent";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

type LegalPageBodyProps = {
  sections: LegalSection[];
  supportEmail?: string;
};

function renderWithEmail(text: string, supportEmail?: string) {
  if (!supportEmail || !text.includes(supportEmail)) {
    return renderTextWithBold(text);
  }

  const [before, after] = text.split(supportEmail, 2);
  return (
    <>
      {renderTextWithBold(before)}
      <a href={`mailto:${supportEmail}`} className="text-accent-foreground underline">
        {supportEmail}
      </a>
      {renderTextWithBold(after)}
    </>
  );
}

export function LegalPageBody({ sections, supportEmail }: LegalPageBodyProps) {
  return (
    <div className="max-w-3xl space-y-8 sm:space-y-10">
      {sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {renderWithEmail(paragraph, supportEmail)}
            </p>
          ))}

          {section.bullets && section.bullets.length > 0 ? (
            <ul className="list-outside list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {section.bullets.map((item) => (
                <li key={item}>{renderWithEmail(item, supportEmail)}</li>
              ))}
            </ul>
          ) : null}

          {section.ordered && section.ordered.length > 0 ? (
            <ol className="list-outside list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {section.ordered.map((item) => (
                <li key={item}>{renderWithEmail(item, supportEmail)}</li>
              ))}
            </ol>
          ) : null}
        </section>
      ))}
    </div>
  );
}
