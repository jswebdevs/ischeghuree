"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import type { AxiosError } from "axios";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Schema = z
  .object({
    customerName: z.string().min(1, "নাম আবশ্যক — Name is required").max(120),
    customerPhone: z
      .string()
      .min(1, "মোবাইল নম্বর আবশ্যক — Cell number is required")
      .max(40)
      .refine((v) => /\d/.test(v), "সঠিক মোবাইল নম্বর দিন — Enter a valid cell number"),
    customerEmail: z
      .string()
      .max(160)
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || EMAIL_RE.test(v.trim()), "ইমেইল ঠিকানাটি সঠিক নয় — Invalid email address"),
    productDetails: z
      .string()
      .min(1, "পণ্যের বিবরণ আবশ্যক — Product details are required")
      .max(2000),
    quantity: z
      .string()
      .max(10)
      .optional()
      .or(z.literal(""))
      .refine(
        (v) => !v || !v.trim() || (/^\d+$/.test(v.trim()) && parseInt(v.trim(), 10) > 0),
        "পরিমাণ একটি ধনাত্মক সংখ্যা হতে হবে — Quantity must be a positive whole number",
      ),
    orderType: z.enum(["RETAIL", "WHOLESALE"], {
      message: "খুচরা বা পাইকারী নির্বাচন করুন — Choose retail or wholesale",
    }),
    deliveryMethod: z.enum(["PICKUP", "MAILING"], {
      message: "ডেলিভারি পদ্ধতি নির্বাচন করুন — Choose pick up or delivery",
    }),
    mailingAddress: z.string().max(2000).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "MAILING" && (!data.mailingAddress || !data.mailingAddress.trim())) {
      ctx.addIssue({
        code: "custom",
        path: ["mailingAddress"],
        message: "ডেলিভারি ঠিকানা আবশ্যক — Delivery address is required",
      });
    }
  });

type FormValues = z.infer<typeof Schema>;

interface OrderFormProps {
  /** Seeded from ?product=<slug> by the page, so an "Order This" click arrives
   *  with the product already described. Empty for a direct visit. */
  defaultProductDetails?: string;
}

