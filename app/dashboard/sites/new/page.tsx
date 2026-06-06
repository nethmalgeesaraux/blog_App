'use client'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateSiteAction } from "@/app/actions";
import { getInputProps, getTextareaProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { siteSchema } from "@/app/utils/zodSchemas";
import { useActionState } from "react";


export default function NewSiteRoute() {
    const [lastResult, action] = useActionState(CreateSiteAction, undefined);

    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: siteSchema,
            });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Card className="w-[500px] shadow-md">
                <CardHeader>
                    <CardTitle>Create Site</CardTitle>
                    <CardDescription>
                        Create your Site here. Click the button below once you’re done...
                    </CardDescription>
                </CardHeader>

                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                    <CardContent>
                        <div className="flex flex-col gap-y-6">
                            <div className="grid gap-3">
                                <Label htmlFor={fields.name.id} className="block text-sm font-medium">
                                    Site Name
                                </Label>
                                <Input
                                    {...getInputProps(fields.name, { type: "text" })}
                                    placeholder="Enter site name"
                                />
                                <p className="text-sm text-red-500">{fields.name.errors}</p>

                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={fields.subdirectory.id}>Subdirectory</Label>
                                <Input
                                    {...getInputProps(fields.subdirectory, { type: "text" })}
                                    placeholder="Subdirectory"
                                />
                                <p className="text-sm text-red-500">{fields.subdirectory.errors}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={fields.description.id}>Description</Label>
                                <Textarea
                                    {...getTextareaProps(fields.description)}
                                    placeholder="Small Description for your site"
                                />
                                <p className="text-sm text-red-500">{fields.description.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Submit
                            </Button>
                        </div>
                    </CardFooter>
                </form>

            </Card>
        </div>
    );
}
