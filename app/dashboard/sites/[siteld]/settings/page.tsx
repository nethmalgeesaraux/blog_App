import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

async function getSite(userId: string, siteId: string) {
    return prisma.site.findFirst({
        where: {
            id: siteId,
            userId,
        },
        select: {
            id: true,
            name: true,
            subdirectory: true,
            description: true,
        },
    });
}

export default async function SettingsRoute({
    params,
}: {
    params: Promise<{ siteld: string }>;
}) {
    const { siteld } = await params;
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/login");
    }

    const site = await getSite(user.id, siteld);

    if (!site) {
        return notFound();
    }

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        /{site.subdirectory}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        Site settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Update this site name, path, and description.
                    </p>
                </div>

                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/dashboard/sites/${site.id}`}>
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-6">
                <SettingsForm site={site} />
            </section>
        </div>
    );
}
