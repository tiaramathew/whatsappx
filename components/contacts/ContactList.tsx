'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import { useSearchParams } from 'next/navigation';

interface Contact {
    id: number;
    name: string | null;
    pushName: string | null;
    phone: string | null;
    profilePicUrl: string | null;
    tags: string[];
}

export const ContactList = () => {
    const searchParams = useSearchParams();
    const instanceName = searchParams.get('instance') || 'main';

    const { data: contacts, isLoading } = useQuery({
        queryKey: ['contacts', instanceName],
        queryFn: async () => {
            const res = await axios.get(`/api/contacts?instance=${instanceName}`);
            return res.data as Contact[];
        },
    });

    if (isLoading) {
        return <div className="p-4 text-center">Loading contacts...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts?.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={contact.profilePicUrl || ''} />
                                    <AvatarFallback>
                                        {(contact.name || contact.pushName || '?').substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{contact.name || contact.pushName || 'Unknown'}</TableCell>
                            <TableCell>{contact.phone}</TableCell>
                            <TableCell>
                                {contact.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>
                                ))}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {contacts?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No contacts found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
