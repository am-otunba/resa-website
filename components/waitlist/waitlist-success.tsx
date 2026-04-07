"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

type WaitlistSuccessProps = {
  name: string;
  email: string;
  city: string;
  position: number | null;
};

export default function WaitlistSuccess({
  name,
  email,
  city,
  position,
}: WaitlistSuccessProps) {
  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 shadow-[0_0_80px_rgba(110,231,183,0.12)] backdrop-blur-2xl"
      >
        <Check className="h-9 w-9 text-emerald-200" />
      </motion.div>

      <p className="mb-4 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
        Spot reserved successfully
      </p>

      <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        You&apos;re number{" "}
        <span className="text-white/70">
          {position !== null ? position.toLocaleString() : "..."}
        </span>{" "}
        on the list 🎉
      </h2>

      <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
        Thanks, {firstName}. We&apos;ll keep you updated as early access opens
        in {city || "your city"}.
      </p>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/6 px-6 py-5 backdrop-blur-2xl">
        <p className="mt-2 text-sm leading-6 text-white/80">
          Watch your inbox at{" "}
          <span className="font-medium text-white">{email}</span> for product
          updates, freebies and special launch access.
        </p>
      </div>
    </div>
  );
}