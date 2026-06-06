import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditArticleForm } from "./edit-article-form";

async function getArticle(userId: string, siteId: string, articleId: string) {
    return prisma.post.findFirst({
        where: {
            id: articleId,
            siteId,
            userId,
        },
        select: {
            id: true,
            siteId: true,
            title: true,
            smallDescription: true,
            image: true,
            articleContent: true,
            Site: {
                select: {
                    id: true,
                    name: true,
                    subdirectory: true,
                },
            },
        },
    });
}

export default async function EditArticleRoute({
    params,
}: {
    params: Promise<{ siteld: string; articleId: string }>;
}) {
    const { siteld, articleId } = await params;
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/login");
    }

    const article = await getArticle(user.id, siteld, articleId);

    if (!article || !article.Site || !article.siteId) {
        return notFound();
    }

    const formArticle = {
        id: article.id,
        siteId: article.siteId,
        title: article.title,
        smallDescription: article.smallDescription,
        image: article.image,
        articleContent: article.articleContent,
    };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        /{article.Site.subdirectory}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        Edit article
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Update this article for {article.Site.name}.
                    </p>
                </div>

                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/dashboard/sites/${article.Site.id}`}>
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-6">
                <EditArticleForm article={formArticle} />
            </section>
        </div>
    );
}
