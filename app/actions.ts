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
            userId: user.id,
            siteId: site.id,
        },
    });

    revalidatePath(`/dashboard/sites/${site.id}`);
    revalidatePath(`/dashboard/sites/${site.id}/blog`);

    return redirect(`/dashboard/sites/${site.id}`);
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
