"use client";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const Header = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-50 flex items-center border-b border-border/40 bg-background/95 p-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <MobileSidebar />

            <div className="hidden md:flex items-center text-sm text-muted-foreground ml-4">
                <Link href="/" className="hover:text-foreground transition-colors">
                    Dashboard
                </Link>
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const isLast = index === segments.length - 1;
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="h-4 w-4 mx-1" />
                            {isLast ? (
                                <span className="font-medium text-foreground">{title}</span>
                            ) : (
                                <Link href={href} className="hover:text-foreground transition-colors">
                                    {title}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex w-full justify-end items-center space-x-2">
                <ModeToggle />
                <UserMenu />
            </div>
        </header>
    );
};
