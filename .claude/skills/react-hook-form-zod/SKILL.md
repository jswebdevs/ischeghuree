---
name: react-hook-form-zod
description: "react-hook-form + Zod validation pattern for ginag-frontend. Use when building any form (order form, contact, admin CRUD, login). Encodes the schema-first pattern, conditional required fields, error display with theme tokens, and submit handling that posts via the project's axios instance."
trigger: build form
---

# react-hook-form + Zod (ginag-frontend)

Stack: `react-hook-form` ^7 + `zod` ^4 + `@hookform/resolvers/zod`. Forms are **schema-first** — the Zod schema is the single source of truth for validation, and `z.infer` gives the TS type.

## Standard form skeleton

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import api from "@/lib/axios";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof Schema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await api.post("/some-endpoint", values);
      toast.success("Saved");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase">Name *</label>
        <input
          {...register("name")}
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
      >
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
```

## Conditional required fields (Zod refinement)

For fields that are required only under certain conditions (e.g. `mailingAddress` is required only when `deliveryMethod === 'MAILING'`), use `superRefine`:

```ts
const Schema = z.object({
  deliveryMethod: z.enum(["PICKUP", "MAILING"]),
  mailingAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod === "MAILING" && !data.mailingAddress?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mailingAddress"],
      message: "Mailing address is required when shipping",
    });
  }
});
```

This keeps both client and server in sync (the backend re-validates the same shape in [customOrder.controller.ts](../../../ginag-backend/src/controllers/customOrder.controller.ts)).

## Watching values for conditional UI

```ts
const { watch } = useForm({...});
const deliveryMethod = watch("deliveryMethod");
{deliveryMethod === "MAILING" && <MailingAddressInput />}
```

## Theme-aware styling

Always use the project's CSS-variable utilities (`bg-background`, `border-border`, `text-primary`, `text-destructive`) for inputs and errors so forms work in light + dark mode. See the [tailwind-v4-theme skill](../tailwind-v4-theme/SKILL.md).

## Existing reference forms

- Order form: `ginag-frontend/src/app/order-now/page.tsx`
- Login: `ginag-frontend/src/app/login/page.tsx`
- Contact: `ginag-frontend/src/components/templates/ContactTemplate.tsx`

When in doubt, copy the closest existing form and adapt — they all share the same skeleton above.
