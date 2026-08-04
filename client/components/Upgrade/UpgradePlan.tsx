"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const UpgradePlan = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Creator Pro",
      priceMonthly: 5,
      priceYearly: 2.5,
      description: "400 min / month (400 credits) of transcription included.",
      popular: false,
      features: [
        "400 min transcription / month",
        "65 min Text to Audio / month",
        "Fast + Accuracy mode",
        "Word-level timestamps",
        "99 languages",
        "Script to Magical Prompt Generation",
      ],
      buttonText: "Upgrade to Creator Pro",
      buttonVariant: "outline",
    },
    {
      name: "Growth",
      priceMonthly: 15,
      priceYearly: 7.5,
      description: "2000 min / month (2000 credits) of transcription included.",
      popular: true,
      features: [
        "2000 min transcription / month",
        "330 min Text to Audio / month",
        "Fast + Accuracy mode",
        "Word-level timestamps",
        "99 languages",
        "Script to Magical Prompt Generation",
      ],
      buttonText: "Upgrade to Growth",
      buttonVariant: "default",
    },
    {
      name: "Unlimited",
      priceMonthly: 49,
      priceYearly: 24.5,
      description: "Unlimited of transcription included.",
      popular: false,
      features: [
        "Unlimited transcription",
        "Unlimited Text to Audio",
        "Fast + Accuracy mode",
        "Word-level timestamps",
        "99 languages",
        "Script to Magical Prompt Generation",
      ],
      buttonText: "Upgrade to Unlimited",
      buttonVariant: "outline",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 lg:py-10 lg:px-16 w-full select-none space-y-8">
      {/* Header & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Upgrade Plan
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a plan that fits your workflow. You are currently on the{" "}
          <span className="font-semibold text-foreground">Free</span> plan.
        </p>
      </div>

      {/* Banner Notice */}
      <div className="rounded-xl border border-border/60 bg-card p-2 text-sm text-foreground flex items-center gap-3 shadow-xs">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <p>
          Upgrade to unlock{" "}
          <span className="font-semibold">Image Prompt Generation</span> and all
          other paid features.
        </p>
      </div>

      {/* Billing Cycle Toggle Switch */}
      <div className="flex justify-center items-center my-6">
        <div className="inline-flex items-center p-1 rounded-full bg-muted border border-border/60">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                billingCycle === "yearly"
                  ? "bg-indigo-500 text-white"
                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              Save 50%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, index) => {
          const currentPrice =
            billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <div
              key={index}
              className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-200 ${
                plan.popular
                  ? "bg-primary text-background border-2  shadow-xl "
                  : "bg-card text-card-foreground border border-border/80 shadow-xs hover:border-border"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-secondary text-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Popular
                </div>
              )}

              {/* Plan Header Info */}
              <div className="space-y-4">
                <div>
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider ${plan.popular ? "text-secondary" : "text-muted-foreground"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${currentPrice}
                    </span>
                    <span
                      className={`text-xs ${plan.popular ? "text-secondary" : "text-muted-foreground"}`}
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-3 leading-relaxed ${plan.popular ? "text-secondary" : "text-muted-foreground"}`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div
                  className={`h-px w-full ${plan.popular ? "bg-zinc-800" : "bg-border/60"}`}
                />

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-2.5 text-xs"
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? "text-indigo-400" : "text-foreground"}`}
                      />
                      <span
                        className={
                          plan.popular ? "text-secondary" : "text-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Button
                  variant={plan.popular ? "secondary" : "outline"}
                  className={`w-full h-11 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-background text-primary hover:bg-background/80"
                      : "hover:bg-accent hover:text-accent-foreground border-border"
                  }`}
                >
                  {plan.buttonText} →
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center pt-1">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Payments are securely processed via Paddle. Accepts all major cards
          and PayPal. Cancel anytime. By upgrading, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default UpgradePlan;
