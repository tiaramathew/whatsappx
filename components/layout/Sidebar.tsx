"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    MessageCircle,
    UsersRound,
    Coffee,
    FileText,
    Radio,
    Folder,
    Database,
    CreditCard,
    Plug,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const routeGroups = [
    {
        title: "Communication",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: "/", color: "text-sky-500" },
            { label: "Chat", icon: MessageSquare, href: "/conversations", color: "text-pink-700" },
            { label: "Broadcast", icon: Radio, href: "/broadcast", color: "text-emerald-500" },
            { label: "Contacts", icon: Users, href: "/contacts", color: "text-orange-700" },
            { label: "Groups", icon: UsersRound, href: "/groups", color: "text-teal-600" },
        ]
    },
    {
        title: "Platform",
        items: [
            { label: "Channels", icon: Folder, href: "/instances", color: "text-violet-500" },
            { label: "Tools & MCP", icon: Plug, href: "/tools", color: "text-orange-500" },
            { label: "Knowledge Base", icon: Database, href: "/knowledge-base", color: "text-indigo-500" },
            { label: "Warmer", icon: Coffee, href: "/warmer", color: "text-orange-500" },
        ]
    },
    {
        title: "Finance",
        items: [
            { label: "Invoices", icon: FileText, href: "/billing", color: "text-blue-500" },
            { label: "Stripe", icon: CreditCard, href: "/stripe", color: "text-blue-600" },
        ]
    },
    {
        title: "System",
        items: [
            { label: "User Management", icon: Users, href: "/users", color: "text-[#E91E63]" },
            { label: "Admin Settings", icon: Settings, href: "/admin", color: "text-slate-500" },
        ]
    }
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { isCollapsed, toggle } = useSidebarStore();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div
            className={cn(
                "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
                isCollapsed ? "w-[80px]" : "w-72"
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent z-50 hidden md:flex items-center justify-center p-0"
                onClick={toggle}
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            <div className={cn("flex-1 overflow-y-auto custom-scrollbar py-6", isCollapsed ? "px-3" : "px-4")}>
                {/* Header / Logo */}
                <Link href="/" className={cn("flex items-center gap-3 mb-8 group cursor-pointer", isCollapsed ? "justify-center" : "px-2")}>
                    <div className="relative w-9 h-9 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="object-contain w-full h-full"
                        />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
                                WhatsAppX
                            </h1>
                        </div>
                    )}
                </Link>

                {/* Navigation Groups */}
                <div className="space-y-6">
                    {routeGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                            {!isCollapsed && (
                                <div className="px-2 mb-2">
                                    <h3 className="text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                        {group.title}
                                    </h3>
                                </div>
                            )}

                            <div className="space-y-0.5">
                                {group.items.map((route) => (
                                    <TooltipProvider key={route.href} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route.href}
                                                    className={cn(
                                                        "group flex items-center py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors border border-transparent",
                                                        isCollapsed ? "justify-center px-0 w-10 mx-auto" : "px-3 w-full",
                                                        pathname === route.href
                                                            ? "bg-sidebar-accent text-sidebar-primary border-sidebar-border shadow-sm"
                                                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                                    )}
                                                >
                                                    <route.icon className={cn(
                                                        "h-4 w-4 shrink-0 transition-colors",
                                                        pathname === route.href ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
                                                        !isCollapsed && "mr-3"
                                                    )} />
                                                    {!isCollapsed && (
                                                        <span className="truncate">
                                                            {route.label}
                                                        </span>
                                                    )}
                                                </Link>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border font-medium z-50 ml-2 shadow-lg">
                                                    <p>{route.label}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className={cn("border-t border-sidebar-border bg-sidebar transition-all duration-300", isCollapsed ? "p-3 flex flex-col items-center gap-4" : "p-4 space-y-2")}>

                {session?.user && (
                    <div className={cn("flex items-center rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer group border border-transparent hover:border-sidebar-border", isCollapsed ? "p-1.5 justify-center" : "gap-3 p-2")}>
                        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-primary text-xs font-bold ring-1 ring-sidebar-border shrink-0">
                            {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0 flex flex-col text-left">
                                    <p className="text-sm font-semibold text-sidebar-foreground truncate">
                                        {session.user.name || 'User'}
                                    </p>
                                    <p className="text-[10px] text-sidebar-foreground/50 truncate">
                                        {session.user.role || 'Member'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <ModeToggle />
                                    <Settings className="w-3.5 h-3.5 text-sidebar-foreground/40 group-hover:text-sidebar-foreground transition-colors" />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {isCollapsed && (
                    <div className="flex flex-col gap-2">
                        <ModeToggle />
                    </div>
                )}

                <Button
                    variant="ghost"
                    size={isCollapsed ? "icon" : "default"}
                    className={cn(
                        "text-sidebar-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-colors h-9",
                        isCollapsed ? "w-9 h-9 rounded-full" : "w-full justify-start px-2"
                    )}
                    onClick={handleLogout}
                >
                    <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                </Button>
            </div>
        </div>
    );
};
