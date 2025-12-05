import { UserTable } from "@/components/admin/UserTable";
import { UserDialog } from "@/components/admin/UserDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management",
    description: "Manage users, roles, and permissions.",
};

export default function UsersPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 animate-in-fade">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-heading">User Management</h2>
                <div className="flex items-center space-x-2">
                    <UserDialog />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8 glass-input" />
                </div>
            </div>
            <UserTable />
        </div>
    );
}
