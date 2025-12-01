"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    UsersRound
} from "lucide-react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Instances",
        icon: Smartphone,
        href: "/instances",
        color: "text-violet-500",
    },
    {
        label: "Conversations",
        icon: MessageSquare,
        href: "/conversations",
        color: "text-pink-700",
    },
    {
        label: "Contacts",
        icon: Users,
        href: "/contacts",
        color: "text-orange-700",
    },
    {
        label: "Groups",
        icon: UsersRound,
        href: "/groups",
        color: "text-teal-600",
    },
    {
        label: "Webhooks",
        icon: Webhook,
        href: "/webhooks",
        color: "text-green-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

const adminRoutes = [
    {
        label: "Users",
        icon: Shield,
        href: "/users",
        color: "text-blue-500",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-slate-100">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-10">
                    <div className="relative w-10 h-10 mr-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">WhatsApp</h1>
                        <p className="text-xs text-slate-400">Dashboard</p>
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-800 rounded-lg transition",
                                pathname === route.href 
                                    ? "bg-slate-800 text-white" 
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn(
                                    "h-5 w-5 mr-3",
                                    pathname === route.href ? route.color : ""
                                )} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                    {isAdmin && (
                        <>
                            <div className="pt-6 pb-2 px-3">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Administration
                                </div>
                            </div>
                            {adminRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-800 rounded-lg transition",
                                        pathname === route.href 
                                            ? "bg-slate-800 text-white" 
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center flex-1">
                                        <route.icon className={cn(
                                            "h-5 w-5 mr-3",
                                            pathname === route.href ? route.color : ""
                                        )} />
                                        {route.label}
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="px-3 py-2 border-t border-slate-800">
                {session?.user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium">
                            {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {session.user.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                )}
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
};
