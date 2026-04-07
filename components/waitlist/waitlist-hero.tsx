"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import WaitlistSuccess from "@/components/waitlist/waitlist-success";

type Step = "intro" | "name" | "email" | "city" | "role" | "success";
type Role = "renter" | "landlord" | "";

type FormData = {
  name: string;
  email: string;
  city: string;
  role: Role;
};

const TOTAL_QUESTIONS = 4;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const stageTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function WaitlistHero() {
  const [step, setStep] = useState<Step>("intro");
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);

  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(true);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    city: "",
    role: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "name" || step === "email" || step === "city") {
      const id = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 120);

      return () => window.clearTimeout(id);
    }
  }, [step]);

  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        setCountLoading(true);

        const res = await fetch(`${BACKEND_URL}/api/waitlist-count`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch waitlist count");
        }

        setWaitlistCount(data.count);
      } catch (error) {
        console.error("Failed to fetch waitlist count:", error);
        setWaitlistCount(null);
      } finally {
        setCountLoading(false);
      }
    };

    fetchWaitlistCount();
  }, []);

  const currentQuestionIndex = useMemo(() => {
    switch (step) {
      case "name":
        return 1;
      case "email":
        return 2;
      case "city":
        return 3;
      case "role":
        return 4;
      default:
        return 0;
    }
  }, [step]);

  const canContinue = useMemo(() => {
    switch (step) {
      case "name":
        return form.name.trim().length >= 2;
      case "email":
        return isValidEmail(form.email.trim());
      case "city":
        return form.city.trim().length >= 2;
      case "role":
        return form.role === "renter" || form.role === "landlord";
      default:
        return false;
    }
  }, [form, step]);

  function goToNextStep() {
    if (step === "intro") {
      setDirection(1);
      setStep("name");
      return;
    }

    if (!canContinue || submitting) return;

    setDirection(1);

    if (step === "name") {
      setStep("email");
      return;
    }

    if (step === "email") {
      setStep("city");
      return;
    }

    if (step === "city") {
      setStep("role");
      return;
    }

    if (step === "role") {
      void handleSubmit();
    }
  }

  function goToPreviousStep() {
    if (submitting) return;

    setDirection(-1);

    if (step === "email") {
      setStep("name");
      return;
    }

    if (step === "city") {
      setStep("email");
      return;
    }

    if (step === "role") {
      setStep("city");
    }
  }

 async function handleSubmit() {
  if (!canContinue) return;

  try {
    setSubmitting(true);

    const res = await fetch(`${BACKEND_URL}/api/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        location: form.city,
        user_type: form.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    console.log("Backend response:", data);

    setWaitlistPosition(data.position ?? null);
    setWaitlistCount((prev) =>
      typeof prev === "number"
        ? Math.max(prev, data.position ?? prev)
        : (data.position ?? null)
    );

    setDirection(1);
    setStep("success");
  } catch (error) {
    console.error("Failed to submit waitlist form:", error);
    alert("Something went wrong. Try again.");
  } finally {
    setSubmitting(false);
  }
}

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      goToNextStep();
    }
  }

  const stageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 18 : -18,
      filter: "blur(8px)",
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: stageTransition,
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -18 : 18,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section className="relative flex flex-1 items-center justify-center py-10">
      <div className="relative flex min-h-130 w-full items-center justify-center">
        <div className="relative w-full max-w-3xl">
          {(step === "name" ||
            step === "email" ||
            step === "city" ||
            step === "role") && (
            <div className="mb-8 flex items-center justify-center">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                Step {currentQuestionIndex} of {TOTAL_QUESTIONS}
              </div>
            </div>
          )}

          <div className="relative min-h-105">
            <AnimatePresence mode="wait" custom={direction}>
              {step === "intro" && (
                <motion.div
                  key="intro"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-medium text-[#1f2937] shadow-sm">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    {countLoading
                      ? "Loading waitlist..."
                      : `${(waitlistCount ?? 0).toLocaleString()} people are on waitlist`}
                  </div>

                  <h1 className="max-w-225 text-center text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Find Rentals with{" "}
                    <span className="font-serif text-[0.98em] italic font-normal">
                      Clarity
                    </span>
                  </h1>

                  <p className="mt-5 max-w-160 text-center text-[0.98rem] leading-7 text-white/70 sm:text-base">
                    We help you discover better rental options faster. A calmer,
                    more modern renting experience built for people who want
                    ease, trust, and speed.
                  </p>

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="mt-8 inline-flex min-w-37 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-[0.95rem] font-semibold text-[#111827] shadow-[0_14px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.98)] transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#fbfdff] hover:shadow-[0_18px_40px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,1)]"
                  >
                    Get Started
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {step === "name" && (
                <motion.div
                  key="name"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <QuestionLabel>What&apos;s your name?</QuestionLabel>

                  <QuestionInput
                    ref={inputRef}
                    value={form.name}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, name: value }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Your full name"
                  />

                  <StepActions
                    onNext={goToNextStep}
                    nextDisabled={!canContinue}
                    nextLabel="Enter"
                  />
                </motion.div>
              )}

              {step === "email" && (
                <motion.div
                  key="email"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <QuestionLabel>Hey there {form.name}, what&apos;s your email?</QuestionLabel>

                  <QuestionInput
                    ref={inputRef}
                    value={form.email}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, email: value }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    inputMode="email"
                  />

                  <StepActions
                    onBack={goToPreviousStep}
                    onNext={goToNextStep}
                    nextDisabled={!canContinue}
                    nextLabel="Enter"
                  />
                </motion.div>
              )}

              {step === "city" && (
                <motion.div
                  key="city"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <QuestionLabel> Okay {form.name}, what city are you based in?</QuestionLabel>

                  <QuestionInput
                    ref={inputRef}
                    value={form.city}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, city: value }))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Lagos"
                  />

                  <StepActions
                    onBack={goToPreviousStep}
                    onNext={goToNextStep}
                    nextDisabled={!canContinue}
                    nextLabel="Enter"
                  />
                </motion.div>
              )}

              {step === "role" && (
                <motion.div
                  key="role"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <QuestionLabel>What best describes you?</QuestionLabel>

                  <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                    <RoleCard
                      label="Renter"
                      selected={form.role === "renter"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: "renter" }))
                      }
                    />
                    <RoleCard
                      label="Landlord"
                      selected={form.role === "landlord"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: "landlord" }))
                      }
                    />
                  </div>

                  <StepActions
                    onBack={goToPreviousStep}
                    onNext={goToNextStep}
                    nextDisabled={!canContinue || submitting}
                    nextLabel={submitting ? "Joining..." : "Join Waitlist"}
                  />
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  custom={direction}
                  variants={stageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <WaitlistSuccess
                    name={form.name}
                    email={form.email}
                    city={form.city}
                    position={waitlistPosition}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
      {children}
    </h2>
  );
}

type QuestionInputProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

const QuestionInput = React.forwardRef<HTMLInputElement, QuestionInputProps>(
  ({ value, onChange, onKeyDown, placeholder, inputMode }, ref) => {
    return (
      <div className="mt-8 w-full max-w-xl">
        <div className="rounded-[30px] border border-white/20 bg-white/12 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-3">
            <input
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              inputMode={inputMode}
              className="h-14 w-full rounded-[18px] border border-white/10 bg-white/14 px-5 text-center text-base text-white placeholder:text-white/45 outline-none transition duration-150 ease-out focus:border-white/30 focus:bg-white/18 sm:text-lg"
            />
          </div>
        </div>
      </div>
    );
  }
);

QuestionInput.displayName = "QuestionInput";

type StepActionsProps = {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
};

function StepActions({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: StepActionsProps) {
  return (
    <div className="mt-8 flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white/80 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition duration-150 ease-out hover:bg-white/15"
        >
          Back
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#111827] shadow-[0_14px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.98)] transition duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#fbfdff] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        {nextLabel}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

type RoleCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function RoleCard({ label, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[28px] border px-6 py-6 text-left backdrop-blur-2xl transition-all",
        selected
          ? "border-white/40 bg-white text-[#111827] shadow-[0_14px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.98)]"
          : "border-white/10 bg-white/14 text-white hover:bg-white/18",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">{label}</span>
        <span
          className={[
            "h-5 w-5 rounded-full border transition",
            selected
              ? "border-[#111827] bg-[#111827]"
              : "border-white/25 bg-transparent",
          ].join(" ")}
        />
      </div>
    </button>
  );
}