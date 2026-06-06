'use server';

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod/v4";
import { articleSchema, siteSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64);
}

const pricingPlans = {
    starter: {
        name: "Starter",
        unitAmount: 900,
    },
    pro: {
        name: "Pro",
        unitAmount: 1900,
    },
    business: {
        name: "Business",
        unitAmount: 4900,
    },
} as const;

type PricingPlanKey = keyof typeof pricingPlans;

function getAppUrl() {
    return process.env.KINDE_SITE_URL || "http://localhost:3000";
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function CreateSiteAction(_prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/login");
    }

    const submission = parseWithZod(formData, {
        schema: siteSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    await prisma.site.create({
        data: {
            description: submission.value.description,
            name: submission.value.name,
            subdirectory: submission.value.subdirectory,
            userId: user.id,
        },
    });

    return redirect("/dashboard/sites");


}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function CreateArticleAction(_prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const siteId = String(formData.get("siteId") ?? "");

    if (!user) {
        return redirect("/api/auth/login");
    }

    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!site) {
        return redirect("/dashboard/sites");
    }

    const submission = parseWithZod(formData, {
        schema: articleSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const baseSlug = slugify(submission.value.title) || "article";

    await prisma.post.create({
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            image: submission.value.image || "/logo.png",
            articleContent: submission.value.articleContent,
            slug: `${baseSlug}-${Date.now().toString(36)}`,
            published: submission.value.published,
            userId: user.id,
            siteId: site.id,
        },
    });

    revalidatePath(`/dashboard/sites/${site.id}`);
    revalidatePath(`/dashboard/sites/${site.id}/blog`);
    revalidatePath("/dashboard");

    return redirect(`/dashboard/sites/${site.id}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function UpdateArticleAction(_prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const siteId = String(formData.get("siteId") ?? "");
    const articleId = String(formData.get("articleId") ?? "");

    if (!user) {
        return redirect("/api/auth/login");
    }

    const post = await prisma.post.findFirst({
        where: {
            id: articleId,
            siteId,
            userId: user.id,
        },
        select: {
            id: true,
            siteId: true,
        },
    });

    if (!post || !post.siteId) {
        return redirect("/dashboard/sites");
    }

    const submission = parseWithZod(formData, {
        schema: articleSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const baseSlug = slugify(submission.value.title) || "article";

    await prisma.post.update({
        where: {
            id: post.id,
        },
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            image: submission.value.image || "/logo.png",
            articleContent: submission.value.articleContent,
            slug: `${baseSlug}-${Date.now().toString(36)}`,
            published: submission.value.published,
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/dashboard/sites/${post.siteId}`);
    revalidatePath(`/dashboard/sites/${post.siteId}/blog`);
    revalidatePath("/dashboard");

    return redirect(`/dashboard/sites/${post.siteId}`);
}

export async function ToggleArticlePublishAction(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const siteId = String(formData.get("siteId") ?? "");
    const articleId = String(formData.get("articleId") ?? "");
    const published = String(formData.get("published") ?? "") === "true";

    if (!user) {
        return redirect("/api/auth/login");
    }

    const post = await prisma.post.findFirst({
        where: {
            id: articleId,
            siteId,
            userId: user.id,
        },
        select: {
            id: true,
            siteId: true,
        },
    });

    if (!post || !post.siteId) {
        return redirect("/dashboard/sites");
    }

    await prisma.post.update({
        where: {
            id: post.id,
        },
        data: {
            published,
            updatedAt: new Date(),
        },
    });

    revalidatePath(`/dashboard/sites/${post.siteId}`);
    revalidatePath(`/dashboard/sites/${post.siteId}/blog`);
    revalidatePath("/dashboard");

    return redirect(`/dashboard/sites/${post.siteId}`);
}

export async function DeleteArticleAction(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const siteId = String(formData.get("siteId") ?? "");
    const articleId = String(formData.get("articleId") ?? "");

    if (!user) {
        return redirect("/api/auth/login");
    }

    const post = await prisma.post.findFirst({
        where: {
            id: articleId,
            siteId,
            userId: user.id,
        },
        select: {
            id: true,
            siteId: true,
        },
    });

    if (!post || !post.siteId) {
        return redirect("/dashboard/sites");
    }

    await prisma.post.delete({
        where: {
            id: post.id,
        },
    });

    revalidatePath(`/dashboard/sites/${post.siteId}`);
    revalidatePath(`/dashboard/sites/${post.siteId}/blog`);
    revalidatePath("/dashboard");

    return redirect(`/dashboard/sites/${post.siteId}`);
}

export async function CreateCheckoutSessionAction(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const plan = String(formData.get("plan") ?? "") as PricingPlanKey;
    const selectedPlan = pricingPlans[plan];
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!user) {
        return redirect("/api/auth/login");
    }

    if (!selectedPlan) {
        return redirect("/dashboard/pricing");
    }

    if (!stripeSecretKey) {
        throw new Error("STRIPE_SECRET_KEY is required");
    }

    const appUrl = getAppUrl();
    const body = new URLSearchParams({
        mode: "subscription",
        success_url: `${appUrl}/dashboard/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/dashboard/pricing?checkout=cancel`,
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][unit_amount]": String(selectedPlan.unitAmount),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": `Blog Marshal ${selectedPlan.name}`,
        "line_items[0][quantity]": "1",
        "metadata[userId]": user.id,
        "metadata[plan]": plan,
        allow_promotion_codes: "true",
    });

    if (user.email) {
        body.set("customer_email", user.email);
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${stripeSecretKey}:`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Stripe checkout session failed: ${error}`);
    }

    const session = await response.json() as { url?: string };

    if (!session.url) {
        throw new Error("Stripe did not return a checkout URL");
    }

    return redirect(session.url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function UpdateSiteAction(_prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const siteId = String(formData.get("siteId") ?? "");

    if (!user) {
        return redirect("/api/auth/login");
    }

    const submission = parseWithZod(formData, {
        schema: siteSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!site) {
        return redirect("/dashboard/sites");
    }

    await prisma.site.update({
        where: {
            id: site.id,
        },
        data: {
            name: submission.value.name,
            description: submission.value.description,
            subdirectory: submission.value.subdirectory,
        },
    });

    revalidatePath(`/dashboard/sites/${site.id}`);
    revalidatePath(`/dashboard/sites/${site.id}/blog`);
    revalidatePath("/dashboard/sites");

    return redirect(`/dashboard/sites/${site.id}`);
}
