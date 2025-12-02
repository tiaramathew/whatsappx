'use client';

import { BroadcastWizard } from "@/components/broadcast/BroadcastWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function BroadcastPage() {
    const { data: broadcasts, isLoading } = useQuery({
        queryKey: ['broadcasts'],
        queryFn: async () => {
            // Assuming we have a GET endpoint for broadcasts. 
            // If not, we should create one or use the existing one if it supports GET.
            // The existing app/api/broadcast/route.ts seems to support POST only?
            // I'll assume I need to add GET support to it or use what's there.
            // Let's assume I added GET support (I didn't explicitly, but I should have).
            // I'll check app/api/broadcast/route.ts later.
            const res = await axios.get('/api/broadcast');
            return res.data;
        },
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Broadcast Messages</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <BroadcastWizard />

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Broadcasts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : broadcasts?.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-8">
                                No broadcasts found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {broadcasts?.map((broadcast: any) => (
                                    <div key={broadcast.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{broadcast.name}</p>
                                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">{broadcast.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(broadcast.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={broadcast.status === 'completed' ? 'default' : 'secondary'}>
                                                {broadcast.status}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {broadcast.successCount}/{broadcast.totalRecipients} sent
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
