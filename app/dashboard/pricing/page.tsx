import { CreateCheckoutSessionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

const plans = [
    {
        key: "starter",
        name: "Starter",
        price: "$9",
        description: "For getting your first blog site moving.",
        features: ["1 site workspace", "Unlimited draft articles", "Basic blog preview"],
        highlighted: false,
    },
    {
        key: "pro",
        name: "Pro",
        price: "$19",
        description: "For creators publishing regularly.",
        features: ["5 site workspaces", "Article management", "Priority publishing tools"],
        highlighted: true,
    },
    {
        key: "business",
        name: "Business",
        price: "$49",
        description: "For teams managing multiple brands.",
        features: ["Unlimited sites", "Team-ready workflows", "Advanced support"],
        highlighted: false,
    },
];

export default async function PricingRoute({
    searchParams,
}: {
    searchParams: Promise<{ checkout?: string }>;
}) {
    const { checkout } = await searchParams;

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
            <div className="flex flex-col gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Sparkles className="size-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">Pricing</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Choose a monthly plan and continue through Stripe Checkout.
                    </p>
                </div>
            </div>

            {checkout === "success" && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    Payment completed. Your Stripe session was created successfully.
                </div>
            )}

            {checkout === "cancel" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    Checkout was canceled. You can choose a plan when you are ready.
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                    <section
                        key={plan.key}
                        className={
                            plan.highlighted
                                ? "rounded-lg border-2 border-blue-600 bg-white p-6 shadow-sm"
                                : "rounded-lg border border-slate-200 bg-white p-6"
                        }
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">{plan.name}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {plan.description}
                                </p>
                            </div>
                            {plan.highlighted && (
                                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Zap className="size-5" />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-end gap-1">
                            <span className="text-4xl font-bold tracking-tight text-slate-950">
                                {plan.price}
                            </span>
                            <span className="pb-1 text-sm font-medium text-slate-500">/month</span>
                        </div>

                        <ul className="mt-6 grid gap-3">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                                    <Check className="size-4 text-blue-600" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <form action={CreateCheckoutSessionAction} className="mt-8">
                            <input type="hidden" name="plan" value={plan.key} />
                            <Button
                                type="submit"
                                className={
                                    plan.highlighted
                                        ? "h-10 w-full bg-blue-600 text-white hover:bg-blue-700"
                                        : "h-10 w-full"
                                }
                                variant={plan.highlighted ? "default" : "outline"}
                            >
                                Continue to Checkout
                            </Button>
                        </form>
                    </section>
                ))}
            </div>
        </div>
    );
}
