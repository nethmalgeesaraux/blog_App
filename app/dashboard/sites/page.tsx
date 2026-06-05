import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { FileIcon } from "lucide-react";

export default function SitesRoute() {
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

            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="flex size-20 items-center justify-center rounded-full bg-blue-600">
                    <FileIcon className="size-10 text-white" />
                </div>
                <h2 className="mt-6 text-xl font-semibold">
                    You dont have any Sites created
                </h2>
                <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
                    You currently dont have any Sites. Please create some so that you can
                    see them right here!
                </p>

                 <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/dashboard/sites/new">
                        <PlusCircle className="mr-3 size-5 " /> Create Site
                    </Link>
                </Button>

            </div>


        </>
    );
}
