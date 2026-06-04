import Link from "next/link";
import { navLinks } from "@/app/dashboard/layout";

export function DashboardItems() {
    return (
        <>
            {
                navLinks.map((item) => (
                    <Link href={item.href} key={item.name}>
                        {item.name}
                    </Link>
                ))
            }
        </>

    );
}
