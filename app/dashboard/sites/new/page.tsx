import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export default function NewSiteRoute() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Card className="w-[500px] shadow-md">
                <CardHeader>
                    <CardTitle>Create Site</CardTitle>
                    <CardDescription>
                        Create your Site here. Click the button below once you’re done...
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-y-6">
                        <div className="grid gap-3">
                            <Label className="block text-sm font-medium">Site Name</Label>
                            <Input
                                type="text"
                                className="mt-1 w-full rounded-md border px-3 py-2"
                                placeholder="Enter site name"
                            />

                        </div>

                        <div className="grid gap-2">
                            <Label>Subdirectory</Label>
                            <Input placeholder="Subdirectory" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Small Description for your site" />
                            <br />
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Send message
                            </Button>
                        </div>


                    </div>
                </CardContent>

            </Card>
        </div>
    );
}
