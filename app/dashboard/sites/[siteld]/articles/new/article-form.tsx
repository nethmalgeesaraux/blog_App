"use client";

import { CreateArticleAction } from "@/app/actions";
import { articleSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Save } from "lucide-react";
import { useActionState } from "react";

export function ArticleForm({ siteId }: { siteId: string }) {
    const [lastResult, action] = useActionState(CreateArticleAction, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: articleSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate className="grid gap-6">
            <input type="hidden" name="siteId" value={siteId} />

            <div className="grid gap-3">
                <Label htmlFor={fields.title.id}>Article title</Label>
                <Input
                    {...getInputProps(fields.title, { type: "text" })}
                    placeholder="How to start your first blog"
                    className="h-10"
                />
                <p className="text-sm text-red-500">{fields.title.errors}</p>
            </div>

            <div className="grid gap-3">
                <Label htmlFor={fields.smallDescription.id}>Short description</Label>
                <Textarea
                    {...getTextareaProps(fields.smallDescription)}
                    placeholder="A small summary that appears in the blog list"
                    className="min-h-24"
                />
                <p className="text-sm text-red-500">{fields.smallDescription.errors}</p>
            </div>

            <div className="grid gap-3">
                <Label htmlFor={fields.image.id}>Cover image URL</Label>
                <Input
                    {...getInputProps(fields.image, { type: "text" })}
                    placeholder="https://example.com/cover.jpg"
                    className="h-10"
                />
                <p className="text-sm text-red-500">{fields.image.errors}</p>
            </div>

            <div className="grid gap-3">
                <Label htmlFor={fields.articleContent.id}>Article content</Label>
                <Textarea
                    {...getTextareaProps(fields.articleContent)}
                    placeholder="Write your article here"
                    className="min-h-72"
                />
                <p className="text-sm text-red-500">{fields.articleContent.errors}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="h-10 gap-2 bg-blue-600 px-5 text-white hover:bg-blue-700">
                    <Save className="size-4" />
                    Save Article
                </Button>
            </div>
        </form>
    );
}
