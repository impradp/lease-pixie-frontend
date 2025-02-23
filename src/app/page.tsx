"use client";

import PixieButton from "@/components/buttons/PixieButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/portfolio");
  };

  return (
    <div className="space-y-4 text-center">
      <PixieButton
        onClick={handleClick}
        label="Add Portfolio"
        disabled={false}
      />
    </div>
  );
}
