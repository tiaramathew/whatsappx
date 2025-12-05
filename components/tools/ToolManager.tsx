"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Edit, Plug, Webhook } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function ToolManager() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<any>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("WEBHOOK");
    const [config, setConfig] = useState("{}");

    const queryClient = useQueryClient();

    const { data: tools, isLoading } = useQuery({
        queryKey: ['tools'],
        queryFn: async () => {
            const res = await axios.get('/api/tools');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (editingTool) {
                return axios.patch(`/api/tools/${editingTool.id}`, data);
            } else {
                return axios.post('/api/tools', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tools'] });
            setIsDialogOpen(false);
            resetForm();
            toast.success(editingTool ? "Tool updated" : "Tool created");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to save tool");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return axios.delete(`/api/tools/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tools'] });
            toast.success("Tool deleted");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete tool");
        }
    });

    const resetForm = () => {
        setEditingTool(null);
        setName("");
        setDescription("");
        setType("WEBHOOK");
        setConfig("{}");
    };

    const handleEdit = (tool: any) => {
        setEditingTool(tool);
        setName(tool.name);
        setDescription(tool.description || "");
        setType(tool.type);
        setConfig(JSON.stringify(tool.config, null, 2));
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        try {
            const parsedConfig = JSON.parse(config);
            mutation.mutate({
                name,
                description,
                type,
                config: parsedConfig
            });
        } catch (e) {
            toast.error("Invalid JSON configuration");
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tool
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingTool ? 'Edit Tool' : 'Create New Tool'}</DialogTitle>
                            <DialogDescription>
                                Configure a Webhook or MCP connection.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Webhook" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WEBHOOK">Webhook</SelectItem>
                                        <SelectItem value="MCP">MCP Client</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="config">Configuration (JSON)</Label>
                                <div className="text-xs text-muted-foreground mb-1">
                                    {type === 'WEBHOOK' ? 'Example: { "url": "https://api.example.com/webhook", "headers": { "Authorization": "Bearer token" } }' : 'Example: { "serverUrl": "http://localhost:3000/mcp" }'}
                                </div>
                                <Textarea
                                    id="config"
                                    value={config}
                                    onChange={(e) => setConfig(e.target.value)}
                                    className="font-mono text-sm h-32"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={mutation.isPending || !name}>
                                {mutation.isPending ? "Saving..." : "Save Tool"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border glass-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Config</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tools?.map((tool: any) => (
                            <TableRow key={tool.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    {tool.type === 'WEBHOOK' ? <Webhook className="h-4 w-4 text-blue-500" /> : <Plug className="h-4 w-4 text-green-500" />}
                                    {tool.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{tool.type}</Badge>
                                </TableCell>
                                <TableCell>{tool.description}</TableCell>
                                <TableCell className="font-mono text-xs max-w-[200px] truncate">
                                    {JSON.stringify(tool.config)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(tool)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => {
                                            if (confirm('Delete this tool?')) deleteMutation.mutate(tool.id);
                                        }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tools?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No tools found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
