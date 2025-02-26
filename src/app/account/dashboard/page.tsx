"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import PixieButton from "@/components/buttons/PixieButton";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";

export default function Home() {
  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const router = useRouter();

  const handleClick = () => {
    router.push("/portfolio");
  };

  return (
    <div className="space-y-4 text-center items-center">
      <PixieButton
        onClick={handleClick}
        label={messages?.portfolio?.button?.label}
        disabled={false}
      />
    </div>
  );
}
