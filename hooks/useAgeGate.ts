"use client";

import { useCallback, useEffect, useState } from "react";

const AGE_GATE_COOKIE = "ss_age_verified";
const COOKIE_DAYS = 30;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const raw = parts.pop()?.split(";").shift()?.trim() ?? null;
    if (raw == null) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return null;
}

function getAgeVerifiedFromCookie(): boolean {
  return getCookie(AGE_GATE_COOKIE) === "true";
}

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function useAgeGate() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    setIsVerified(getAgeVerifiedFromCookie());
  }, []);

  const acceptAge = useCallback(() => {
    setCookie(AGE_GATE_COOKIE, "true", COOKIE_DAYS);
    setIsVerified(true);
  }, []);

  const declineAge = useCallback(() => {
    window.location.replace("https://www.google.com");
  }, []);

  const checking = isVerified === null;

  return {
    isChecking: checking,
    isVerified: isVerified === true,
    isOpen: isVerified === false,
    acceptAge,
    declineAge,
  };
}
