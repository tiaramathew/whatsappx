'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface UserDialogProps {
    user?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function UserDialog({ user, open: controlledOpen, onOpenChange }: UserDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isEditing = !!user;
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [isActive, setIsActive] = useState(true);

    const queryClient = useQueryClient();

    // Fetch roles
    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await axios.get('/api/roles');
            return res.data;
        }
    });

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setUsername(user.username || '');
            setRoleId(user.roleId?.toString() || '');
            setIsActive(user.isActive ?? true);
            setPassword(''); // Don't show password
        } else {
            setFirstName('');
            setLastName('');
            setEmail('');
            setUsername('');
            setRoleId('');
            setIsActive(true);
            setPassword('');
        }
    }, [user, open]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (isEditing) {
                return axios.patch(`/api/users/${user.id}`, data);
            } else {
                return axios.post('/api/users', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setOpen(false);
            toast.success(isEditing ? "User updated successfully" : "User created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to save user");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            firstName,
            lastName,
            email,
            username,
            password: password || undefined, // Only send if changed or new
            roleId,
            isActive
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isEditing && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update user details and permissions.' : 'Create a new user account.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{isEditing ? 'Password (leave blank to keep)' : 'Password'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={roleId} onValueChange={setRoleId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles?.map((role: any) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="isActive">Active Account</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : 'Save User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
