import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from '@/config/seo';
import React from 'react';

/**
 * JsonLdProvider injects structured data (JSON-LD) into the page.
 * This component adds Organization and Website schemas for Google.
 */
export function JsonLdProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        suppressHydrationWarning
      />
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        suppressHydrationWarning
      />
      {children}
    </>
  );
}
