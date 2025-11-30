'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGroups } from '@/hooks/useGroups';
import { useInstances } from '@/hooks/useInstance';
import { UsersRound, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GroupsPage() {
  const { data: instances } = useInstances();
  const mainInstance = instances?.[0];
  const instanceName = mainInstance?.instanceName || '';

  const { data: groups, isLoading, refetch } = useGroups(instanceName);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Manage your WhatsApp groups
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
      ) : groups && groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UsersRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{group.subject}</p>
                    <p className="text-sm text-muted-foreground">{group.participants.length} members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersRound className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
            <p className="text-muted-foreground text-center">
              Connect an instance to view groups
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
