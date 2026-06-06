import { Button } from "@/components/ui/button";
import { FileIcon, ImageIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

async function getData(userId: string) {
    const data = await prisma.site.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}


export default async function SitesRoute() {

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/login");
    }
    const data = await getData(user.id);

    return (
        <>
            <div className="flex w-full justify-end px-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/dashboard/sites/new">
                        <PlusCircle className="mr-3 size-4" /> Create Site
                    </Link>
                </Button>
            </div>

            <br />

            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex size-20 items-center justify-center rounded-full bg-blue-600">
                        <FileIcon className="size-10 text-white" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">
                        You do not have any sites created
                    </h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
                        Create your first site so your articles have a home in the dashboard.
                    </p>

                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/dashboard/sites/new">
                            <PlusCircle className="mr-3 size-5 " /> Create Site
                        </Link>
                    </Button>

                </div>
            )}

            {data.length > 0 && (
                <div className="mt-8 grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((site) => (
                        <Card key={site.id} className="overflow-hidden shadow-sm">
                            <div className="flex h-44 items-center justify-center bg-slate-100">
                                {site.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={site.imageUrl}
                                        alt={site.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="size-20 text-slate-400" />
                                )}
                            </div>

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{site.name}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {site.description}
                                </p>
                            </CardContent>

                            <CardFooter>
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href={`/dashboard/sites/${site.id}`}>
                                        View Articles
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}


        </>
    );
}
