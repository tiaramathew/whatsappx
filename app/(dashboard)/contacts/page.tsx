import { ContactList } from "@/components/contacts/ContactList";
import { ContactDialog } from "@/components/contacts/ContactDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ContactsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                <div className="flex items-center space-x-2">
                    <ContactDialog />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contacts..." className="pl-8" />
                </div>
            </div>
            <ContactList />
        </div>
    );
}
