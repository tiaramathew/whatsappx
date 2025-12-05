"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function WarmerPage() {
    const { data: instances, isLoading } = useQuery({
        queryKey: ['instances'],
        queryFn: async () => {
            const res = await axios.get('/api/instances');
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    const activeInstances = instances?.filter((i: any) => i.status === 'open') || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 animate-in-fade">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-heading">WhatsApp Warmer</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Warmer
                </Button>
            </div>

            {activeInstances.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No active instances</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You need an active WhatsApp instance to create a warmer. Connect one first.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeInstances.map((instance: any) => (
                        <Card key={instance.instanceName} className="glass-card">
                            <CardHeader>
                                <CardTitle>{instance.instanceName}</CardTitle>
                                <CardDescription>Status: {instance.status}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Warm up this number to increase reliability.
                                </p>
                                <Button variant="outline" className="w-full">Configure Warmer</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
