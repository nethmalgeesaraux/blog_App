'use server';

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod/v4";
import { siteSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";


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
