import { StripeManager } from "@/components/stripe/StripeManager";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stripe Integration",
    description: "Manage Stripe payments and connections.",
};

export default function StripePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Stripe Integration</h2>
                <p className="text-muted-foreground">
                    Manage your Stripe payments and data via PicaOS.
                </p>
            </div>
            <StripeManager />
        </div>
    );
}
