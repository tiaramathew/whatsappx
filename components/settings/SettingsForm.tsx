"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useInstancesStore } from "@/lib/store/instances";
import { useState, useEffect } from "react";

export const SettingsForm = () => {
    const { selectedInstance, instances } = useInstancesStore();
    const [loading, setLoading] = useState(false);
    const [rejectCall, setRejectCall] = useState(false);
    const [alwaysOnline, setAlwaysOnline] = useState(false);
    const [readMessages, setReadMessages] = useState(false);
    const [instance, setInstance] = useState(selectedInstance || "");

    // Evolution API Config
    const [evolutionUrl, setEvolutionUrl] = useState("");
    const [evolutionKey, setEvolutionKey] = useState("");

    const { toast } = useToast();

    useEffect(() => {
        // Fetch existing settings
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    if (data.evolutionApiUrl) setEvolutionUrl(data.evolutionApiUrl);
                    if (data.evolutionApiKey) setEvolutionKey(data.evolutionApiKey);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instanceName: instance,
                    rejectCall,
                    alwaysOnline,
                    readMessages,
                    evolutionApiUrl: evolutionUrl,
                    evolutionApiKey: evolutionKey,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save settings');
            }

            toast({
                title: "Success",
                description: "Settings saved successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
                {/* Evolution API Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Evolution API Configuration</CardTitle>
                        <CardDescription>
                            Enter your Evolution API credentials to connect your instances.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="evolution-url">API URL</Label>
                            <Input
                                id="evolution-url"
                                placeholder="https://api.yourdomain.com"
                                value={evolutionUrl}
                                onChange={(e) => setEvolutionUrl(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="evolution-key">API Key</Label>
                            <Input
                                id="evolution-key"
                                type="password"
                                placeholder="Your Global API Key"
                                value={evolutionKey}
                                onChange={(e) => setEvolutionKey(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Instance Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Instance Settings</CardTitle>
                        <CardDescription>
                            Manage settings for your WhatsApp instance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="instance">Select Instance</Label>
                            <Select value={instance} onValueChange={setInstance}>
                                <SelectTrigger id="instance">
                                    <SelectValue placeholder="Choose an instance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instances.map((inst) => (
                                        <SelectItem key={inst.instanceName} value={inst.instanceName}>
                                            {inst.instanceName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="reject-call" className="flex flex-col space-y-1">
                                <span>Reject Calls</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Automatically reject incoming audio and video calls.
                                </span>
                            </Label>
                            <Switch
                                id="reject-call"
                                checked={rejectCall}
                                onCheckedChange={setRejectCall}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="always-online" className="flex flex-col space-y-1">
                                <span>Always Online</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Keep the instance status as "Online" even when idle.
                                </span>
                            </Label>
                            <Switch
                                id="always-online"
                                checked={alwaysOnline}
                                onCheckedChange={setAlwaysOnline}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="read-messages" className="flex flex-col space-y-1">
                                <span>Mark Messages as Read</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Automatically mark incoming messages as read.
                                </span>
                            </Label>
                            <Switch
                                id="read-messages"
                                checked={readMessages}
                                onCheckedChange={setReadMessages}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Settings"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    );
};
