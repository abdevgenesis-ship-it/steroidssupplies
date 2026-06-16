"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyAddressButtonProps = {
  address: string;
  className?: string;
  label?: string;
};

export function CopyAddressButton({ address, className, label = "Copy address" }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("shrink-0 rounded-2xl", className)}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-4 w-4 text-highlight" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
    </Button>
  );
}
