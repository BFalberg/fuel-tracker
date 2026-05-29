import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Link, router, useForm, usePage, Head, Deferred, createInertiaApp } from "@inertiajs/react";
import { Banknote, Plus, MoreVertical, Pencil, Trash2, ChevronDownIcon, Car, User, CircleDollarSign, ChevronRight, Settings, LogOut, ChartNoAxesColumnDecreasing, MapPin, Fuel, CheckIcon, XIcon, BanknoteIcon, Gauge, ChevronLeft, LoaderCircle, Wallet, Coins, ChartNoAxesCombined, Sun, Moon, Monitor } from "lucide-react";
import * as React from "react";
import { useState, useEffect, Fragment as Fragment$1, useCallback, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { Transition } from "@headlessui/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-button text-button-foreground border border-button-border shadow-xs hover:bg-button/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-button-border/20 bg-button/20 shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-4 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn("flex flex-col gap-1.5 px-6", className),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuGroup({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function CarExpensesList({ expenses, carId }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-2xl", children: [
        /* @__PURE__ */ jsx(Banknote, { className: "size-6" }),
        "Expenses"
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "default", size: "sm", children: /* @__PURE__ */ jsxs(Link, { href: route("cars.expenses.create", { car: carId }), children: [
        /* @__PURE__ */ jsx(Plus, {}),
        " Expense"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { children: expenses.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "No expenses found." }) : /* @__PURE__ */ jsx("ul", { className: "divide-border flex flex-col", children: expenses.map((expense) => /* @__PURE__ */ jsx("li", { className: "relative mt-4 flex flex-col gap-1 border-t pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between rounded-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-foreground text-base font-medium", children: /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: expense.expense_type }) }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("cars.expenses.edit", { car: carId, expense: expense.id }),
                className: "flex items-center",
                children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                  "Edit"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => router.delete(route("cars.expenses.destroy", { car: carId, expense: expense.id })),
                className: "text-red-600",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                  "Delete"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2 text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "col-span-2", children: new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(expense.amount) }),
        expense.vendor && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: expense.vendor }),
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: expense.invoice_date }),
        expense.description && /* @__PURE__ */ jsx("div", { className: "text-muted-foreground col-span-2 mt-1", children: expense.description })
      ] })
    ] }) }, expense.id)) }) }) })
  ] });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarExpensesList
}, Symbol.toStringTag, { value: "Module" }));
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function NativeSelect({ className, ...props }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group/native-select relative has-[select:disabled]:opacity-50 w-full",
      "data-slot": "native-select-wrapper",
      children: [
        /* @__PURE__ */ jsx(
          "select",
          {
            "data-slot": "native-select",
            className: cn(
              "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              className
            ),
            ...props
          }
        ),
        /* @__PURE__ */ jsx(
          ChevronDownIcon,
          {
            className: "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none",
            "aria-hidden": "true",
            "data-slot": "native-select-icon"
          }
        )
      ]
    }
  );
}
function NativeSelectOption({ ...props }) {
  return /* @__PURE__ */ jsx("option", { "data-slot": "native-select-option", ...props });
}
function Create({ car }) {
  const { data, setData, post, processing, errors } = useForm({
    expense_type: "",
    amount: "",
    description: "",
    vendor: "",
    invoice_date: ""
  });
  function handleSubmit(e) {
    e.preventDefault();
    post(route("cars.expenses.store", { car: car.id }));
  }
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-xl py-8", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { children: [
      "Add Expense for ",
      car.name
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Type" }),
        /* @__PURE__ */ jsxs(NativeSelect, { value: data.expense_type, onChange: (e) => setData("expense_type", e.target.value), required: true, children: [
          /* @__PURE__ */ jsx(NativeSelectOption, { value: "", disabled: true, children: "Vælg type" }),
          /* @__PURE__ */ jsx(NativeSelectOption, { value: "Værksted", children: "Værksted" }),
          /* @__PURE__ */ jsx(NativeSelectOption, { value: "Forsikring", children: "Forsikring" }),
          /* @__PURE__ */ jsx(NativeSelectOption, { value: "Afgift", children: "Afgift" }),
          /* @__PURE__ */ jsx(NativeSelectOption, { value: "Tilkøb", children: "Tilkøb" })
        ] }),
        errors.expense_type && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-500", children: errors.expense_type })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Description" }),
        /* @__PURE__ */ jsx(Input, { value: data.description, onChange: (e) => setData("description", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Vendor" }),
        /* @__PURE__ */ jsx(Input, { value: data.vendor, onChange: (e) => setData("vendor", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Invoice Date" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: data.invoice_date, onChange: (e) => setData("invoice_date", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Amount" }),
        /* @__PURE__ */ jsx(Input, { type: "number", value: data.amount, onChange: (e) => setData("amount", e.target.value), required: true }),
        errors.amount && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-500", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "mt-4 w-full", children: "Create Expense" })
    ] }) })
  ] }) });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create
}, Symbol.toStringTag, { value: "Module" }));
function Edit({ car, expense }) {
  const { data, setData, put, processing, errors } = useForm({
    expense_type: expense.expense_type || "",
    amount: expense.amount || "",
    description: expense.description || "",
    vendor: expense.vendor || "",
    invoice_date: expense.invoice_date || ""
  });
  function handleSubmit(e) {
    e.preventDefault();
    put(route("cars.expenses.update", { car: car.id, expense: expense.id }));
  }
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-xl py-8", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { children: [
      "Edit Expense for ",
      car.name
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Type" }),
        /* @__PURE__ */ jsx(Input, { value: data.expense_type, onChange: (e) => setData("expense_type", e.target.value), required: true }),
        errors.expense_type && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-500", children: errors.expense_type })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Amount" }),
        /* @__PURE__ */ jsx(Input, { type: "number", value: data.amount, onChange: (e) => setData("amount", e.target.value), required: true }),
        errors.amount && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-500", children: errors.amount })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Description" }),
        /* @__PURE__ */ jsx(Input, { value: data.description, onChange: (e) => setData("description", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Vendor" }),
        /* @__PURE__ */ jsx(Input, { value: data.vendor, onChange: (e) => setData("vendor", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1 block text-xs", children: "Invoice Date" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: data.invoice_date, onChange: (e) => setData("invoice_date", e.target.value) })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "mt-4 w-full", children: "Update Expense" })
    ] }) })
  ] }) });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit
}, Symbol.toStringTag, { value: "Module" }));
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-auto",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function CarCard({ car, onDelete }) {
  var _a;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: /* @__PURE__ */ jsx(Link, { href: route("cars.show", { car: car.id }), className: "hover:underline", children: car.name }) }),
        /* @__PURE__ */ jsx(Badge, { variant: car.is_electric ? "secondary" : "outline", children: car.is_electric ? "EV" : "Fossil" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("cars.edit", { car: car.id }), className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
            "Edit"
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onDelete == null ? void 0 : onDelete(car), className: "text-red-600", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
            "Delete"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground col-span-2 flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Car, { className: "size-5" }),
        car.registration_number
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground col-span-3 flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(User, { className: "size-5" }),
        ((_a = car.user) == null ? void 0 : _a.name) ?? "-"
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarCard
}, Symbol.toStringTag, { value: "Module" }));
function CarCosts({
  expenses = [],
  refuels = [],
  startMilage,
  purchasePrice = null,
  salePrice = null
}) {
  const totalExpenseCost = (expenses ?? []).reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalRefuelCost = (refuels ?? []).reduce((sum, refuel) => sum + Number(refuel.total_price), 0);
  const milages = (refuels ?? []).map((r) => Number(r.mileage));
  const minMilage = startMilage ?? (milages.length > 0 ? Math.min(...milages) : 0);
  const maxMilage = milages.length > 0 ? Math.max(...milages) : minMilage;
  const kmDriven = maxMilage - minMilage;
  const purchasePriceValue = Number(purchasePrice) || 0;
  const salePriceValue = Number(salePrice) || 0;
  const totalCost = purchasePriceValue + totalExpenseCost + totalRefuelCost - salePriceValue;
  const refuelPerKm = kmDriven > 0 ? totalRefuelCost / kmDriven : 0;
  const expensePerKm = kmDriven > 0 ? totalExpenseCost / kmDriven : 0;
  const totalPerKm = kmDriven > 0 ? totalCost / kmDriven : 0;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-2xl", children: [
      /* @__PURE__ */ jsx(CircleDollarSign, { className: "size-6" }),
      "Car Costs"
    ] }) }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs tracking-wide", children: "Total Expense" }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: totalExpenseCost.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs tracking-wide", children: "Total Refuel" }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: totalRefuelCost.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs tracking-wide", children: "Expense per km" }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-medium", children: expensePerKm.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs tracking-wide", children: "Refuel per km" }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-medium", children: refuelPerKm.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 mt-2 flex flex-col gap-2 border-t pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Total Cost:" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-medium", children: totalCost.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Total km driven:" }),
          /* @__PURE__ */ jsxs("span", { className: "text-lg font-medium", children: [
            kmDriven.toLocaleString("da-DK"),
            " km"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Total per km: " }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-medium", children: totalPerKm.toLocaleString("da-DK", { style: "currency", currency: "DKK" }) })
        ] })
      ] })
    ] }) }) })
  ] });
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarCosts
}, Symbol.toStringTag, { value: "Module" }));
function Heading({ level = 1, title, description }) {
  const Tag = `h${level}`;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsx(Tag, { className: "text-2xl font-semibold tracking-tight", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: description })
  ] }) });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(void 0);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator-root",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-primary/10 animate-pulse rounded-md", className),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background relative flex min-h-svh flex-1 flex-col",
        "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      ),
      ...props
    }
  );
}
cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function AppContent({ variant = "header", children, ...props }) {
  if (variant === "sidebar") {
    return /* @__PURE__ */ jsx(SidebarInset, { ...props, children });
  }
  return /* @__PURE__ */ jsx("main", { className: "mx-auto flex h-full w-full max-w-11/12 flex-1 flex-col gap-4 rounded-xl", ...props, children });
}
function Breadcrumb({ ...props }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...props });
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("hover:text-foreground transition-colors", className),
      ...props
    }
  );
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground font-normal", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
    }
  );
}
function Breadcrumbs({ breadcrumbs: breadcrumbs2 }) {
  return /* @__PURE__ */ jsx(Fragment, { children: breadcrumbs2.length > 0 && /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsx(BreadcrumbList, { children: breadcrumbs2.map((item, index) => {
    const isLast = index === breadcrumbs2.length - 1;
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: isLast ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.title }) : /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: item.href, children: item.title }) }) }),
      !isLast && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
    ] }, index);
  }) }) }) });
}
function Icon({ iconNode: IconComponent, className, ...props }) {
  return /* @__PURE__ */ jsx(IconComponent, { className: cn("h-4 w-4", className), ...props });
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    NavigationMenuPrimitive.Root,
    {
      "data-slot": "navigation-menu",
      "data-viewport": viewport,
      className: cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      ),
      ...props,
      children: [
        children,
        viewport && /* @__PURE__ */ jsx(NavigationMenuViewport, {})
      ]
    }
  );
}
function NavigationMenuList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.List,
    {
      "data-slot": "navigation-menu-list",
      className: cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      ),
      ...props
    }
  );
}
function NavigationMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.Item,
    {
      "data-slot": "navigation-menu-item",
      className: cn("relative", className),
      ...props
    }
  );
}
cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
);
function NavigationMenuViewport({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      ),
      children: /* @__PURE__ */ jsx(
        NavigationMenuPrimitive.Viewport,
        {
          "data-slot": "navigation-menu-viewport",
          className: cn(
            "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
            className
          ),
          ...props
        }
      )
    }
  );
}
function useInitials() {
  const getInitials = (fullName) => {
    const names = fullName.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };
  return getInitials;
}
function UserInfo({ user, showEmail = false }) {
  const getInitials = useInitials();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 overflow-hidden rounded-full", children: [
      /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
      /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-accent text-accent-foreground rounded-lg", children: getInitials(user.name) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
      /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: user.name }),
      showEmail && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground truncate text-xs", children: user.email })
    ] })
  ] });
}
function useMobileNavigation() {
  const cleanup = useCallback(() => {
    document.body.style.removeProperty("pointer-events");
  }, []);
  return cleanup;
}
function UserMenuContent({ user }) {
  const cleanup = useMobileNavigation();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: /* @__PURE__ */ jsx(UserInfo, { user, showEmail: true }) }) }),
    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
    /* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { className: "block w-full", href: route("profile.edit"), as: "button", prefetch: true, onClick: cleanup, children: [
      /* @__PURE__ */ jsx(Settings, { className: "mr-2" }),
      "Settings"
    ] }) }) }),
    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
    /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { className: "block w-full", method: "post", href: route("logout"), as: "button", onClick: cleanup, children: [
      /* @__PURE__ */ jsx(LogOut, { className: "mr-2" }),
      "Log out"
    ] }) })
  ] });
}
function AppLogoIcon(props) {
  return /* @__PURE__ */ jsx("svg", { ...props, viewBox: "0 0 40 42", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z"
    }
  ) });
}
function AppLogo() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex aspect-square size-8 items-center justify-center rounded-md", children: /* @__PURE__ */ jsx(AppLogoIcon, { className: "size-5 fill-current" }) }),
    /* @__PURE__ */ jsx("div", { className: "ml-1 grid flex-1 text-left text-sm", children: /* @__PURE__ */ jsx("span", { className: "mb-0.5 truncate leading-none font-semibold", children: "Fuel Tracker" }) })
  ] });
}
const getCreateUrl = (currentUrl) => {
  if (currentUrl.startsWith("/cars")) return "/cars/create";
  if (currentUrl.startsWith("/refuels")) return "/refuels/create";
  if (currentUrl.startsWith("/gas-stations")) return "/gas-stations/create";
  return "/refuels/create";
};
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartNoAxesColumnDecreasing
  },
  {
    title: "Cars",
    url: "/cars",
    icon: Car
  },
  {
    title: "Gas Stations",
    url: "/gas-stations",
    icon: MapPin
  },
  {
    title: "Refuels",
    url: "/refuels",
    icon: Fuel
  },
  {
    title: "Create",
    url: getCreateUrl,
    icon: Plus
  }
];
const activeItemStyles = "bg-accent-foreground text-accent";
const menuItemStyles = "flex flex-col items-center justify-center gap-1 p-1 text-[.5rem] rounded-xl text-center text-accent-foreground";
function AppHeader({ breadcrumbs: breadcrumbs2 = [] }) {
  const page = usePage();
  const { auth } = page.props;
  const getInitials = useInitials();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-11/12", children: /* @__PURE__ */ jsxs("div", { className: "border-accent mx-auto flex h-16 items-center border-b", children: [
      /* @__PURE__ */ jsx(Link, { href: "/dashboard", prefetch: true, className: "text-primary-foreground flex items-center space-x-2", children: /* @__PURE__ */ jsx(AppLogo, {}) }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center space-x-2", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "size-10 rounded-full p-1", children: /* @__PURE__ */ jsxs(Avatar, { className: "size-8 overflow-hidden rounded-full", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: auth.user.avatar, alt: auth.user.name }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-accent text-accent-foreground rounded-lg", children: getInitials(auth.user.name) })
        ] }) }) }),
        /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-56", align: "end", children: /* @__PURE__ */ jsx(UserMenuContent, { user: auth.user }) })
      ] }) })
    ] }) }),
    breadcrumbs2.length > 1 && /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 flex w-full border-b", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl", children: /* @__PURE__ */ jsx(Breadcrumbs, { breadcrumbs: breadcrumbs2 }) }) }),
    /* @__PURE__ */ jsx(
      NavigationMenu,
      {
        id: "app-navbar",
        className: "bg-accent fixed bottom-0 left-1/2 z-50 flex w-full max-w-11/12 -translate-1/2 items-center justify-center rounded-full px-4 py-2",
        children: /* @__PURE__ */ jsx(NavigationMenuList, { className: "grid w-full grid-cols-5 items-center justify-center", children: mainNavItems.map((item, index) => {
          const resolvedUrl = typeof item.url === "function" ? item.url(page.url) : item.url;
          return /* @__PURE__ */ jsx(NavigationMenuItem, { className: "", children: /* @__PURE__ */ jsxs(Link, { href: resolvedUrl, className: cn(menuItemStyles, page.url === resolvedUrl && activeItemStyles), children: [
            item.icon && /* @__PURE__ */ jsx(Icon, { iconNode: item.icon, className: "size-4" }),
            item.title
          ] }) }, index);
        }) })
      }
    )
  ] });
}
function AppShell({ children, variant = "header" }) {
  const [isOpen, setIsOpen] = useState(() => typeof window !== "undefined" ? localStorage.getItem("sidebar") !== "false" : true);
  const handleSidebarChange = (open) => {
    setIsOpen(open);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar", String(open));
    }
  };
  if (variant === "header") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen w-full flex-col gap-4 pb-32", children });
  }
  return /* @__PURE__ */ jsx(SidebarProvider, { defaultOpen: isOpen, open: isOpen, onOpenChange: handleSidebarChange, children });
}
function AppHeaderLayout({ children, breadcrumbs: breadcrumbs2 }) {
  return /* @__PURE__ */ jsxs(AppShell, { children: [
    /* @__PURE__ */ jsx(AppHeader, { breadcrumbs: breadcrumbs2 }),
    /* @__PURE__ */ jsx(AppContent, { children })
  ] });
}
const AppLayout = ({ children, breadcrumbs: breadcrumbs2, ...props }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("div", { className: "fixed -z-10", children: /* @__PURE__ */ jsxs("svg", { width: "359", height: "470", viewBox: "0 0 359 470", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("g", { filter: "url(#filter0_f_4_1777)", children: /* @__PURE__ */ jsx("ellipse", { cx: "7.5", cy: "118", rx: "257.5", ry: "258", fill: "#34D399", "fill-opacity": "0.1" }) }),
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
      "filter",
      {
        id: "filter0_f_4_1777",
        x: "-344",
        y: "-234",
        width: "703",
        height: "704",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [
          /* @__PURE__ */ jsx("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
          /* @__PURE__ */ jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
          /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "47", result: "effect1_foregroundBlur_4_1777" })
        ]
      }
    ) })
  ] }) }),
  /* @__PURE__ */ jsx(AppHeaderLayout, { breadcrumbs: breadcrumbs2, ...props, children })
] });
function InputError({ message, className = "", ...props }) {
  return message ? /* @__PURE__ */ jsx("p", { ...props, className: cn("text-sm text-red-600 dark:text-red-400", className), children: message }) : null;
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function CarForm({ formType, car }) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: (car == null ? void 0 : car.name) ?? "",
    registration_number: (car == null ? void 0 : car.registration_number) ?? "",
    start_milage: (car == null ? void 0 : car.start_milage) ?? "",
    purchase_price: (car == null ? void 0 : car.purchase_price) ?? "",
    sale_price: (car == null ? void 0 : car.sale_price) ?? "",
    is_electric: (car == null ? void 0 : car.is_electric) ?? false
  });
  useEffect(() => {
    if (car) {
      setData({
        name: car.name,
        registration_number: car.registration_number,
        start_milage: car.start_milage ?? "",
        purchase_price: car.purchase_price ?? "",
        sale_price: car.sale_price ?? "",
        is_electric: car.is_electric ?? false
      });
    } else {
      reset();
    }
  }, [car, reset, setData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "edit" && (car == null ? void 0 : car.id)) {
      put(`/cars/${car.id}`, {
        onSuccess: () => {
          reset();
        }
      });
    } else {
      post("/cars", {
        onSuccess: () => {
          reset();
        }
      });
    }
  };
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6 px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "name",
          type: "text",
          required: true,
          autoFocus: true,
          tabIndex: 1,
          autoComplete: "off",
          value: data.name,
          onChange: (e) => setData("name", e.target.value),
          placeholder: "Car name"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "registration_number", children: "Registration Number" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "registration_number",
          type: "text",
          required: true,
          tabIndex: 2,
          autoComplete: "off",
          value: data.registration_number,
          onChange: (e) => setData("registration_number", e.target.value),
          placeholder: "ABC123"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.registration_number })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Checkbox, { id: "is_electric", checked: data.is_electric, onCheckedChange: (checked) => setData("is_electric", Boolean(checked)) }),
      /* @__PURE__ */ jsx(Label, { htmlFor: "is_electric", children: "Electric vehicle (EV)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "start_milage", children: "Start Milage" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "start_milage",
          type: "number",
          tabIndex: 4,
          autoComplete: "off",
          value: data.start_milage,
          onChange: (e) => setData("start_milage", e.target.value === "" ? "" : Number(e.target.value)),
          placeholder: "0"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.start_milage })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "purchase_price", children: "Purchase Price" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "purchase_price",
          type: "number",
          tabIndex: 5,
          autoComplete: "off",
          value: data.purchase_price,
          onChange: (e) => setData("purchase_price", e.target.value === "" ? "" : Number(e.target.value)),
          placeholder: "0"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.purchase_price })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "sale_price", children: "Sale Price" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "sale_price",
          type: "number",
          tabIndex: 6,
          autoComplete: "off",
          value: data.sale_price,
          onChange: (e) => setData("sale_price", e.target.value === "" ? "" : Number(e.target.value)),
          placeholder: "0"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.sale_price })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", disabled: processing, children: formType === "edit" ? "Update Car" : "Create Car" }) })
  ] }) });
}
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarForm
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$c = [
  {
    title: "Create Car",
    href: "/cars/create"
  }
];
function CarCreate() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$c, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$c[0].title }),
    /* @__PURE__ */ jsx(CarForm, { formType: "create" })
  ] });
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarCreate
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$b = [
  {
    title: "Edit Car",
    href: "/cars/edit"
  }
];
function CarEdit({ car }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$b, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$b[0].title }),
    /* @__PURE__ */ jsx(CarForm, { formType: "edit", car })
  ] });
}
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CarEdit
}, Symbol.toStringTag, { value: "Module" }));
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [
            /* @__PURE__ */ jsx(XIcon, {}),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function DeleteConfirmation$2({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone."
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: onConfirm, children: "Delete" })
    ] })
  ] }) });
}
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DeleteConfirmation$2
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$a = [
  {
    title: "Cars",
    href: "/cars"
  }
];
function Cars({ cars }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const handleEdit = (car) => {
    setSelectedCar(car);
  };
  const handleDelete = (car) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (selectedCar) {
      router.delete(`/cars/${selectedCar.id}`);
      setIsDeleteOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$a, children: [
    /* @__PURE__ */ jsx(Head, { title: "Cars" }),
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$a[0].title }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 rounded-xl", children: [
      /* @__PURE__ */ jsx(
        Deferred,
        {
          data: "cars",
          fallback: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-32" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" })
            ] })
          ] }) }, index)) }),
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: (cars ?? []).map((car) => /* @__PURE__ */ jsx(CarCard, { car, onEdit: handleEdit, onDelete: handleDelete }, car.id)) })
        }
      ),
      selectedCar && /* @__PURE__ */ jsx(
        DeleteConfirmation$2,
        {
          open: isDeleteOpen,
          onOpenChange: setIsDeleteOpen,
          onConfirm: confirmDelete,
          title: `Delete ${selectedCar.name}`,
          description: `Are you sure you want to delete ${selectedCar.name}? This action cannot be undone.`
        }
      )
    ] })
  ] });
}
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cars
}, Symbol.toStringTag, { value: "Module" }));
function Show({ car, expenses, refuels, start_milage }) {
  var _a;
  const breadcrumbs2 = [
    {
      title: `${car.name}`,
      href: `/car/${car.id}`
    }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs2, children: [
    /* @__PURE__ */ jsx(Head, { title: "Cars" }),
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs2[0].title }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-3xl flex-col gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-2xl", children: [
          /* @__PURE__ */ jsx(Car, { className: "size-6" }),
          car.name
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Registration Number" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
              /* @__PURE__ */ jsx(Car, { className: "size-4" }),
              car.registration_number
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Owner" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
              /* @__PURE__ */ jsx(User, { className: "size-4" }),
              ((_a = car.user) == null ? void 0 : _a.name) ?? "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Purchase Price" }),
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: car.purchase_price != null ? new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(car.purchase_price) : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Sale Price" }),
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: car.sale_price != null ? new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(car.sale_price) : "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Start Milage" }),
            /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
              car.start_milage != null ? car.start_milage.toLocaleString("da-DK") : "-",
              " km"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "Type" }),
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: car.is_electric ? "EV" : "Fossil" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(
        Deferred,
        {
          data: ["expenses", "refuels"],
          fallback: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-40" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-32" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-28" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-32" }),
              Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }, index))
            ] }) })
          ] }),
          children: [
            /* @__PURE__ */ jsx(
              CarCosts,
              {
                expenses: expenses ?? [],
                refuels: refuels ?? [],
                startMilage: start_milage,
                purchasePrice: car.purchase_price,
                salePrice: car.sale_price
              }
            ),
            /* @__PURE__ */ jsx(CarExpensesList, { expenses: expenses ?? [], carId: car.id })
          ]
        }
      )
    ] })
  ] });
}
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Show
}, Symbol.toStringTag, { value: "Module" }));
function DeleteConfirmation$1({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone."
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: onConfirm, children: "Delete" })
    ] })
  ] }) });
}
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DeleteConfirmation$1
}, Symbol.toStringTag, { value: "Module" }));
function GasStationCard({ gasStation, onDelete }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsx(CardTitle, { children: gasStation.name }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("gas-stations.edit", { gas_station: gasStation.id }), className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
            "Edit"
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onDelete == null ? void 0 : onDelete(gasStation), className: "text-red-600", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
            "Delete"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsx(MapPin, { className: "size-5" }),
      gasStation.address
    ] }) })
  ] });
}
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasStationCard
}, Symbol.toStringTag, { value: "Module" }));
function GasStationForm({ formType, gasStation }) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: (gasStation == null ? void 0 : gasStation.name) ?? "",
    address: (gasStation == null ? void 0 : gasStation.address) ?? ""
  });
  useEffect(() => {
    if (gasStation) {
      setData({
        name: gasStation.name,
        address: gasStation.address
      });
    } else {
      reset();
    }
  }, [gasStation, reset, setData]);
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          if (!response.ok) {
            return;
          }
          const data2 = await response.json();
          const address = (data2 == null ? void 0 : data2.address) ?? {};
          const street = [address.road, address.house_number].filter(Boolean).join(" ");
          const locality = address.city || address.town || address.village || address.suburb || address.city_district;
          const cityLine = [address.postcode, locality].filter(Boolean).join(" ");
          const formatted = [street, cityLine].filter(Boolean).join(", ");
          if (formatted) {
            setData("address", formatted);
          } else if (data2 == null ? void 0 : data2.display_name) {
            setData("address", data2.display_name);
          }
        } catch {
        }
      },
      () => {
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "edit" && (gasStation == null ? void 0 : gasStation.id)) {
      put(`/gas-stations/${gasStation.id}`, {
        onSuccess: () => {
          reset();
        }
      });
    } else {
      post("/gas-stations", {
        onSuccess: () => {
          reset();
        }
      });
    }
  };
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6 px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "name",
          type: "text",
          required: true,
          autoFocus: true,
          tabIndex: 1,
          autoComplete: "off",
          value: data.name,
          onChange: (e) => setData("name", e.target.value),
          placeholder: "Gas station name"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "address", children: "Address" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "address",
          type: "text",
          required: true,
          tabIndex: 2,
          autoComplete: "off",
          value: data.address,
          onChange: (e) => setData("address", e.target.value),
          placeholder: "123 Main St"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.address }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: handleUseCurrentLocation, children: "Use current location" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", disabled: processing, tabIndex: 3, children: formType === "edit" ? "Update Gas Station" : "Create Gas Station" }) })
  ] }) });
}
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasStationForm
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$9 = [
  {
    title: "Create Gas Station",
    href: "/gas-stations/create"
  }
];
function GasStationCreate() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$9, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$9[0].title }),
    /* @__PURE__ */ jsx(GasStationForm, { formType: "create" })
  ] });
}
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasStationCreate
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$8 = [
  {
    title: "Edit Gas Station",
    href: "/gas-stations/edit"
  }
];
function GasStationEdit({ gasStation }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$8, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$8[0].title }),
    /* @__PURE__ */ jsx(GasStationForm, { formType: "edit", gasStation })
  ] });
}
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasStationEdit
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$7 = [
  {
    title: "Gas Stations",
    href: "/gas-stations"
  }
];
function GasStations({ gasStations }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const handleDelete = (station) => {
    setSelectedStation(station);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (selectedStation) {
      router.delete(`/gas-stations/${selectedStation.id}`);
      setIsDeleteOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$7, children: [
    /* @__PURE__ */ jsx(Head, { title: "Gas Stations" }),
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$7[0].title }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 rounded-xl", children: [
      /* @__PURE__ */ jsx(
        Deferred,
        {
          data: "gasStations",
          fallback: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-36" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-48" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" })
            ] })
          ] }) }, index)) }),
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: (gasStations ?? []).map((station) => /* @__PURE__ */ jsx(GasStationCard, { gasStation: station, onDelete: handleDelete }, station.id)) })
        }
      ),
      selectedStation && /* @__PURE__ */ jsx(
        DeleteConfirmation$1,
        {
          open: isDeleteOpen,
          onOpenChange: setIsDeleteOpen,
          onConfirm: confirmDelete,
          title: `Delete ${selectedStation.name}`,
          description: `Are you sure you want to delete ${selectedStation.name}? This action cannot be undone.`
        }
      )
    ] })
  ] });
}
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasStations
}, Symbol.toStringTag, { value: "Module" }));
function DeleteConfirmation({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone."
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: onConfirm, children: "Delete" })
    ] })
  ] }) });
}
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DeleteConfirmation
}, Symbol.toStringTag, { value: "Module" }));
function RefuelCard({ refuel, onDelete }) {
  var _a, _b;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK"
    }).format(amount);
  };
  const formatNumber = (number) => {
    return new Intl.NumberFormat("da-DK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("da-DK", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const isElectric = refuel.type ? refuel.type === "charge" : ((_a = refuel.car) == null ? void 0 : _a.is_electric) ?? false;
  const unitLabel = isElectric ? "kWh" : "L";
  const unitPriceLabel = isElectric ? "kr./kWh" : "kr./L";
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-start justify-between space-y-0 pb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: formatDate(refuel.created_at) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "text-muted-foreground h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: ((_b = refuel.gas_station) == null ? void 0 : _b.name) ?? "Unknown Station" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: route("refuels.edit", { refuel: refuel.id }), className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
            "Edit"
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => onDelete == null ? void 0 : onDelete(refuel), className: "text-red-600", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
            "Delete"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Car, { className: "text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
          refuel.mileage.toLocaleString("da-DK"),
          " km"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Fuel, { className: "text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
          formatNumber(refuel.liters_refueled),
          " ",
          unitLabel
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(BanknoteIcon, { className: "text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: formatCurrency(refuel.total_price) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Gauge, { className: "text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: formatCurrency(refuel.total_price / refuel.liters_refueled).replace("kr.", unitPriceLabel) })
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RefuelCard
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$6 = [
  {
    title: "Refuels",
    href: "/refuels"
  }
];
function Refuels({ refuels, cars, selectedCarId }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRefuel, setSelectedRefuel] = useState(null);
  const handleCarFilterChange = (value) => {
    router.get(
      "/refuels",
      { car_id: value || void 0 },
      {
        preserveState: true,
        preserveScroll: false,
        onSuccess: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    );
  };
  const handleEdit = (refuel) => {
    setSelectedRefuel(refuel);
  };
  const handleDelete = (refuel) => {
    setSelectedRefuel(refuel);
    setIsDeleteOpen(true);
  };
  const confirmDelete = () => {
    if (selectedRefuel) {
      router.delete(`/refuels/${selectedRefuel.id}`, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedRefuel(null);
        }
      });
    }
  };
  const handlePageChange = (page) => {
    router.get(
      "/refuels",
      { page, car_id: selectedCarId || void 0 },
      {
        preserveState: true,
        preserveScroll: false,
        onSuccess: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$6, children: [
    /* @__PURE__ */ jsx(Head, { title: "Refuels" }),
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$6[0].title }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 rounded-xl", children: [
      /* @__PURE__ */ jsxs(
        Deferred,
        {
          data: ["refuels", "cars"],
          fallback: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "Filter by car" }),
              /* @__PURE__ */ jsx("div", { className: "w-full md:w-64", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-28" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
                /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" }),
                /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" })
              ] })
            ] }) }, index)) })
          ] }),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "Filter by car" }),
              /* @__PURE__ */ jsx("div", { className: "w-full md:w-64", children: /* @__PURE__ */ jsxs(NativeSelect, { value: selectedCarId ?? "", onChange: (e) => handleCarFilterChange(e.target.value), children: [
                /* @__PURE__ */ jsx(NativeSelectOption, { value: "", children: "All cars" }),
                (cars ?? []).map((car) => /* @__PURE__ */ jsx(NativeSelectOption, { value: car.id.toString(), children: car.name }, car.id))
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: ((refuels == null ? void 0 : refuels.data) ?? []).map((refuel) => /* @__PURE__ */ jsx(RefuelCard, { refuel, onEdit: handleEdit, onDelete: handleDelete }, refuel.id)) }),
            ((refuels == null ? void 0 : refuels.last_page) ?? 0) > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t pt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-sm", children: [
                "Showing page ",
                refuels == null ? void 0 : refuels.current_page,
                " of ",
                refuels == null ? void 0 : refuels.last_page
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handlePageChange(((refuels == null ? void 0 : refuels.current_page) ?? 1) - 1),
                    disabled: (refuels == null ? void 0 : refuels.current_page) === 1,
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handlePageChange(((refuels == null ? void 0 : refuels.current_page) ?? 1) + 1),
                    disabled: (refuels == null ? void 0 : refuels.current_page) === (refuels == null ? void 0 : refuels.last_page),
                    children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      selectedRefuel && /* @__PURE__ */ jsx(
        DeleteConfirmation,
        {
          open: isDeleteOpen,
          onOpenChange: setIsDeleteOpen,
          onConfirm: confirmDelete,
          title: `Delete Refuel`,
          description: `Are you sure you want to delete this refuel record? This action cannot be undone.`
        }
      )
    ] })
  ] });
}
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Refuels
}, Symbol.toStringTag, { value: "Module" }));
function RefuelForm({ refuel, cars, gasStations, formType }) {
  var _a, _b;
  const isEditing = formType === "edit";
  const [showNewStation, setShowNewStation] = useState(false);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    car_id: ((_a = refuel == null ? void 0 : refuel.car_id) == null ? void 0 : _a.toString()) ?? "",
    gas_station_id: ((_b = refuel == null ? void 0 : refuel.gas_station_id) == null ? void 0 : _b.toString()) ?? "",
    liters_refueled: (refuel == null ? void 0 : refuel.liters_refueled) ?? "",
    total_price: (refuel == null ? void 0 : refuel.total_price) ?? "",
    mileage: (refuel == null ? void 0 : refuel.mileage) ?? "",
    new_gas_station_name: "",
    new_gas_station_address: ""
  });
  const selectedCar = cars.find((car) => car.id.toString() === data.car_id.toString());
  const isElectric = (selectedCar == null ? void 0 : selectedCar.is_electric) ?? false;
  const energyLabel = isElectric ? "kWh Charged" : "Liters Refueled";
  useEffect(() => {
    var _a2;
    if (formType === "edit" && refuel) {
      setData({
        car_id: refuel.car_id.toString(),
        gas_station_id: ((_a2 = refuel.gas_station_id) == null ? void 0 : _a2.toString()) ?? "",
        liters_refueled: refuel.liters_refueled,
        total_price: refuel.total_price,
        mileage: refuel.mileage,
        new_gas_station_name: "",
        new_gas_station_address: ""
      });
    } else if (formType === "create") {
      reset();
    }
  }, [refuel, formType, reset, setData]);
  const shouldShowNewStation = showNewStation || Boolean(data.new_gas_station_name || data.new_gas_station_address);
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          if (!response.ok) {
            return;
          }
          const data2 = await response.json();
          const address = (data2 == null ? void 0 : data2.address) ?? {};
          const street = [address.road, address.house_number].filter(Boolean).join(" ");
          const locality = address.city || address.town || address.village || address.suburb || address.city_district;
          const cityLine = [address.postcode, locality].filter(Boolean).join(" ");
          const formatted = [street, cityLine].filter(Boolean).join(", ");
          if (formatted) {
            setData("new_gas_station_address", formatted);
          } else if (data2 == null ? void 0 : data2.display_name) {
            setData("new_gas_station_address", data2.display_name);
          }
        } catch {
        }
      },
      () => {
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(`/refuels/${refuel == null ? void 0 : refuel.id}`, {
        onSuccess: () => reset()
      });
    } else {
      post("/refuels", {
        onSuccess: () => reset()
      });
    }
  };
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx("div", { className: "p-4 pt-0", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "mt-4 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "car_id", children: "Car" }),
      /* @__PURE__ */ jsxs(NativeSelect, { id: "car_id", value: data.car_id.toString(), onChange: (e) => setData("car_id", e.target.value), children: [
        /* @__PURE__ */ jsx(NativeSelectOption, { value: "", children: "Select car" }),
        cars.map((car) => /* @__PURE__ */ jsx(NativeSelectOption, { value: car.id.toString(), children: car.name }, car.id))
      ] }),
      /* @__PURE__ */ jsx(InputError, { message: errors.car_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "total_price", children: "Total Price" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "total_price",
          type: "number",
          required: true,
          inputMode: "decimal",
          step: "0.01",
          tabIndex: 1,
          autoComplete: "off",
          value: data.total_price,
          onChange: (e) => setData("total_price", e.target.value),
          placeholder: "Total price"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.total_price })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "liters_refueled", children: energyLabel }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "liters_refueled",
          type: "number",
          required: true,
          inputMode: "decimal",
          step: "0.01",
          tabIndex: 2,
          autoComplete: "off",
          value: data.liters_refueled,
          onChange: (e) => setData("liters_refueled", e.target.value),
          placeholder: isElectric ? "kWh charged" : "Liters refueled"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.liters_refueled })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "mileage", children: "Mileage" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "mileage",
          type: "number",
          required: true,
          inputMode: "decimal",
          tabIndex: 3,
          autoComplete: "off",
          value: data.mileage,
          onChange: (e) => setData("mileage", e.target.value),
          placeholder: "Mileage"
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.mileage })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "gas_station_id", children: "Station" }),
      /* @__PURE__ */ jsxs(
        NativeSelect,
        {
          id: "gas_station_id",
          value: data.gas_station_id.toString(),
          onChange: (e) => setData("gas_station_id", e.target.value),
          children: [
            /* @__PURE__ */ jsx(NativeSelectOption, { value: "", children: "Select station" }),
            gasStations.map((station) => /* @__PURE__ */ jsx(NativeSelectOption, { value: station.id.toString(), children: station.name }, station.id))
          ]
        }
      ),
      /* @__PURE__ */ jsx(InputError, { message: errors.gas_station_id })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "Need a new station?" }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setShowNewStation((current) => !current), children: shouldShowNewStation ? "Hide new station" : "Add new station" })
    ] }),
    shouldShowNewStation && /* @__PURE__ */ jsxs("div", { className: "rounded-md border p-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs font-semibold tracking-wide uppercase", children: "New station" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "new_gas_station_name", children: "Station name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "new_gas_station_name",
              type: "text",
              tabIndex: 5,
              autoComplete: "off",
              value: data.new_gas_station_name,
              onChange: (e) => setData("new_gas_station_name", e.target.value),
              placeholder: isElectric ? "Charging station name" : "Gas station name"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.new_gas_station_name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "new_gas_station_address", children: "Address" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "new_gas_station_address",
              type: "text",
              tabIndex: 6,
              autoComplete: "off",
              value: data.new_gas_station_address,
              onChange: (e) => setData("new_gas_station_address", e.target.value),
              placeholder: "Street, city"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.new_gas_station_address })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: handleUseCurrentLocation, children: "Use current location" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", disabled: processing, children: isEditing ? "Update" : "Create" }) })
  ] }) }) });
}
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RefuelForm
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$5 = [
  {
    title: "Create Refuel",
    href: "/refuels/create"
  }
];
function RefuelCreate$1({ cars, gasStations }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$5, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$5[0].title }),
    /* @__PURE__ */ jsx(RefuelForm, { cars, gasStations, formType: "create" })
  ] });
}
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RefuelCreate$1
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$4 = [
  {
    title: "Edit Refuel",
    href: "/refuels/edit"
  }
];
function RefuelCreate({ cars, gasStations }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$4, children: [
    /* @__PURE__ */ jsx(Heading, { level: 1, title: breadcrumbs$4[0].title }),
    /* @__PURE__ */ jsx(RefuelForm, { cars, gasStations, formType: "edit" })
  ] });
}
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RefuelCreate
}, Symbol.toStringTag, { value: "Module" }));
function AuthSimpleLayout({ children, title, description }) {
  return /* @__PURE__ */ jsx("div", { className: "bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Link, { href: route("home"), className: "flex flex-col items-center gap-2 font-medium", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1 flex h-9 w-9 items-center justify-center rounded-md", children: /* @__PURE__ */ jsx(AppLogoIcon, { className: "size-9 fill-current text-[var(--foreground)] dark:text-white" }) }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-medium", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center text-sm", children: description })
      ] })
    ] }),
    children
  ] }) }) });
}
function AuthLayout({ children, title, description, ...props }) {
  return /* @__PURE__ */ jsx(AuthSimpleLayout, { title, description, ...props, children });
}
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.confirm"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Confirm your password",
      description: "This is a secure area of the application. Please confirm your password before continuing.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Confirm password" }),
        /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: "password",
                name: "password",
                placeholder: "Password",
                autoComplete: "current-password",
                value: data.password,
                autoFocus: true,
                onChange: (e) => setData("password", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.password })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs(Button, { className: "w-full", disabled: processing, children: [
            processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Confirm password"
          ] }) })
        ] }) })
      ]
    }
  );
}
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ConfirmPassword
}, Symbol.toStringTag, { value: "Module" }));
function TextLink({ className = "", children, ...props }) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      className: cn(
        "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
        className
      ),
      ...props,
      children
    }
  );
}
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Forgot password", description: "Enter your email to receive a password reset link", children: [
    /* @__PURE__ */ jsx(Head, { title: "Forgot password" }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email address" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              name: "email",
              autoComplete: "off",
              value: data.email,
              autoFocus: true,
              onChange: (e) => setData("email", e.target.value),
              placeholder: "email@example.com"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "my-6 flex items-center justify-start", children: /* @__PURE__ */ jsxs(Button, { className: "w-full", disabled: processing, children: [
          processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Email password reset link"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground space-x-1 text-center text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: "Or, return to" }),
        /* @__PURE__ */ jsx(TextLink, { href: route("login"), children: "log in" })
      ] })
    ] })
  ] });
}
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Log in to your account", description: "Enter your email and password below to log in", children: [
    /* @__PURE__ */ jsx(Head, { title: "Log in" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-6", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email address" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              required: true,
              autoFocus: true,
              tabIndex: 1,
              autoComplete: "email",
              value: data.email,
              onChange: (e) => setData("email", e.target.value),
              placeholder: "email@example.com"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
            canResetPassword && /* @__PURE__ */ jsx(TextLink, { href: route("password.request"), className: "ml-auto text-sm", tabIndex: 5, children: "Forgot password?" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              tabIndex: 2,
              autoComplete: "current-password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              placeholder: "Password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx(Checkbox, { id: "remember", name: "remember", tabIndex: 3 }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "remember", children: "Remember me" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-4 w-full", tabIndex: 4, disabled: processing, children: [
          processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Log in"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-center text-sm", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsx(TextLink, { href: route("register"), tabIndex: 5, children: "Sign up" })
      ] })
    ] }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status })
  ] });
}
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Create an account", description: "Enter your details below to create your account", children: [
    /* @__PURE__ */ jsx(Head, { title: "Register" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-6", onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              type: "text",
              required: true,
              autoFocus: true,
              tabIndex: 1,
              autoComplete: "name",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              disabled: processing,
              placeholder: "Full name"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.name, className: "mt-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email address" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              required: true,
              tabIndex: 2,
              autoComplete: "email",
              value: data.email,
              onChange: (e) => setData("email", e.target.value),
              disabled: processing,
              placeholder: "email@example.com"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              tabIndex: 3,
              autoComplete: "new-password",
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              disabled: processing,
              placeholder: "Password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password_confirmation",
              type: "password",
              required: true,
              tabIndex: 4,
              autoComplete: "new-password",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              disabled: processing,
              placeholder: "Confirm password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-2 w-full", tabIndex: 5, disabled: processing, children: [
          processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Create account"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-center text-sm", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(TextLink, { href: route("login"), tabIndex: 6, children: "Log in" })
      ] })
    ] })
  ] });
}
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Reset password", description: "Please enter your new password below", children: [
    /* @__PURE__ */ jsx(Head, { title: "Reset password" }),
    /* @__PURE__ */ jsx("form", { onSubmit: submit, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            name: "email",
            autoComplete: "email",
            value: data.email,
            className: "mt-1 block w-full",
            readOnly: true,
            onChange: (e) => setData("email", e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            autoComplete: "new-password",
            value: data.password,
            className: "mt-1 block w-full",
            autoFocus: true,
            onChange: (e) => setData("password", e.target.value),
            placeholder: "Password"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password_confirmation",
            type: "password",
            name: "password_confirmation",
            autoComplete: "new-password",
            value: data.password_confirmation,
            className: "mt-1 block w-full",
            onChange: (e) => setData("password_confirmation", e.target.value),
            placeholder: "Confirm password"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "mt-4 w-full", disabled: processing, children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Reset password"
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword
}, Symbol.toStringTag, { value: "Module" }));
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Verify email", description: "Please verify your email address by clicking on the link we just emailed to you.", children: [
    /* @__PURE__ */ jsx(Head, { title: "Email verification" }),
    status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6 text-center", children: [
      /* @__PURE__ */ jsxs(Button, { disabled: processing, variant: "secondary", children: [
        processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Resend verification email"
      ] }),
      /* @__PURE__ */ jsx(TextLink, { href: route("logout"), method: "post", className: "mx-auto block text-sm", children: "Log out" })
    ] })
  ] });
}
const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VerifyEmail
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$3 = [
  {
    title: "Dashboard",
    href: "/dashboard"
  }
];
function Dashboard({ cars, message }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK"
    }).format(amount);
  };
  const formatNumber = (number) => {
    return new Intl.NumberFormat("da-DK").format(number);
  };
  if (message) {
    return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$3, children: [
      /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 rounded-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Dashboard" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500", children: message })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$3, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full flex-1 flex-col gap-4 rounded-xl", children: /* @__PURE__ */ jsx(
      Deferred,
      {
        data: "cars",
        fallback: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-40" }) }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-24" })
            ] })
          ] }, index)) })
        ] }),
        children: (cars ?? []).map((car) => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: car.name }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "This Month" }),
                /* @__PURE__ */ jsx(Wallet, { className: "text-muted-foreground h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: formatCurrency(car.stats.currentMonth.amount) }),
                /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
                  "Avg. ",
                  formatCurrency(car.stats.averages.monthlyAmount),
                  "/month"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Distance This Month" }),
                /* @__PURE__ */ jsx(Car, { className: "text-muted-foreground h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
                  formatNumber(car.stats.currentMonth.kilometers),
                  " km"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
                  "Avg. ",
                  formatNumber(car.stats.averages.monthlyKilometers),
                  " km/month"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Price per Kilometer" }),
                /* @__PURE__ */ jsx(Coins, { className: "text-muted-foreground h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: formatCurrency(car.stats.totals.pricePerKilometer) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "per kilometer driven" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "All time" }),
                /* @__PURE__ */ jsx(ChartNoAxesCombined, { className: "text-muted-foreground h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: formatCurrency(car.stats.totals.amount) }),
                /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
                  formatNumber(car.stats.totals.kilometers),
                  " km driven"
                ] })
              ] })
            ] })
          ] })
        ] }, car.id))
      }
    ) })
  ] });
}
const __vite_glob_0_30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const applyTheme = (appearance) => {
  const isDark = appearance === "dark" || appearance === "system" && prefersDark();
  document.documentElement.classList.toggle("dark", isDark);
};
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handleSystemThemeChange = () => {
  const currentAppearance = localStorage.getItem("appearance");
  applyTheme(currentAppearance || "system");
};
function useAppearance() {
  const [appearance, setAppearance] = useState("system");
  const updateAppearance = (mode) => {
    setAppearance(mode);
    localStorage.setItem("appearance", mode);
    applyTheme(mode);
  };
  useEffect(() => {
    const savedAppearance = localStorage.getItem("appearance");
    updateAppearance(savedAppearance || "system");
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);
  return { appearance, updateAppearance };
}
function AppearanceToggleTab({ className = "", ...props }) {
  const { appearance, updateAppearance } = useAppearance();
  const tabs = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" }
  ];
  return /* @__PURE__ */ jsx("div", { className: cn("inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800", className), ...props, children: tabs.map(({ value, icon: Icon2, label }) => /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => updateAppearance(value),
      className: cn(
        "flex items-center rounded-md px-3.5 py-1.5 transition-colors",
        appearance === value ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100" : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"
      ),
      children: [
        /* @__PURE__ */ jsx(Icon2, { className: "-ml-1 h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-sm", children: label })
      ]
    },
    value
  )) });
}
function HeadingSmall({ title, description }) {
  return /* @__PURE__ */ jsxs("header", { children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-0.5 text-base font-medium", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: description })
  ] });
}
const sidebarNavItems = [
  {
    title: "Profile",
    url: "/settings/profile",
    icon: null
  },
  {
    title: "Password",
    url: "/settings/password",
    icon: null
  },
  {
    title: "Appearance",
    url: "/settings/appearance",
    icon: null
  }
];
function SettingsLayout({ children }) {
  const currentPath = window.location.pathname;
  return /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
    /* @__PURE__ */ jsx(Heading, { title: "Settings", description: "Manage your profile and account settings" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12", children: [
      /* @__PURE__ */ jsx("aside", { className: "w-full max-w-xl lg:w-48", children: /* @__PURE__ */ jsx("nav", { className: "flex flex-col space-y-1 space-x-0", children: sidebarNavItems.map((item) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          asChild: true,
          className: cn("w-full justify-start", {
            "bg-muted": currentPath === item.url
          }),
          children: /* @__PURE__ */ jsx(Link, { href: item.url, prefetch: true, children: item.title })
        },
        item.url
      )) }) }),
      /* @__PURE__ */ jsx(Separator, { className: "my-6 md:hidden" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 md:max-w-2xl", children: /* @__PURE__ */ jsx("section", { className: "max-w-xl space-y-12", children }) })
    ] })
  ] });
}
const breadcrumbs$2 = [
  {
    title: "Appearance settings",
    href: "/settings/appearance"
  }
];
function Appearance() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$2, children: [
    /* @__PURE__ */ jsx(Head, { title: "Appearance settings" }),
    /* @__PURE__ */ jsx(SettingsLayout, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(HeadingSmall, { title: "Appearance settings", description: "Update your account's appearance settings" }),
      /* @__PURE__ */ jsx(AppearanceToggleTab, {})
    ] }) })
  ] });
}
const __vite_glob_0_31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Appearance
}, Symbol.toStringTag, { value: "Module" }));
const breadcrumbs$1 = [
  {
    title: "Password settings",
    href: "/settings/password"
  }
];
function Password() {
  const passwordInput = useRef(null);
  const currentPasswordInput = useRef(null);
  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        var _a, _b;
        if (errors2.password) {
          reset("password", "password_confirmation");
          (_a = passwordInput.current) == null ? void 0 : _a.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          (_b = currentPasswordInput.current) == null ? void 0 : _b.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: breadcrumbs$1, children: [
    /* @__PURE__ */ jsx(Head, { title: "Profile settings" }),
    /* @__PURE__ */ jsx(SettingsLayout, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(HeadingSmall, { title: "Update password", description: "Ensure your account is using a long, random password to stay secure" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "current_password", children: "Current password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "current_password",
              ref: currentPasswordInput,
              value: data.current_password,
              onChange: (e) => setData("current_password", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "current-password",
              placeholder: "Current password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.current_password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              ref: passwordInput,
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "new-password",
              placeholder: "New password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password_confirmation",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "new-password",
              placeholder: "Confirm password"
            }
          ),
          /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { disabled: processing, children: "Save password" }),
          /* @__PURE__ */ jsx(
            Transition,
            {
              show: recentlySuccessful,
              enter: "transition ease-in-out",
              enterFrom: "opacity-0",
              leave: "transition ease-in-out",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-600", children: "Saved" })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const __vite_glob_0_32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Password
}, Symbol.toStringTag, { value: "Module" }));
function DeleteUser() {
  const passwordInput = useRef(null);
  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: "" });
  const deleteUser = (e) => {
    e.preventDefault();
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => {
        var _a;
        return (_a = passwordInput.current) == null ? void 0 : _a.focus();
      },
      onFinish: () => reset()
    });
  };
  const closeModal = () => {
    clearErrors();
    reset();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(HeadingSmall, { title: "Delete account", description: "Delete your account and all of its resources" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative space-y-0.5 text-red-600 dark:text-red-100", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Warning" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Please proceed with caution, this cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "destructive", children: "Delete account" }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: "Are you sure you want to delete your account?" }),
          /* @__PURE__ */ jsx(DialogDescription, { children: "Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account." }),
          /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: deleteUser, children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "sr-only", children: "Password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: "password",
                  name: "password",
                  ref: passwordInput,
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  placeholder: "Password",
                  autoComplete: "current-password"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.password })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
              /* @__PURE__ */ jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: closeModal, children: "Cancel" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "destructive", disabled: processing, asChild: true, children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Delete account" }) })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const breadcrumbs = [
  {
    title: "Profile settings",
    href: "/settings/profile"
  }
];
function Profile({ mustVerifyEmail, status }) {
  const { auth } = usePage().props;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: auth.user.name,
    email: auth.user.email
  });
  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Profile settings" }),
    /* @__PURE__ */ jsxs(SettingsLayout, { children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx(HeadingSmall, { title: "Profile information", description: "Update your name and email address" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                className: "mt-1 block w-full",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                required: true,
                autoComplete: "name",
                placeholder: "Full name"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email address" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                className: "mt-1 block w-full",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                required: true,
                autoComplete: "username",
                placeholder: "Email address"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.email })
          ] }),
          mustVerifyEmail && auth.user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground -mt-4 text-sm", children: [
              "Your email address is unverified.",
              " ",
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("verification.send"),
                  method: "post",
                  as: "button",
                  className: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
                  children: "Click here to resend the verification email."
                }
              )
            ] }),
            status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm font-medium text-green-600", children: "A new verification link has been sent to your email address." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(Button, { disabled: processing, children: "Save" }),
            /* @__PURE__ */ jsx(
              Transition,
              {
                show: recentlySuccessful,
                enter: "transition ease-in-out",
                enterFrom: "opacity-0",
                leave: "transition ease-in-out",
                leaveTo: "opacity-0",
                children: /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-600", children: "Saved" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DeleteUser, {})
    ] })
  ] });
}
const __vite_glob_0_33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Profile
}, Symbol.toStringTag, { value: "Module" }));
function Welcome() {
  const { auth } = usePage().props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { title: "Welcome", children: [
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.bunny.net" }),
      /* @__PURE__ */ jsx("link", { href: "https://fonts.bunny.net/css?family=instrument-sans:400,500,600", rel: "stylesheet" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]", children: [
      /* @__PURE__ */ jsx("header", { className: "mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl", children: /* @__PURE__ */ jsx("nav", { className: "flex items-center justify-end gap-4", children: auth.user ? /* @__PURE__ */ jsx(
        Link,
        {
          href: route("dashboard"),
          className: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
          children: "Dashboard"
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("login"),
            className: "inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]",
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("register"),
            className: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
            children: "Register"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0", children: /* @__PURE__ */ jsxs("main", { className: "flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]", children: [
          /* @__PURE__ */ jsx("h1", { className: "mb-1 font-medium", children: "Let's get started" }),
          /* @__PURE__ */ jsxs("p", { className: "mb-2 text-[#706f6c] dark:text-[#A1A09A]", children: [
            "Laravel has an incredibly rich ecosystem.",
            /* @__PURE__ */ jsx("br", {}),
            "We suggest starting with the following."
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "mb-4 flex flex-col lg:mb-6", children: [
            /* @__PURE__ */ jsxs("li", { className: "relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]", children: [
              /* @__PURE__ */ jsx("span", { className: "relative bg-white py-1 dark:bg-[#161615]", children: /* @__PURE__ */ jsx("span", { className: "flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]", children: /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" }) }) }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Read the",
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "https://laravel.com/docs",
                    target: "_blank",
                    className: "ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "Documentation" }),
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          width: 10,
                          height: 11,
                          viewBox: "0 0 10 11",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          className: "h-2.5 w-2.5",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              d: "M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001",
                              stroke: "currentColor",
                              strokeLinecap: "square"
                            }
                          )
                        }
                      )
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]", children: [
              /* @__PURE__ */ jsx("span", { className: "relative bg-white py-1 dark:bg-[#161615]", children: /* @__PURE__ */ jsx("span", { className: "flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]", children: /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" }) }) }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Watch video tutorials at",
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "https://laracasts.com",
                    target: "_blank",
                    className: "ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: "Laracasts" }),
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          width: 10,
                          height: 11,
                          viewBox: "0 0 10 11",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          className: "h-2.5 w-2.5",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              d: "M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001",
                              stroke: "currentColor",
                              strokeLinecap: "square"
                            }
                          )
                        }
                      )
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "flex gap-3 text-sm leading-normal", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://cloud.laravel.com",
              target: "_blank",
              className: "inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white",
              children: "Deploy now"
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "w-full max-w-none translate-y-0 text-[#F53003] opacity-100 transition-all duration-750 dark:text-[#F61500] starting:translate-y-6 starting:opacity-0",
              viewBox: "0 0 438 104",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M17.2036 -3H0V102.197H49.5189V86.7187H17.2036V-3Z", fill: "currentColor" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M110.256 41.6337C108.061 38.1275 104.945 35.3731 100.905 33.3681C96.8667 31.3647 92.8016 30.3618 88.7131 30.3618C83.4247 30.3618 78.5885 31.3389 74.201 33.2923C69.8111 35.2456 66.0474 37.928 62.9059 41.3333C59.7643 44.7401 57.3198 48.6726 55.5754 53.1293C53.8287 57.589 52.9572 62.274 52.9572 67.1813C52.9572 72.1925 53.8287 76.8995 55.5754 81.3069C57.3191 85.7173 59.7636 89.6241 62.9059 93.0293C66.0474 96.4361 69.8119 99.1155 74.201 101.069C78.5885 103.022 83.4247 103.999 88.7131 103.999C92.8016 103.999 96.8667 102.997 100.905 100.994C104.945 98.9911 108.061 96.2359 110.256 92.7282V102.195H126.563V32.1642H110.256V41.6337ZM108.76 75.7472C107.762 78.4531 106.366 80.8078 104.572 82.8112C102.776 84.8161 100.606 86.4183 98.0637 87.6206C95.5202 88.823 92.7004 89.4238 89.6103 89.4238C86.5178 89.4238 83.7252 88.823 81.2324 87.6206C78.7388 86.4183 76.5949 84.8161 74.7998 82.8112C73.004 80.8078 71.6319 78.4531 70.6856 75.7472C69.7356 73.0421 69.2644 70.1868 69.2644 67.1821C69.2644 64.1758 69.7356 61.3205 70.6856 58.6154C71.6319 55.9102 73.004 53.5571 74.7998 51.5522C76.5949 49.5495 78.738 47.9451 81.2324 46.7427C83.7252 45.5404 86.5178 44.9396 89.6103 44.9396C92.7012 44.9396 95.5202 45.5404 98.0637 46.7427C100.606 47.9451 102.776 49.5487 104.572 51.5522C106.367 53.5571 107.762 55.9102 108.76 58.6154C109.756 61.3205 110.256 64.1758 110.256 67.1821C110.256 70.1868 109.756 73.0421 108.76 75.7472Z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M242.805 41.6337C240.611 38.1275 237.494 35.3731 233.455 33.3681C229.416 31.3647 225.351 30.3618 221.262 30.3618C215.974 30.3618 211.138 31.3389 206.75 33.2923C202.36 35.2456 198.597 37.928 195.455 41.3333C192.314 44.7401 189.869 48.6726 188.125 53.1293C186.378 57.589 185.507 62.274 185.507 67.1813C185.507 72.1925 186.378 76.8995 188.125 81.3069C189.868 85.7173 192.313 89.6241 195.455 93.0293C198.597 96.4361 202.361 99.1155 206.75 101.069C211.138 103.022 215.974 103.999 221.262 103.999C225.351 103.999 229.416 102.997 233.455 100.994C237.494 98.9911 240.611 96.2359 242.805 92.7282V102.195H259.112V32.1642H242.805V41.6337ZM241.31 75.7472C240.312 78.4531 238.916 80.8078 237.122 82.8112C235.326 84.8161 233.156 86.4183 230.614 87.6206C228.07 88.823 225.251 89.4238 222.16 89.4238C219.068 89.4238 216.275 88.823 213.782 87.6206C211.289 86.4183 209.145 84.8161 207.35 82.8112C205.554 80.8078 204.182 78.4531 203.236 75.7472C202.286 73.0421 201.814 70.1868 201.814 67.1821C201.814 64.1758 202.286 61.3205 203.236 58.6154C204.182 55.9102 205.554 53.5571 207.35 51.5522C209.145 49.5495 211.288 47.9451 213.782 46.7427C216.275 45.5404 219.068 44.9396 222.16 44.9396C225.251 44.9396 228.07 45.5404 230.614 46.7427C233.156 47.9451 235.326 49.5487 237.122 51.5522C238.917 53.5571 240.312 55.9102 241.31 58.6154C242.306 61.3205 242.806 64.1758 242.806 67.1821C242.805 70.1868 242.305 73.0421 241.31 75.7472Z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ jsx("path", { d: "M438 -3H421.694V102.197H438V-3Z", fill: "currentColor" }),
                /* @__PURE__ */ jsx("path", { d: "M139.43 102.197H155.735V48.2834H183.712V32.1665H139.43V102.197Z", fill: "currentColor" }),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M324.49 32.1665L303.995 85.794L283.498 32.1665H266.983L293.748 102.197H314.242L341.006 32.1665H324.49Z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M376.571 30.3656C356.603 30.3656 340.797 46.8497 340.797 67.1828C340.797 89.6597 356.094 104 378.661 104C391.29 104 399.354 99.1488 409.206 88.5848L398.189 80.0226C398.183 80.031 389.874 90.9895 377.468 90.9895C363.048 90.9895 356.977 79.3111 356.977 73.269H411.075C413.917 50.1328 398.775 30.3656 376.571 30.3656ZM357.02 61.0967C357.145 59.7487 359.023 43.3761 376.442 43.3761C393.861 43.3761 395.978 59.7464 396.099 61.0967H357.02Z",
                    fill: "currentColor"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "relative -mt-[4.9rem] -ml-8 w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:hidden",
              viewBox: "0 0 440 376",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsxs("g", { className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.263 355.73L188.595 355.73C195.441 348.845 205.766 339.761 219.569 328.477C232.93 317.193 242.978 308.205 249.714 301.511C256.34 294.626 260.867 287.358 263.296 279.708C265.725 272.058 264.565 264.121 259.816 255.896C254.516 246.716 247.062 239.352 237.454 233.805C227.957 228.067 217.908 225.198 207.307 225.198C196.927 225.197 190.136 227.97 186.934 233.516C183.621 238.872 184.726 246.331 190.247 255.894L125.647 255.891C116.371 239.825 112.395 225.481 113.72 212.858C115.265 200.235 121.559 190.481 132.602 183.596C143.754 176.52 158.607 172.982 177.159 172.983C196.594 172.984 215.863 176.523 234.968 183.6C253.961 190.486 271.299 200.241 286.98 212.864C302.661 225.488 315.14 239.833 324.416 255.899C333.03 270.817 336.841 283.918 335.847 295.203C335.075 306.487 331.376 316.336 324.75 324.751C318.346 333.167 308.408 343.494 294.936 355.734L377.094 355.737L405.917 405.656L217.087 405.649L188.263 355.73Z",
                      fill: "black"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.11884 226.339L-13.7396 226.338L-42.7286 176.132L43.0733 176.135L175.595 405.649L112.651 405.647L9.11884 226.339Z",
                      fill: "black"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.263 355.73L188.595 355.73C195.441 348.845 205.766 339.761 219.569 328.477C232.93 317.193 242.978 308.205 249.714 301.511C256.34 294.626 260.867 287.358 263.296 279.708C265.725 272.058 264.565 264.121 259.816 255.896C254.516 246.716 247.062 239.352 237.454 233.805C227.957 228.067 217.908 225.198 207.307 225.198C196.927 225.197 190.136 227.97 186.934 233.516C183.621 238.872 184.726 246.331 190.247 255.894L125.647 255.891C116.371 239.825 112.395 225.481 113.72 212.858C115.265 200.235 121.559 190.481 132.602 183.596C143.754 176.52 158.607 172.982 177.159 172.983C196.594 172.984 215.863 176.523 234.968 183.6C253.961 190.486 271.299 200.241 286.98 212.864C302.661 225.488 315.14 239.833 324.416 255.899C333.03 270.817 336.841 283.918 335.847 295.203C335.075 306.487 331.376 316.336 324.75 324.751C318.346 333.167 308.408 343.494 294.936 355.734L377.094 355.737L405.917 405.656L217.087 405.649L188.263 355.73Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.11884 226.339L-13.7396 226.338L-42.7286 176.132L43.0733 176.135L175.595 405.649L112.651 405.647L9.11884 226.339Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M204.592 327.449L204.923 327.449C211.769 320.564 222.094 311.479 235.897 300.196C249.258 288.912 259.306 279.923 266.042 273.23C272.668 266.345 277.195 259.077 279.624 251.427C282.053 243.777 280.893 235.839 276.145 227.615C270.844 218.435 263.39 211.071 253.782 205.524C244.285 199.786 234.236 196.917 223.635 196.916C213.255 196.916 206.464 199.689 203.262 205.235C199.949 210.59 201.054 218.049 206.575 227.612L141.975 227.61C132.699 211.544 128.723 197.2 130.048 184.577C131.593 171.954 137.887 162.2 148.93 155.315C160.083 148.239 174.935 144.701 193.487 144.702C212.922 144.703 232.192 148.242 251.296 155.319C270.289 162.205 287.627 171.96 303.308 184.583C318.989 197.207 331.468 211.552 340.745 227.618C349.358 242.536 353.169 255.637 352.175 266.921C351.403 278.205 347.704 288.055 341.078 296.47C334.674 304.885 324.736 315.213 311.264 327.453L393.422 327.456L422.246 377.375L233.415 377.368L204.592 327.449Z",
                      fill: "#F8B803"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M25.447 198.058L2.58852 198.057L-26.4005 147.851L59.4015 147.854L191.923 377.368L128.979 377.365L25.447 198.058Z",
                      fill: "#F8B803"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M204.592 327.449L204.923 327.449C211.769 320.564 222.094 311.479 235.897 300.196C249.258 288.912 259.306 279.923 266.042 273.23C272.668 266.345 277.195 259.077 279.624 251.427C282.053 243.777 280.893 235.839 276.145 227.615C270.844 218.435 263.39 211.071 253.782 205.524C244.285 199.786 234.236 196.917 223.635 196.916C213.255 196.916 206.464 199.689 203.262 205.235C199.949 210.59 201.054 218.049 206.575 227.612L141.975 227.61C132.699 211.544 128.723 197.2 130.048 184.577C131.593 171.954 137.887 162.2 148.93 155.315C160.083 148.239 174.935 144.701 193.487 144.702C212.922 144.703 232.192 148.242 251.296 155.319C270.289 162.205 287.627 171.96 303.308 184.583C318.989 197.207 331.468 211.552 340.745 227.618C349.358 242.536 353.169 255.637 352.175 266.921C351.403 278.205 347.704 288.055 341.078 296.47C334.674 304.885 324.736 315.213 311.264 327.453L393.422 327.456L422.246 377.375L233.415 377.368L204.592 327.449Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M25.447 198.058L2.58852 198.057L-26.4005 147.851L59.4015 147.854L191.923 377.368L128.979 377.365L25.447 198.058Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    style: { mixBlendMode: "hard-light" },
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M217.342 305.363L217.673 305.363C224.519 298.478 234.844 289.393 248.647 278.11C262.008 266.826 272.056 257.837 278.792 251.144C285.418 244.259 289.945 236.991 292.374 229.341C294.803 221.691 293.643 213.753 288.895 205.529C283.594 196.349 276.14 188.985 266.532 183.438C257.035 177.7 246.986 174.831 236.385 174.83C226.005 174.83 219.214 177.603 216.012 183.149C212.699 188.504 213.804 195.963 219.325 205.527L154.725 205.524C145.449 189.458 141.473 175.114 142.798 162.491C144.343 149.868 150.637 140.114 161.68 133.229C172.833 126.153 187.685 122.615 206.237 122.616C225.672 122.617 244.942 126.156 264.046 133.233C283.039 140.119 300.377 149.874 316.058 162.497C331.739 175.121 344.218 189.466 353.495 205.532C362.108 220.45 365.919 233.551 364.925 244.835C364.153 256.12 360.454 265.969 353.828 274.384C347.424 282.799 337.486 293.127 324.014 305.367L406.172 305.37L434.996 355.289L246.165 355.282L217.342 305.363Z",
                          fill: "#F0ACB8"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M38.197 175.972L15.3385 175.971L-13.6505 125.765L72.1515 125.768L204.673 355.282L141.729 355.279L38.197 175.972Z",
                          fill: "#F0ACB8"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M217.342 305.363L217.673 305.363C224.519 298.478 234.844 289.393 248.647 278.11C262.008 266.826 272.056 257.837 278.792 251.144C285.418 244.259 289.945 236.991 292.374 229.341C294.803 221.691 293.643 213.753 288.895 205.529C283.594 196.349 276.14 188.985 266.532 183.438C257.035 177.7 246.986 174.831 236.385 174.83C226.005 174.83 219.214 177.603 216.012 183.149C212.699 188.504 213.804 195.963 219.325 205.527L154.725 205.524C145.449 189.458 141.473 175.114 142.798 162.491C144.343 149.868 150.637 140.114 161.68 133.229C172.833 126.153 187.685 122.615 206.237 122.616C225.672 122.617 244.942 126.156 264.046 133.233C283.039 140.119 300.377 149.874 316.058 162.497C331.739 175.121 344.218 189.466 353.495 205.532C362.108 220.45 365.919 233.551 364.925 244.835C364.153 256.12 360.454 265.969 353.828 274.384C347.424 282.799 337.486 293.127 324.014 305.367L406.172 305.37L434.996 355.289L246.165 355.282L217.342 305.363Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M38.197 175.972L15.3385 175.971L-13.6505 125.765L72.1515 125.768L204.673 355.282L141.729 355.279L38.197 175.972Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    style: { mixBlendMode: "plus-darker" },
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M230.951 281.792L231.282 281.793C238.128 274.907 248.453 265.823 262.256 254.539C275.617 243.256 285.666 234.267 292.402 227.573C299.027 220.688 303.554 213.421 305.983 205.771C308.412 198.12 307.253 190.183 302.504 181.959C297.203 172.778 289.749 165.415 280.142 159.868C270.645 154.13 260.596 151.26 249.995 151.26C239.615 151.26 232.823 154.033 229.621 159.579C226.309 164.934 227.413 172.393 232.935 181.956L168.335 181.954C159.058 165.888 155.082 151.543 156.407 138.92C157.953 126.298 164.247 116.544 175.289 109.659C186.442 102.583 201.294 99.045 219.846 99.0457C239.281 99.0464 258.551 102.585 277.655 109.663C296.649 116.549 313.986 126.303 329.667 138.927C345.349 151.551 357.827 165.895 367.104 181.961C375.718 196.88 379.528 209.981 378.535 221.265C377.762 232.549 374.063 242.399 367.438 250.814C361.033 259.229 351.095 269.557 337.624 281.796L419.782 281.8L448.605 331.719L259.774 331.712L230.951 281.792Z",
                          fill: "#F3BEC7"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M51.8063 152.402L28.9479 152.401L-0.0411453 102.195L85.7608 102.198L218.282 331.711L155.339 331.709L51.8063 152.402Z",
                          fill: "#F3BEC7"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M230.951 281.792L231.282 281.793C238.128 274.907 248.453 265.823 262.256 254.539C275.617 243.256 285.666 234.267 292.402 227.573C299.027 220.688 303.554 213.421 305.983 205.771C308.412 198.12 307.253 190.183 302.504 181.959C297.203 172.778 289.749 165.415 280.142 159.868C270.645 154.13 260.596 151.26 249.995 151.26C239.615 151.26 232.823 154.033 229.621 159.579C226.309 164.934 227.413 172.393 232.935 181.956L168.335 181.954C159.058 165.888 155.082 151.543 156.407 138.92C157.953 126.298 164.247 116.544 175.289 109.659C186.442 102.583 201.294 99.045 219.846 99.0457C239.281 99.0464 258.551 102.585 277.655 109.663C296.649 116.549 313.986 126.303 329.667 138.927C345.349 151.551 357.827 165.895 367.104 181.961C375.718 196.88 379.528 209.981 378.535 221.265C377.762 232.549 374.063 242.399 367.438 250.814C361.033 259.229 351.095 269.557 337.624 281.796L419.782 281.8L448.605 331.719L259.774 331.712L230.951 281.792Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M51.8063 152.402L28.9479 152.401L-0.0411453 102.195L85.7608 102.198L218.282 331.711L155.339 331.709L51.8063 152.402Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("g", { className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.467 355.363L188.798 355.363C195.644 348.478 205.969 339.393 219.772 328.11C233.133 316.826 243.181 307.837 249.917 301.144C253.696 297.217 256.792 293.166 259.205 288.991C261.024 285.845 262.455 282.628 263.499 279.341C265.928 271.691 264.768 263.753 260.02 255.529C254.719 246.349 247.265 238.985 237.657 233.438C228.16 227.7 218.111 224.831 207.51 224.83C197.13 224.83 190.339 227.603 187.137 233.149C183.824 238.504 184.929 245.963 190.45 255.527L125.851 255.524C116.574 239.458 112.598 225.114 113.923 212.491C114.615 206.836 116.261 201.756 118.859 197.253C122.061 191.704 126.709 187.03 132.805 183.229C143.958 176.153 158.81 172.615 177.362 172.616C196.797 172.617 216.067 176.156 235.171 183.233C254.164 190.119 271.502 199.874 287.183 212.497C302.864 225.121 315.343 239.466 324.62 255.532C333.233 270.45 337.044 283.551 336.05 294.835C335.46 303.459 333.16 311.245 329.151 318.194C327.915 320.337 326.515 322.4 324.953 324.384C318.549 332.799 308.611 343.127 295.139 355.367L377.297 355.37L406.121 405.289L217.29 405.282L188.467 355.363Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.32197 225.972L-13.5365 225.971L-42.5255 175.765L43.2765 175.768L175.798 405.282L112.854 405.279L9.32197 225.972Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M345.247 111.915C329.566 99.2919 312.229 89.5371 293.235 82.6512L235.167 183.228C254.161 190.114 271.498 199.869 287.179 212.492L345.247 111.915Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M382.686 154.964C373.41 138.898 360.931 124.553 345.25 111.93L287.182 212.506C302.863 225.13 315.342 239.475 324.618 255.541L382.686 154.964Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M293.243 82.6472C274.139 75.57 254.869 72.031 235.434 72.0303L177.366 172.607C196.801 172.608 216.071 176.147 235.175 183.224L293.243 82.6472Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M394.118 194.257C395.112 182.973 391.301 169.872 382.688 154.953L324.619 255.53C333.233 270.448 337.044 283.55 336.05 294.834L394.118 194.257Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M235.432 72.0311C216.88 72.0304 202.027 75.5681 190.875 82.6442L132.806 183.221C143.959 176.145 158.812 172.607 177.363 172.608L235.432 72.0311Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M265.59 124.25C276.191 124.251 286.24 127.12 295.737 132.858L237.669 233.435C228.172 227.697 218.123 224.828 207.522 224.827L265.59 124.25Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M295.719 132.859C305.326 138.406 312.78 145.77 318.081 154.95L260.013 255.527C254.712 246.347 247.258 238.983 237.651 233.436L295.719 132.859Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M387.218 217.608C391.227 210.66 393.527 202.874 394.117 194.25L336.049 294.827C335.459 303.451 333.159 311.237 329.15 318.185L387.218 217.608Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M245.211 132.577C248.413 127.03 255.204 124.257 265.584 124.258L207.516 224.835C197.136 224.834 190.345 227.607 187.143 233.154L245.211 132.577Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M318.094 154.945C322.842 163.17 324.002 171.107 321.573 178.757L263.505 279.334C265.934 271.684 264.774 263.746 260.026 255.522L318.094 154.945Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M176.925 96.6737C180.127 91.1249 184.776 86.4503 190.871 82.6499L132.803 183.227C126.708 187.027 122.059 191.702 118.857 197.25L176.925 96.6737Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M387.226 217.606C385.989 219.749 384.59 221.813 383.028 223.797L324.96 324.373C326.522 322.39 327.921 320.326 329.157 318.183L387.226 217.606Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M317.269 188.408C319.087 185.262 320.519 182.045 321.562 178.758L263.494 279.335C262.451 282.622 261.019 285.839 259.201 288.985L317.269 188.408Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M245.208 132.573C241.895 137.928 243 145.387 248.522 154.95L190.454 255.527C184.932 245.964 183.827 238.505 187.14 233.15L245.208 132.573Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M176.93 96.6719C174.331 101.175 172.686 106.255 171.993 111.91L113.925 212.487C114.618 206.831 116.263 201.752 118.862 197.249L176.93 96.6719Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M317.266 188.413C314.853 192.589 311.757 196.64 307.978 200.566L249.91 301.143C253.689 297.216 256.785 293.166 259.198 288.99L317.266 188.413Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M464.198 304.708L435.375 254.789L377.307 355.366L406.13 405.285L464.198 304.708Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M353.209 254.787C366.68 242.548 376.618 232.22 383.023 223.805L324.955 324.382C318.55 332.797 308.612 343.124 295.141 355.364L353.209 254.787Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M435.37 254.787L353.212 254.784L295.144 355.361L377.302 355.364L435.37 254.787Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M183.921 154.947L248.521 154.95L190.453 255.527L125.853 255.524L183.921 154.947Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M171.992 111.914C170.668 124.537 174.643 138.881 183.92 154.947L125.852 255.524C116.575 239.458 112.599 225.114 113.924 212.491L171.992 111.914Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M307.987 200.562C301.251 207.256 291.203 216.244 277.842 227.528L219.774 328.105C233.135 316.821 243.183 307.832 249.919 301.139L307.987 200.562Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M15.5469 75.1797L44.5359 125.386L-13.5321 225.963L-42.5212 175.756L15.5469 75.1797Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M277.836 227.536C264.033 238.82 253.708 247.904 246.862 254.789L188.794 355.366C195.64 348.481 205.965 339.397 219.768 328.113L277.836 227.536Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M275.358 304.706L464.189 304.713L406.12 405.29L217.29 405.283L275.358 304.706Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M44.5279 125.39L67.3864 125.39L9.31834 225.967L-13.5401 225.966L44.5279 125.39Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M101.341 75.1911L233.863 304.705L175.795 405.282L43.2733 175.768L101.341 75.1911ZM15.5431 75.19L-42.525 175.767L43.277 175.77L101.345 75.1932L15.5431 75.19Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M246.866 254.784L246.534 254.784L188.466 355.361L188.798 355.361L246.866 254.784Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M246.539 254.781L275.362 304.701L217.294 405.277L188.471 355.358L246.539 254.781Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M67.3906 125.391L170.923 304.698L112.855 405.275L9.32257 225.967L67.3906 125.391Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M170.921 304.699L233.865 304.701L175.797 405.278L112.853 405.276L170.921 304.699Z",
                      stroke: "#1B1B18",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    style: { mixBlendMode: "hard-light" },
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M246.544 254.79L246.875 254.79C253.722 247.905 264.046 238.82 277.849 227.537C291.21 216.253 301.259 207.264 307.995 200.57C314.62 193.685 319.147 186.418 321.577 178.768C324.006 171.117 322.846 163.18 318.097 154.956C312.796 145.775 305.342 138.412 295.735 132.865C286.238 127.127 276.189 124.258 265.588 124.257C255.208 124.257 248.416 127.03 245.214 132.576C241.902 137.931 243.006 145.39 248.528 154.953L183.928 154.951C174.652 138.885 170.676 124.541 172 111.918C173.546 99.2946 179.84 89.5408 190.882 82.6559C202.035 75.5798 216.887 72.0421 235.439 72.0428C254.874 72.0435 274.144 75.5825 293.248 82.6598C312.242 89.5457 329.579 99.3005 345.261 111.924C360.942 124.548 373.421 138.892 382.697 154.958C391.311 169.877 395.121 182.978 394.128 194.262C393.355 205.546 389.656 215.396 383.031 223.811C376.627 232.226 366.688 242.554 353.217 254.794L435.375 254.797L464.198 304.716L275.367 304.709L246.544 254.79Z",
                          fill: "#F0ACB8"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M246.544 254.79L246.875 254.79C253.722 247.905 264.046 238.82 277.849 227.537C291.21 216.253 301.259 207.264 307.995 200.57C314.62 193.685 319.147 186.418 321.577 178.768C324.006 171.117 322.846 163.18 318.097 154.956C312.796 145.775 305.342 138.412 295.735 132.865C286.238 127.127 276.189 124.258 265.588 124.257C255.208 124.257 248.416 127.03 245.214 132.576C241.902 137.931 243.006 145.39 248.528 154.953L183.928 154.951C174.652 138.885 170.676 124.541 172 111.918C173.546 99.2946 179.84 89.5408 190.882 82.6559C202.035 75.5798 216.887 72.0421 235.439 72.0428C254.874 72.0435 274.144 75.5825 293.248 82.6598C312.242 89.5457 329.579 99.3005 345.261 111.924C360.942 124.548 373.421 138.892 382.697 154.958C391.311 169.877 395.121 182.978 394.128 194.262C393.355 205.546 389.656 215.396 383.031 223.811C376.627 232.226 366.688 242.554 353.217 254.794L435.375 254.797L464.198 304.716L275.367 304.709L246.544 254.79Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1,
                          strokeLinejoin: "round"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    style: { mixBlendMode: "hard-light" },
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M67.41 125.402L44.5515 125.401L15.5625 75.1953L101.364 75.1985L233.886 304.712L170.942 304.71L67.41 125.402Z",
                          fill: "#F0ACB8"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M67.41 125.402L44.5515 125.401L15.5625 75.1953L101.364 75.1985L233.886 304.712L170.942 304.71L67.41 125.402Z",
                          stroke: "#1B1B18",
                          strokeWidth: 1
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "relative -mt-[4.9rem] -ml-8 hidden w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:block",
              viewBox: "0 0 440 376",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsxs("g", { className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.263 355.73L188.595 355.73C195.441 348.845 205.766 339.761 219.569 328.477C232.93 317.193 242.978 308.205 249.714 301.511C256.34 294.626 260.867 287.358 263.296 279.708C265.725 272.058 264.565 264.121 259.816 255.896C254.516 246.716 247.062 239.352 237.454 233.805C227.957 228.067 217.908 225.198 207.307 225.198C196.927 225.197 190.136 227.97 186.934 233.516C183.621 238.872 184.726 246.331 190.247 255.894L125.647 255.891C116.371 239.825 112.395 225.481 113.72 212.858C115.265 200.235 121.559 190.481 132.602 183.596C143.754 176.52 158.607 172.982 177.159 172.983C196.594 172.984 215.863 176.523 234.968 183.6C253.961 190.486 271.299 200.241 286.98 212.864C302.661 225.488 315.14 239.833 324.416 255.899C333.03 270.817 336.841 283.918 335.847 295.203C335.075 306.487 331.376 316.336 324.75 324.751C318.346 333.167 308.408 343.494 294.936 355.734L377.094 355.737L405.917 405.656L217.087 405.649L188.263 355.73Z",
                      fill: "black"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.11884 226.339L-13.7396 226.338L-42.7286 176.132L43.0733 176.135L175.595 405.649L112.651 405.647L9.11884 226.339Z",
                      fill: "black"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.263 355.73L188.595 355.73C195.441 348.845 205.766 339.761 219.569 328.477C232.93 317.193 242.978 308.205 249.714 301.511C256.34 294.626 260.867 287.358 263.296 279.708C265.725 272.058 264.565 264.121 259.816 255.896C254.516 246.716 247.062 239.352 237.454 233.805C227.957 228.067 217.908 225.198 207.307 225.198C196.927 225.197 190.136 227.97 186.934 233.516C183.621 238.872 184.726 246.331 190.247 255.894L125.647 255.891C116.371 239.825 112.395 225.481 113.72 212.858C115.265 200.235 121.559 190.481 132.602 183.596C143.754 176.52 158.607 172.982 177.159 172.983C196.594 172.984 215.863 176.523 234.968 183.6C253.961 190.486 271.299 200.241 286.98 212.864C302.661 225.488 315.14 239.833 324.416 255.899C333.03 270.817 336.841 283.918 335.847 295.203C335.075 306.487 331.376 316.336 324.75 324.751C318.346 333.167 308.408 343.494 294.936 355.734L377.094 355.737L405.917 405.656L217.087 405.649L188.263 355.73Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.11884 226.339L-13.7396 226.338L-42.7286 176.132L43.0733 176.135L175.595 405.649L112.651 405.647L9.11884 226.339Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M204.592 327.449L204.923 327.449C211.769 320.564 222.094 311.479 235.897 300.196C249.258 288.912 259.306 279.923 266.042 273.23C272.668 266.345 277.195 259.077 279.624 251.427C282.053 243.777 280.893 235.839 276.145 227.615C270.844 218.435 263.39 211.071 253.782 205.524C244.285 199.786 234.236 196.917 223.635 196.916C213.255 196.916 206.464 199.689 203.262 205.235C199.949 210.59 201.054 218.049 206.575 227.612L141.975 227.61C132.699 211.544 128.723 197.2 130.048 184.577C131.593 171.954 137.887 162.2 148.93 155.315C160.083 148.239 174.935 144.701 193.487 144.702C212.922 144.703 232.192 148.242 251.296 155.319C270.289 162.205 287.627 171.96 303.308 184.583C318.989 197.207 331.468 211.552 340.745 227.618C349.358 242.536 353.169 255.637 352.175 266.921C351.403 278.205 347.704 288.055 341.078 296.47C334.674 304.885 324.736 315.213 311.264 327.453L393.422 327.456L422.246 377.375L233.415 377.368L204.592 327.449Z",
                      fill: "#391800"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M25.447 198.058L2.58852 198.057L-26.4005 147.851L59.4015 147.854L191.923 377.368L128.979 377.365L25.447 198.058Z",
                      fill: "#391800"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M204.592 327.449L204.923 327.449C211.769 320.564 222.094 311.479 235.897 300.196C249.258 288.912 259.306 279.923 266.042 273.23C272.668 266.345 277.195 259.077 279.624 251.427C282.053 243.777 280.893 235.839 276.145 227.615C270.844 218.435 263.39 211.071 253.782 205.524C244.285 199.786 234.236 196.917 223.635 196.916C213.255 196.916 206.464 199.689 203.262 205.235C199.949 210.59 201.054 218.049 206.575 227.612L141.975 227.61C132.699 211.544 128.723 197.2 130.048 184.577C131.593 171.954 137.887 162.2 148.93 155.315C160.083 148.239 174.935 144.701 193.487 144.702C212.922 144.703 232.192 148.242 251.296 155.319C270.289 162.205 287.627 171.96 303.308 184.583C318.989 197.207 331.468 211.552 340.745 227.618C349.358 242.536 353.169 255.637 352.175 266.921C351.403 278.205 347.704 288.055 341.078 296.47C334.674 304.885 324.736 315.213 311.264 327.453L393.422 327.456L422.246 377.375L233.415 377.368L204.592 327.449Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M25.447 198.058L2.58852 198.057L-26.4005 147.851L59.4015 147.854L191.923 377.368L128.979 377.365L25.447 198.058Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    style: { mixBlendMode: "hard-light" },
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M217.342 305.363L217.673 305.363C224.519 298.478 234.844 289.393 248.647 278.11C262.008 266.826 272.056 257.837 278.792 251.144C285.418 244.259 289.945 236.991 292.374 229.341C294.803 221.691 293.643 213.753 288.895 205.529C283.594 196.349 276.14 188.985 266.532 183.438C257.035 177.7 246.986 174.831 236.385 174.83C226.005 174.83 219.214 177.603 216.012 183.149C212.699 188.504 213.804 195.963 219.325 205.527L154.725 205.524C145.449 189.458 141.473 175.114 142.798 162.491C144.343 149.868 150.637 140.114 161.68 133.229C172.833 126.153 187.685 122.615 206.237 122.616C225.672 122.617 244.942 126.156 264.046 133.233C283.039 140.119 300.377 149.874 316.058 162.497C331.739 175.121 344.218 189.466 353.495 205.532C362.108 220.45 365.919 233.551 364.925 244.835C364.153 256.12 360.454 265.969 353.828 274.384C347.424 282.799 337.486 293.127 324.014 305.367L406.172 305.37L434.996 355.289L246.165 355.282L217.342 305.363Z",
                          fill: "#733000"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M38.197 175.972L15.3385 175.971L-13.6505 125.765L72.1515 125.768L204.673 355.282L141.729 355.279L38.197 175.972Z",
                          fill: "#733000"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M217.342 305.363L217.673 305.363C224.519 298.478 234.844 289.393 248.647 278.11C262.008 266.826 272.056 257.837 278.792 251.144C285.418 244.259 289.945 236.991 292.374 229.341C294.803 221.691 293.643 213.753 288.895 205.529C283.594 196.349 276.14 188.985 266.532 183.438C257.035 177.7 246.986 174.831 236.385 174.83C226.005 174.83 219.214 177.603 216.012 183.149C212.699 188.504 213.804 195.963 219.325 205.527L154.725 205.524C145.449 189.458 141.473 175.114 142.798 162.491C144.343 149.868 150.637 140.114 161.68 133.229C172.833 126.153 187.685 122.615 206.237 122.616C225.672 122.617 244.942 126.156 264.046 133.233C283.039 140.119 300.377 149.874 316.058 162.497C331.739 175.121 344.218 189.466 353.495 205.532C362.108 220.45 365.919 233.551 364.925 244.835C364.153 256.12 360.454 265.969 353.828 274.384C347.424 282.799 337.486 293.127 324.014 305.367L406.172 305.37L434.996 355.289L246.165 355.282L217.342 305.363Z",
                          stroke: "#FF750F",
                          strokeWidth: 1
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M38.197 175.972L15.3385 175.971L-13.6505 125.765L72.1515 125.768L204.673 355.282L141.729 355.279L38.197 175.972Z",
                          stroke: "#FF750F",
                          strokeWidth: 1
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("g", { className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M217.342 305.363L217.673 305.363C224.519 298.478 234.844 289.393 248.647 278.11C262.008 266.826 272.056 257.837 278.792 251.144C285.418 244.259 289.945 236.991 292.374 229.341C294.803 221.691 293.643 213.753 288.895 205.529C283.594 196.349 276.14 188.985 266.532 183.438C257.035 177.7 246.986 174.831 236.385 174.83C226.005 174.83 219.214 177.603 216.012 183.149C212.699 188.504 213.804 195.963 219.325 205.527L154.726 205.524C145.449 189.458 141.473 175.114 142.798 162.491C144.343 149.868 150.637 140.114 161.68 133.229C172.833 126.153 187.685 122.615 206.237 122.616C225.672 122.617 244.942 126.156 264.046 133.233C283.039 140.119 300.377 149.874 316.058 162.497C331.739 175.121 344.218 189.466 353.495 205.532C362.108 220.45 365.919 233.551 364.925 244.835C364.153 256.12 360.454 265.969 353.828 274.384C347.424 282.799 337.486 293.127 324.014 305.367L406.172 305.37L434.996 355.289L246.165 355.282L217.342 305.363Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M38.197 175.972L15.3385 175.971L-13.6505 125.765L72.1515 125.768L204.673 355.282L141.729 355.279L38.197 175.972Z",
                      stroke: "#FF750F",
                      strokeWidth: 1
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("g", { className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0", children: [
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M188.467 355.363L188.798 355.363C195.644 348.478 205.969 339.393 219.772 328.11C233.133 316.826 243.181 307.837 249.917 301.144C253.696 297.217 256.792 293.166 259.205 288.991C261.024 285.845 262.455 282.628 263.499 279.341C265.928 271.691 264.768 263.753 260.02 255.529C254.719 246.349 247.265 238.985 237.657 233.438C228.16 227.7 218.111 224.831 207.51 224.83C197.13 224.83 190.339 227.603 187.137 233.149C183.824 238.504 184.929 245.963 190.45 255.527L125.851 255.524C116.574 239.458 112.598 225.114 113.923 212.491C114.615 206.836 116.261 201.756 118.859 197.253C122.061 191.704 126.709 187.03 132.805 183.229C143.958 176.153 158.81 172.615 177.362 172.616C196.797 172.617 216.067 176.156 235.171 183.233C254.164 190.119 271.502 199.874 287.183 212.497C302.864 225.121 315.343 239.466 324.62 255.532C333.233 270.45 337.044 283.551 336.05 294.835C335.46 303.459 333.16 311.245 329.151 318.194C327.915 320.337 326.515 322.4 324.953 324.384C318.549 332.799 308.611 343.127 295.139 355.367L377.297 355.37L406.121 405.289L217.29 405.282L188.467 355.363Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.32197 225.972L-13.5365 225.971L-42.5255 175.765L43.2765 175.768L175.798 405.282L112.854 405.279L9.32197 225.972Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M345.247 111.915C329.566 99.2919 312.229 89.5371 293.235 82.6512L235.167 183.228C254.161 190.114 271.498 199.869 287.179 212.492L345.247 111.915Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M382.686 154.964C373.41 138.898 360.931 124.553 345.25 111.93L287.182 212.506C302.863 225.13 315.342 239.475 324.618 255.541L382.686 154.964Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M293.243 82.6472C274.139 75.57 254.869 72.031 235.434 72.0303L177.366 172.607C196.801 172.608 216.071 176.147 235.175 183.224L293.243 82.6472Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M394.118 194.257C395.112 182.973 391.301 169.872 382.688 154.953L324.619 255.53C333.233 270.448 337.044 283.55 336.05 294.834L394.118 194.257Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M235.432 72.0311C216.88 72.0304 202.027 75.5681 190.875 82.6442L132.806 183.221C143.959 176.145 158.812 172.607 177.363 172.608L235.432 72.0311Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M265.59 124.25C276.191 124.251 286.24 127.12 295.737 132.858L237.669 233.435C228.172 227.697 218.123 224.828 207.522 224.827L265.59 124.25Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M295.719 132.859C305.326 138.406 312.78 145.77 318.081 154.95L260.013 255.527C254.712 246.347 247.258 238.983 237.651 233.436L295.719 132.859Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M387.218 217.608C391.227 210.66 393.527 202.874 394.117 194.25L336.049 294.827C335.459 303.451 333.159 311.237 329.15 318.185L387.218 217.608Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M245.211 132.577C248.413 127.03 255.204 124.257 265.584 124.258L207.516 224.835C197.136 224.834 190.345 227.607 187.143 233.154L245.211 132.577Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M318.094 154.945C322.842 163.17 324.002 171.107 321.573 178.757L263.505 279.334C265.934 271.684 264.774 263.746 260.026 255.522L318.094 154.945Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M176.925 96.6737C180.127 91.1249 184.776 86.4503 190.871 82.6499L132.803 183.227C126.708 187.027 122.059 191.702 118.857 197.25L176.925 96.6737Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M387.226 217.606C385.989 219.749 384.59 221.813 383.028 223.797L324.96 324.373C326.522 322.39 327.921 320.326 329.157 318.183L387.226 217.606Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M317.269 188.408C319.087 185.262 320.519 182.045 321.562 178.758L263.494 279.335C262.451 282.622 261.019 285.839 259.201 288.985L317.269 188.408Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M245.208 132.573C241.895 137.928 243 145.387 248.522 154.95L190.454 255.527C184.932 245.964 183.827 238.505 187.14 233.15L245.208 132.573Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M176.93 96.6719C174.331 101.175 172.686 106.255 171.993 111.91L113.925 212.487C114.618 206.831 116.263 201.752 118.862 197.249L176.93 96.6719Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M317.266 188.413C314.853 192.589 311.757 196.64 307.978 200.566L249.91 301.143C253.689 297.216 256.785 293.166 259.198 288.99L317.266 188.413Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M464.198 304.708L435.375 254.789L377.307 355.366L406.13 405.285L464.198 304.708Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M353.209 254.787C366.68 242.548 376.618 232.22 383.023 223.805L324.955 324.382C318.55 332.797 308.612 343.124 295.141 355.364L353.209 254.787Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M435.37 254.787L353.212 254.784L295.144 355.361L377.302 355.364L435.37 254.787Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M183.921 154.947L248.521 154.95L190.453 255.527L125.853 255.524L183.921 154.947Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M171.992 111.914C170.668 124.537 174.643 138.881 183.92 154.947L125.852 255.524C116.575 239.458 112.599 225.114 113.924 212.491L171.992 111.914Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M307.987 200.562C301.251 207.256 291.203 216.244 277.842 227.528L219.774 328.105C233.135 316.821 243.183 307.832 249.919 301.139L307.987 200.562Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M15.5469 75.1797L44.5359 125.386L-13.5321 225.963L-42.5212 175.756L15.5469 75.1797Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M277.836 227.536C264.033 238.82 253.708 247.904 246.862 254.789L188.794 355.366C195.64 348.481 205.965 339.397 219.768 328.113L277.836 227.536Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M275.358 304.706L464.189 304.713L406.12 405.29L217.29 405.283L275.358 304.706Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M44.5279 125.39L67.3864 125.39L9.31834 225.967L-13.5401 225.966L44.5279 125.39Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M101.341 75.1911L233.863 304.705L175.795 405.282L43.2733 175.768L101.341 75.1911ZM15.5431 75.19L-42.525 175.767L43.277 175.77L101.345 75.1932L15.5431 75.19Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M246.866 254.784L246.534 254.784L188.466 355.361L188.798 355.361L246.866 254.784Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M246.539 254.781L275.362 304.701L217.294 405.277L188.471 355.358L246.539 254.781Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M67.3906 125.391L170.923 304.698L112.855 405.275L9.32257 225.967L67.3906 125.391Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M170.921 304.699L233.865 304.701L175.797 405.278L112.853 405.276L170.921 304.699Z",
                      stroke: "#FF750F",
                      strokeWidth: 1,
                      strokeLinejoin: "bevel"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    style: { mixBlendMode: "hard-light" },
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M246.544 254.79L246.875 254.79C253.722 247.905 264.046 238.82 277.849 227.537C291.21 216.253 301.259 207.264 307.995 200.57C314.62 193.685 319.147 186.418 321.577 178.768C324.006 171.117 322.846 163.18 318.097 154.956C312.796 145.775 305.342 138.412 295.735 132.865C286.238 127.127 276.189 124.258 265.588 124.257C255.208 124.257 248.416 127.03 245.214 132.576C241.902 137.931 243.006 145.39 248.528 154.953L183.928 154.951C174.652 138.885 170.676 124.541 172 111.918C173.546 99.2946 179.84 89.5408 190.882 82.6559C202.035 75.5798 216.887 72.0421 235.439 72.0428C254.874 72.0435 274.144 75.5825 293.248 82.6598C312.242 89.5457 329.579 99.3005 345.261 111.924C360.942 124.548 373.421 138.892 382.697 154.958C391.311 169.877 395.121 182.978 394.128 194.262C393.355 205.546 389.656 215.396 383.031 223.811C376.627 232.226 366.688 242.554 353.217 254.794L435.375 254.797L464.198 304.716L275.367 304.709L246.544 254.79Z",
                          fill: "#4B0600"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M246.544 254.79L246.875 254.79C253.722 247.905 264.046 238.82 277.849 227.537C291.21 216.253 301.259 207.264 307.995 200.57C314.62 193.685 319.147 186.418 321.577 178.768C324.006 171.117 322.846 163.18 318.097 154.956C312.796 145.775 305.342 138.412 295.735 132.865C286.238 127.127 276.189 124.258 265.588 124.257C255.208 124.257 248.416 127.03 245.214 132.576C241.902 137.931 243.006 145.39 248.528 154.953L183.928 154.951C174.652 138.885 170.676 124.541 172 111.918C173.546 99.2946 179.84 89.5408 190.882 82.6559C202.035 75.5798 216.887 72.0421 235.439 72.0428C254.874 72.0435 274.144 75.5825 293.248 82.6598C312.242 89.5457 329.579 99.3005 345.261 111.924C360.942 124.548 373.421 138.892 382.697 154.958C391.311 169.877 395.121 182.978 394.128 194.262C393.355 205.546 389.656 215.396 383.031 223.811C376.627 232.226 366.688 242.554 353.217 254.794L435.375 254.797L464.198 304.716L275.367 304.709L246.544 254.79Z",
                          stroke: "#FF750F",
                          strokeWidth: 1,
                          strokeLinejoin: "round"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "g",
                  {
                    className: "translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0",
                    style: { mixBlendMode: "hard-light" },
                    children: [
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M67.41 125.402L44.5515 125.401L15.5625 75.1953L101.364 75.1985L233.886 304.712L170.942 304.71L67.41 125.402Z",
                          fill: "#4B0600"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          d: "M67.41 125.402L44.5515 125.401L15.5625 75.1953L101.364 75.1985L233.886 304.712L170.942 304.71L67.41 125.402Z",
                          stroke: "#FF750F",
                          strokeWidth: 1
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden h-14.5 lg:block" })
    ] })
  ] });
}
const __vite_glob_0_34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Welcome
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({
        "./pages/CarExpenses/CarExpensesList.tsx": __vite_glob_0_0,
        "./pages/CarExpenses/Create.tsx": __vite_glob_0_1,
        "./pages/CarExpenses/Edit.tsx": __vite_glob_0_2,
        "./pages/CarExpenses/Index.tsx": __vite_glob_0_3,
        "./pages/Cars/CarCard.tsx": __vite_glob_0_4,
        "./pages/Cars/CarCosts.tsx": __vite_glob_0_5,
        "./pages/Cars/CarCreate.tsx": __vite_glob_0_6,
        "./pages/Cars/CarEdit.tsx": __vite_glob_0_7,
        "./pages/Cars/CarForm.tsx": __vite_glob_0_8,
        "./pages/Cars/DeleteConfirmation.tsx": __vite_glob_0_9,
        "./pages/Cars/Index.tsx": __vite_glob_0_10,
        "./pages/Cars/Show.tsx": __vite_glob_0_11,
        "./pages/GasStations/DeleteConfirmation.tsx": __vite_glob_0_12,
        "./pages/GasStations/GasStationCard.tsx": __vite_glob_0_13,
        "./pages/GasStations/GasStationCreate.tsx": __vite_glob_0_14,
        "./pages/GasStations/GasStationEdit.tsx": __vite_glob_0_15,
        "./pages/GasStations/GasStationForm.tsx": __vite_glob_0_16,
        "./pages/GasStations/Index.tsx": __vite_glob_0_17,
        "./pages/Refuels/DeleteConfirmation.tsx": __vite_glob_0_18,
        "./pages/Refuels/Index.tsx": __vite_glob_0_19,
        "./pages/Refuels/RefuelCard.tsx": __vite_glob_0_20,
        "./pages/Refuels/RefuelCreate.tsx": __vite_glob_0_21,
        "./pages/Refuels/RefuelEdit.tsx": __vite_glob_0_22,
        "./pages/Refuels/RefuelForm.tsx": __vite_glob_0_23,
        "./pages/auth/confirm-password.tsx": __vite_glob_0_24,
        "./pages/auth/forgot-password.tsx": __vite_glob_0_25,
        "./pages/auth/login.tsx": __vite_glob_0_26,
        "./pages/auth/register.tsx": __vite_glob_0_27,
        "./pages/auth/reset-password.tsx": __vite_glob_0_28,
        "./pages/auth/verify-email.tsx": __vite_glob_0_29,
        "./pages/dashboard.tsx": __vite_glob_0_30,
        "./pages/settings/appearance.tsx": __vite_glob_0_31,
        "./pages/settings/password.tsx": __vite_glob_0_32,
        "./pages/settings/profile.tsx": __vite_glob_0_33,
        "./pages/welcome.tsx": __vite_glob_0_34
      });
      return pages[`./pages/${name}.tsx`];
    },
    // prettier-ignore
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
