"use client";

import { useState } from "react";
import { LuChevronRight, LuLoader } from "react-icons/lu";

import { checkout } from "@/checkout";

type ProductCheckoutButtonProps = {
  uid: string;
};

export function ProductCheckoutButton({ uid }: ProductCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);

    try {
      await checkout(uid);
    } catch (error) {
      console.error("Purchase failed:", error);
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-red-300/30 bg-gradient-to-r from-red-700 via-red-600 to-red-900 px-8 py-5 text-white shadow-2xl shadow-red-950/30 transition hover:scale-[1.02] hover:shadow-red-900/40 focus:ring-4 focus:ring-red-800/35 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 md:w-auto"
    >
      <span className="font-bold-slanted relative z-10 flex items-center gap-3 text-2xl tracking-wide uppercase md:text-3xl">
        {isLoading ? (
          <>
            <LuLoader className="size-7 animate-spin" />
            Loading
          </>
        ) : (
          <>
            Buy Now
            <LuChevronRight className="size-7 transition group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
}
