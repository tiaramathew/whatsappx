import { ToolManager } from "@/components/tools/ToolManager";
import { Plug } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools & MCP",
    description: "Manage Webhooks and MCP connections for your AI Agents.",
};

export default function ToolsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 animate-in-fade">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-2">
                    <Plug className="h-8 w-8" />
                    Tools & MCP
                </h2>
            </div>
            <div className="text-muted-foreground">
                Connect your AI Agents to external services via Webhooks or Model Context Protocol (MCP).
            </div>
            <ToolManager />
        </div>
    );
}
