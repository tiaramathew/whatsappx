import { KnowledgeBaseManager } from "@/components/knowledge-base/KnowledgeBaseManager";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Knowledge Base",
    description: "Manage vector database connections and data.",
};

export default function KnowledgeBasePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
                <p className="text-muted-foreground">
                    Manage your vector database data via PicaOS.
                </p>
            </div>
            <KnowledgeBaseManager />
        </div>
    );
}
