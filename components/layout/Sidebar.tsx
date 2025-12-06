"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Smartphone,
    Webhook,
    Shield,
    MessageCircle,
    UsersRound,
    Coffee,
    FileText,
    Share2,
    Radio,
    Folder,
    Database,
    CreditCard,
    Plug
} from "lucide-react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
        section: "main"
    },
    {
        label: "Channels",
        icon: Folder,
        href: "/instances", // Mapping "Channels" to instances
        color: "text-violet-500",
        section: "PLAYGROUND"
    },
    {
        label: "Warmer",
        icon: Coffee,
        href: "/warmer",
        color: "text-orange-500",
        section: "PLAYGROUND"
    },
    {
        label: "Stripe",
        icon: CreditCard,
        href: "/stripe",
        color: "text-blue-600",
        section: "PLAYGROUND"
    },
    {
        label: "Tools & MCP",
        icon: Plug,
        href: "/tools",
        color: "text-orange-500",
        section: "PLAYGROUND"
    },
    {
        label: "Knowledge Base",
        icon: Database,
        href: "/knowledge-base",
        color: "text-indigo-500",
        section: "PLAYGROUND"
    },
    {
        label: "Chat",
        icon: MessageSquare,
        href: "/conversations",
        color: "text-pink-700",
        section: "MESSAGES"
    },
    {
        label: "Contacts",
        icon: Users,
        href: "/contacts",
        color: "text-orange-700",
        section: "MESSAGES"
    },
    {
        label: "Groups",
        icon: UsersRound,
        href: "/groups",
        color: "text-teal-600",
        section: "MESSAGES"
    },
    {
        label: "Broadcast",
        icon: Radio,
        href: "/broadcast",
        color: "text-emerald-500",
        section: "MESSAGES"
    },
    {
        label: "Invoices",
        icon: FileText,
        href: "/billing", // Mapping "Invoices" to billing
        color: "text-blue-500",
        section: "MISCELLANEOUS"
    },

    {
        label: "Admin Settings",
        icon: Settings,
        href: "/admin",
        color: "text-slate-500",
        section: "ADMIN"
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const renderNavSection = (sectionName: string, items: typeof routes) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6 animate-enter">
                {sectionName !== "main" && (
                    <div className="px-4 mb-3 flex items-center">
                        <h3 className="text-xs font-bold text-sidebar-foreground/40 uppercase tracking-widest">
                            {sectionName}
                        </h3>
                        <div className="ml-3 h-px flex-1 bg-gradient-to-r from-sidebar-border to-transparent" />
                    </div>
                )}
                <div className="space-y-1.5 px-2">
                    {items.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex items-center px-3 py-2.5 w-full font-medium cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                                pathname === route.href
                                    ? "bg-sidebar-accent/10 text-sidebar-primary shadow-sm ring-1 ring-sidebar-ring/20"
                                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/5 hover:translate-x-1"
                            )}
                        >
                            {/* Active Indicator */}
                            {pathname === route.href && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-sidebar-primary rounded-r-full shadow-[0_0_10px_rgba(var(--sidebar-primary),0.5)]" />
                            )}

                            <div className="flex items-center flex-1 relative z-10 pl-2">
                                <route.icon className={cn(
                                    "h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110",
                                    pathname === route.href ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                                )} />
                                <span className="text-sm tracking-wide">{route.label}</span>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-sidebar-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-sidebar/30 backdrop-blur-2xl border-r border-sidebar-border shadow-2xl transition-all duration-300">
            <div className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar">
                <Link href="/" className="flex items-center gap-4 mb-10 group cursor-pointer">
                    <div className="relative w-12 h-12 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110">
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center ring-1 ring-white/20 shadow-xl overflow-hidden backdrop-blur-md">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/70">
                            WhatsAppX
                        </h1>
                        <span className="text-[10px] font-medium text-sidebar-foreground/40 tracking-[0.2em] uppercase">Enterprise</span>
                    </div>
                </Link>

                {renderNavSection("main", routes.filter(r => r.section === "main"))}
                {renderNavSection("PLAYGROUND", routes.filter(r => r.section === "PLAYGROUND"))}
                {renderNavSection("MESSAGES", routes.filter(r => r.section === "MESSAGES"))}
                {renderNavSection("MISCELLANEOUS", routes.filter(r => r.section === "MISCELLANEOUS"))}
                {renderNavSection("ADMIN", routes.filter(r => r.section === "ADMIN"))}

            </div>

            <div className="p-4 border-t border-sidebar-border bg-sidebar/20 backdrop-blur-xl space-y-2">
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-medium text-sidebar-foreground/40 uppercase tracking-widest">Preference</p>
                    <ModeToggle />
                </div>

                {session?.user && (
                    <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/5 transition-all duration-200 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                            {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
                                {session.user.name || 'User'}
                            </p>
                            <p className="text-xs text-sidebar-foreground/50 truncate">
                                {session.user.role || 'Member'}
                            </p>
                        </div>
                        <Settings className="w-4 h-4 text-sidebar-foreground/30 group-hover:text-primary transition-colors hover:rotate-90 duration-500" />
                    </div>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 rounded-xl"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span className="font-medium">Sign Out</span>
                </Button>
            </div>
        </div>
    );
};
