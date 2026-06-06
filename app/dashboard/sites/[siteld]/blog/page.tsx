import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeft, FileText, ImageIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getBlog(userId: string, siteId: string) {
    return prisma.site.findFirst({
        where: {
            id: siteId,
            userId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            subdirectory: true,
            Post: {
                select: {
                    id: true,
                    title: true,
                    smallDescription: true,
                    articleContent: true,
                    image: true,
                    slug: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function contentToText(content: unknown) {
    if (typeof content === "string") {
        return content;
    }

    return JSON.stringify(content, null, 2);
}

export default async function BlogPreviewRoute({
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

    const blog = await getBlog(user.id, siteld);

    if (!blog) {
        return notFound();
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        /{blog.subdirectory}
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                        {blog.name}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                        {blog.description}
                    </p>
                </div>

                <Button asChild variant="outline" className="gap-2">
                    <Link href={`/dashboard/sites/${blog.id}`}>
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </Button>
            </div>

            {blog.Post.length === 0 ? (
                <section className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-10 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-blue-50">
                        <FileText className="size-8 text-blue-600" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-slate-950">No posts published</h2>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                        Create an article from the dashboard and it will appear in this blog preview.
                    </p>
                </section>
            ) : (
                <div className="grid gap-8">
                    {blog.Post.map((post) => (
                        <article id={post.slug} key={post.id} className="scroll-mt-8 rounded-lg border border-slate-200 bg-white">
                            <div className="flex h-64 items-center justify-center overflow-hidden rounded-t-lg bg-slate-100">
                                {post.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="size-16 text-slate-400" />
                                )}
                            </div>

                            <div className="p-6">
                                <p className="text-sm font-medium text-slate-400">
                                    {formatDate(post.createdAt)}
                                </p>
                                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                    {post.title}
                                </h2>
                                <p className="mt-3 text-base leading-7 text-slate-600">
                                    {post.smallDescription}
                                </p>
                                <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                    {contentToText(post.articleContent)}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
