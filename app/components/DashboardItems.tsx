"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DollarSign, Globe, Home } from "lucide-react";

const navLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        name: "Sites",
        href: "/dashboard/sites",
        icon: Globe,
    },
    {
        name: "Pricing",
        href: "/dashboard/pricing",
        icon: DollarSign,
    },
];

export function DashboardItems() {
    const pathname = usePathname();

    return (
        <>
            {
                navLinks.map((item) => {
                    const LinkIcon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            href={item.href}
                            key={item.name}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600",
                                isActive && "bg-blue-50 text-blue-600"
                            )}
                        >
                            <LinkIcon className="size-4" />
                            {item.name}
                        </Link>
                    );
                })
            }
        </>

    );
}
