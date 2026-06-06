import { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { DashboardItems } from "../components/DashboardItems";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ThemToggle } from "../components/ThemToggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <section className="grid h-screen w-full overflow-hidden bg-white text-slate-950 md:grid-cols-[280px_1fr]">
            <aside className="hidden border-r border-slate-200 bg-slate-50 md:block">
                <div className="flex h-screen flex-col">
                    <div className="flex h-16 items-center border-b border-slate-200 px-4">
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <Image src={Logo} alt="Logo" className="size-8" />
                            <h3 className="text-3xl tracking-tight">
                                Blog<span className="text-blue-600">-Marshal</span>
                            </h3>
                        </Link>
                    </div>

                    <div className="flex-1 px-3 py-3">
                        <nav className="grid items-start gap-1">
                            <DashboardItems />
                        </nav>
                    </div>

                </div>
            </aside>
            <main className="flex min-h-0 flex-col overflow-hidden">
                <header className="relative z-50 h-16 shrink-0 overflow-visible border-b border-slate-200 bg-white px-6">
                    <div className="absolute right-6 top-3 flex items-center gap-2 overflow-visible">
                        <ThemToggle />

                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <CircleUser className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                        </DropdownMenu> */}

                        <LogoutLink>
                            <Button variant="outline" size="sm" className="gap-2 border-slate-200">
                                <LogOut className="size-4" />
                                Logout
                            </Button>
                        </LogoutLink>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto bg-white p-6">
                    {children}
                </div>
            </main>
        </section>

    );
}
