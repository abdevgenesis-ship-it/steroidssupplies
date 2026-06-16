import { FaWhatsapp } from "react-icons/fa";

const DEFAULT_WHATSAPP_NUMBER = "447418373634";

function normalizeWhatsAppNumber(value: string | undefined): string {
  const digits = (value ?? DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

function getWhatsAppHref(number: string): string {
  const message = encodeURIComponent("Hi, I have a question about your products.");
  return `https://wa.me/${number}?text=${message}`;
}

export function WhatsAppWidget() {
  const number = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  return (
    <a
      href={getWhatsAppHref(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-[5.75rem] right-5 z-[999990] flex size-[3.75rem] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:right-6"
    >
      <FaWhatsapp className="size-8" aria-hidden />
    </a>
  );
}
