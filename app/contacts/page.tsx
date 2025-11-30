'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContacts } from '@/hooks/useContacts';
import { useInstances } from '@/hooks/useInstance';
import { Users, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactsPage() {
  const { data: instances } = useInstances();
  const mainInstance = instances?.[0];
  const instanceName = mainInstance?.instanceName || '';

  const { data: contacts, isLoading, refetch } = useContacts(instanceName);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your WhatsApp contacts
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : contacts && contacts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.slice(0, 20).map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.pushName || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{contact.id.split('@')[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Contacts Found</h3>
            <p className="text-muted-foreground text-center">
              Connect an instance to view contacts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
