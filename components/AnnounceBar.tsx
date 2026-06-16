"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const ANNOUNCE_DISMISS_KEY = "bv_announce_dismissed";

type AnnounceBarProps = {
  text?: string;
  href?: string;
};

export function AnnounceBar({
  text = "10% OFF all crypto payments (BTC, ETH, USDT).",
  href = "/how-to-buy",
}: AnnounceBarProps) {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    setVisible(window.localStorage.getItem(ANNOUNCE_DISMISS_KEY) !== "true");

    const onStorage = (event: StorageEvent) => {
      if (event.key === ANNOUNCE_DISMISS_KEY) {
        setVisible(event.newValue !== "true");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onDismiss = useCallback(() => {
    window.localStorage.setItem(ANNOUNCE_DISMISS_KEY, "true");
    setVisible(false);
  }, []);

  if (visible !== true) {
    return null;
  }

  return (
    <div className="glass-chrome border-chrome-b-primary text-foreground">
      <Container className="relative flex min-h-10 items-center py-2 sm:justify-center">
        <p className="w-full pr-10 text-center text-[10px] leading-relaxed font-medium uppercase tracking-[0.08em] sm:w-auto sm:pr-0 sm:text-xs">
          {text}{" "}
          <Link href={href} className="font-semibold text-primary underline underline-offset-2">
            Learn how to pay
          </Link>
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 h-7 w-7 -translate-y-1/2 shrink-0 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          onClick={onDismiss}
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      </Container>
    </div>
  );
}