export default function OrderForm({ defaultProductDetails = "" }: OrderFormProps) {
  const [submitted, setSubmitted] = useState<{ orderNumber: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: standardSchemaResolver(Schema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      productDetails: defaultProductDetails,
      quantity: "",
      orderType: "RETAIL",
      deliveryMethod: "PICKUP",
      mailingAddress: "",
      notes: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form's watch() is not memoizable; the compiler skips this component, which is the expected trade-off
  const orderType = watch("orderType");
  const deliveryMethod = watch("deliveryMethod");

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        customerName: values.customerName.trim(),
        customerPhone: values.customerPhone.trim(),
        customerEmail: values.customerEmail?.trim() || undefined,
        productDetails: values.productDetails.trim(),
        quantity: values.quantity?.trim() ? parseInt(values.quantity.trim(), 10) : undefined,
        orderType: values.orderType,
        deliveryMethod: values.deliveryMethod,
        mailingAddress:
          values.deliveryMethod === "MAILING" ? values.mailingAddress?.trim() : undefined,
        notes: values.notes?.trim() || undefined,
      };
      const res = await api.post("/custom-orders", payload);
      const orderNumber = res.data?.data?.orderNumber || "—";
      setSubmitted({ orderNumber });
      reset();
      toast.success("অর্ডার গৃহীত হয়েছে — Order received!", {
        description: `Confirmation #${orderNumber}`,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || "অর্ডার পাঠানো যায়নি — Failed to submit order. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="relative text-center py-12 px-6">
        <KiteRibbon className="mx-auto mb-6 max-w-[220px]" />
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-primary/10 text-primary border-2 border-primary/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-heading mb-1">অর্ডার গৃহীত হয়েছে</h2>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          Order Received
        </p>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
          ধন্যবাদ! আমরা শীঘ্রই আপনার অর্ডার নিশ্চিত করতে যোগাযোগ করব।
          <span className="block mt-1 text-xs">
            Thanks — we&apos;ll reach out shortly to confirm your order.
          </span>
        </p>
        <div className="border border-border bg-muted/40 rounded-2xl p-4 mb-8 max-w-xs mx-auto">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Confirmation · কনফার্মেশন নম্বর
          </div>
          <div className="text-2xl font-black text-primary">{submitted.orderNumber}</div>
        </div>
        <button
          onClick={() => setSubmitted(null)}
          className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          আরেকটি অর্ডার দিন — Place another order
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative px-5 md:px-7 py-6 space-y-5 text-foreground"
      noValidate
    >
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-heading">অর্ডার ফর্ম</h2>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mt-0.5">
          Order Form
        </p>
        <KiteRibbon className="mt-3" />
      </div>

      {/* Name */}
      <TextField
        label="নাম — Name"
        required
        error={errors.customerName?.message}
        autoComplete="name"
        {...register("customerName")}
      />

      {/* Phone */}
      <TextField
        label="মোবাইল নম্বর — Cell number"
        required
        error={errors.customerPhone?.message}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
        {...register("customerPhone")}
      />

      {/* Email — optional */}
      <TextField
        label="ইমেইল — Email"
        hint="ঐচ্ছিক — Optional"
        error={errors.customerEmail?.message}
        type="email"
        autoComplete="email"
        {...register("customerEmail")}
      />

      {/* Product details */}
      <div className="space-y-1.5">
        <FieldLabel required>কী বানাতে/নিতে চান — Product details</FieldLabel>
        <textarea
          rows={3}
          placeholder="যেমন: পাটের টোট ব্যাগ ২টি, কমলা হাতল — e.g. 2 jute tote bags with orange handles"
          {...register("productDetails")}
          // Rendered onto the element as well as into useForm's defaultValues:
          // that puts the prefill in the server HTML (no empty-then-filled
          // flash) and does not depend on react-hook-form writing the DOM value
          // at mount, which reactCompiler's memoization of this component
          // suppresses. RHF still reads the live DOM value on submit.
          defaultValue={defaultProductDetails}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground/60"
        />
        {errors.productDetails && <FieldError>{errors.productDetails.message}</FieldError>}
      </div>

      {/* Quantity + Order type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="পরিমাণ — Quantity"
          hint="ঐচ্ছিক — Optional"
          error={errors.quantity?.message}
          inputMode="numeric"
          placeholder="e.g. 12"
          {...register("quantity")}
        />

        <div className="space-y-1.5">
          <FieldLabel>অর্ডারের ধরন — Order type</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <RadioCard
              {...register("orderType")}
              value="RETAIL"
              checked={orderType === "RETAIL"}
              title="খুচরা"
              subtitle="Retail"
            />
            <RadioCard
              {...register("orderType")}
              value="WHOLESALE"
              checked={orderType === "WHOLESALE"}
              title="পাইকারী"
              subtitle="Wholesale"
            />
          </div>
          {errors.orderType && <FieldError>{errors.orderType.message}</FieldError>}
        </div>
      </div>

      {/* Delivery method */}
      <div className="space-y-1.5">
        <FieldLabel>ডেলিভারি পদ্ধতি — Delivery method</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <RadioCard
            {...register("deliveryMethod")}
            value="PICKUP"
            checked={deliveryMethod === "PICKUP"}
            title="পিক আপ"
            subtitle="Pick up"
          />
          <RadioCard
            {...register("deliveryMethod")}
            value="MAILING"
            checked={deliveryMethod === "MAILING"}
            title="ডেলিভারি"
            subtitle="Home delivery"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          ঢাকার ভেতরে ও বাইরে কুরিয়ারে ডেলিভারি — delivery charge confirmed when we call you.
        </p>
        {errors.deliveryMethod && <FieldError>{errors.deliveryMethod.message}</FieldError>}
      </div>

      {/* Delivery address — only when delivery selected */}
      {deliveryMethod === "MAILING" && (
        <div className="space-y-1.5">
          <FieldLabel required>ডেলিভারি ঠিকানা — Delivery address</FieldLabel>
          <textarea
            rows={2}
            placeholder="বাসা/রোড/এলাকা, শহর — House, road, area, city"
            {...register("mailingAddress")}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground/60"
          />
          {errors.mailingAddress && <FieldError>{errors.mailingAddress.message}</FieldError>}
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1.5">
        <FieldLabel hint="ঐচ্ছিক — Optional">অতিরিক্ত নোট — Notes</FieldLabel>
        <textarea
          rows={2}
          placeholder="রং, সাইজ বা অন্য কোনো অনুরোধ — colour, size or any special request"
          {...register("notes")}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-muted-foreground/60"
        />
        {errors.notes && <FieldError>{errors.notes.message}</FieldError>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs bg-primary text-primary-foreground shadow-theme-sm hover:shadow-theme-md hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2 justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> পাঠানো হচ্ছে… Sending…
          </span>
        ) : (
          "অর্ডার পাঠান — Submit Order"
        )}
      </button>
    </form>
  );
}

/* ───────── Inline sub-components ───────── */

/** Thin four-colour ribbon in the kite facet colours — the brand divider. */
function KiteRibbon({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-1 rounded-full overflow-hidden ${className}`} aria-hidden="true">
      <span className="flex-1" style={{ background: "var(--kite-cyan)" }} />
      <span className="flex-1" style={{ background: "var(--kite-orange)" }} />
      <span className="flex-1" style={{ background: "var(--kite-magenta)" }} />
      <span className="flex-1" style={{ background: "var(--kite-green)" }} />
    </div>
  );
}

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block text-xs font-bold text-heading tracking-wide">
      {children}
      {required && <span className="ml-1 text-accent">*</span>}
      {hint && (
        <span className="ml-2 font-medium text-[10px] text-muted-foreground">({hint})</span>
      )}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-destructive">{children}</p>;
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, required, hint, className = "", ...rest }, ref) => (
    <div className="space-y-1.5">
      <FieldLabel required={required} hint={hint}>
        {label}
      </FieldLabel>
      <input
        ref={ref}
        {...rest}
        className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 ${className}`}
      />
      {error && <FieldError>{error}</FieldError>}
    </div>
  ),
);
TextField.displayName = "TextField";

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  subtitle: string;
  checked?: boolean;
}
const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  ({ title, subtitle, checked, ...rest }, ref) => (
    <label
      className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-xl border-2 text-center cursor-pointer transition-all select-none ${
        checked
          ? "border-primary bg-primary/10 text-primary shadow-theme-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/40"
      }`}
    >
      <input ref={ref} type="radio" className="sr-only" {...rest} />
      <span className="text-sm font-bold">{title}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
        {subtitle}
      </span>
    </label>
  ),
);
RadioCard.displayName = "RadioCard";
