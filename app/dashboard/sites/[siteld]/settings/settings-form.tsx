"use client";

import { UpdateSiteAction } from "@/app/actions";
import { siteSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Save } from "lucide-react";
import { useActionState } from "react";

type SettingsFormProps = {
    site: {
        id: string;
        name: string;
        subdirectory: string;
        description: string;
    };
};

export function SettingsForm({ site }: SettingsFormProps) {
    const [lastResult, action] = useActionState(UpdateSiteAction, undefined);

    const [form, fields] = useForm({
        lastResult,
        defaultValue: {
            name: site.name,
            subdirectory: site.subdirectory,
            description: site.description,
        },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: siteSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate className="grid gap-6">
            <input type="hidden" name="siteId" value={site.id} />

            <div className="grid gap-3">
                <Label htmlFor={fields.name.id}>Site name</Label>
                <Input
                    {...getInputProps(fields.name, { type: "text" })}
                    className="h-10"
                />
                <p className="text-sm text-red-500">{fields.name.errors}</p>
            </div>

            <div className="grid gap-3">
                <Label htmlFor={fields.subdirectory.id}>Subdirectory</Label>
                <Input
                    {...getInputProps(fields.subdirectory, { type: "text" })}
                    className="h-10"
                />
                <p className="text-sm text-red-500">{fields.subdirectory.errors}</p>
            </div>

            <div className="grid gap-3">
                <Label htmlFor={fields.description.id}>Description</Label>
                <Textarea
                    {...getTextareaProps(fields.description)}
                    className="min-h-32"
                />
                <p className="text-sm text-red-500">{fields.description.errors}</p>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="h-10 gap-2 bg-blue-600 px-5 text-white hover:bg-blue-700">
                    <Save className="size-4" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
