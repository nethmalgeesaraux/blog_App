import { DeleteArticleAction } from "@/app/actions";
import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
    CalendarDays,
    CirclePlus,
    FileText,
    ImageIcon,
    Newspaper,
    Pencil,
    Settings,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getData(userId: string, siteId: string) {
    const data = await prisma.site.findFirst({
        where: {
            id: siteId,
            userId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            subdirectory: true,
            createdAt: true,
            Post: {
                select: {
                    image: true,
                    title: true,
                    smallDescription: true,
                    createdAt: true,
                    id: true,
                    slug: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    return data;
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default async function SiteldRoute({
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

    const data = await getData(user.id, siteld);

    if (!data) {
        return notFound();
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        /{data.subdirectory}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                        {data.name}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {data.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <Button asChild variant="outline" className="h-12 gap-3 px-8 text-base font-semibold">
                        <Link href={`/dashboard/sites/${siteld}/blog`}>
                            <Newspaper className="size-5" />
                            View Blog
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-12 gap-3 px-8 text-base font-semibold">
                        <Link href={`/dashboard/sites/${siteld}/settings`}>
                            <Settings className="size-5" />
                            Settings
                        </Link>
                    </Button>

                    <Button asChild className="h-12 gap-3 bg-blue-600 px-8 text-base font-semibold text-white hover:bg-blue-700">
                        <Link href={`/dashboard/sites/${siteld}/articles/new`}>
                            <CirclePlus className="size-5" />
                            Create Article
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Articles</p>
                        <FileText className="size-5 text-blue-600" />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-950">{data.Post.length}</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Created</p>
                        <CalendarDays className="size-5 text-blue-600" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-slate-950">
                        {formatDate(data.createdAt)}
                    </p>
                </div>

                {/* <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">Blog path</p>
                        <Newspaper className="size-5 text-blue-600" />
                    </div>
                    <p className="mt-4 truncate text-lg font-semibold text-slate-950">
                        /dashboard/sites/{data.id}/blog
                    </p>
                </div> */}
            </div>

            <section className="rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">Latest articles</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Articles saved in the database for this site.
                        </p>
                    </div>
                </div>

                {data.Post.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-blue-50">
                            <FileText className="size-8 text-blue-600" />
                        </div>
                        <h3 className="mt-5 text-base font-semibold text-slate-950">
                            No articles yet
                        </h3>
                        <p className="mt-2 max-w-sm text-sm text-slate-500">
                            Create your first article and it will appear here instantly from the database.
                        </p>
                        <Button asChild className="mt-6 bg-blue-600 text-white hover:bg-blue-700">
                            <Link href={`/dashboard/sites/${siteld}/articles/new`}>
                                <CirclePlus className="mr-2 size-4" />
                                Create Article
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {data.Post.map((post) => (
                            <article key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                                <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 sm:w-32">
                                    {post.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="size-8 text-slate-400" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-base font-semibold text-slate-950">
                                        {post.title}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                        {post.smallDescription}
                                    </p>
                                    <p className="mt-3 text-xs font-medium text-slate-400">
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>

                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                    <Button asChild variant="outline" className="w-full sm:w-auto">
                                        <Link href={`/dashboard/sites/${siteld}/blog#${post.slug}`}>
                                            View
                                        </Link>
                                    </Button>

                                    <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
                                        <Link href={`/dashboard/sites/${siteld}/articles/${post.id}/edit`}>
                                            <Pencil className="size-4" />
                                            Edit
                                        </Link>
                                    </Button>

                                    <form action={DeleteArticleAction}>
                                        <input type="hidden" name="siteId" value={siteld} />
                                        <input type="hidden" name="articleId" value={post.id} />
                                        <Button type="submit" variant="destructive" className="w-full gap-2 sm:w-auto">
                                            <Trash2 className="size-4" />
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
