'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusIndicator } from '@/components/dashboard/status-indicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInstances } from '@/hooks/useInstance';
import { useChats } from '@/hooks/useMessages';
import { useContacts } from '@/hooks/useContacts';
import { useGroups } from '@/hooks/useGroups';
import {
  MessageSquare,
  Users,
  UsersRound,
  Send,
  Inbox,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: instances, isLoading: instancesLoading, refetch: refetchInstances } = useInstances();
  const mainInstance = instances?.[0];
  const instanceName = mainInstance?.instanceName || '';

  const { data: chats, isLoading: chatsLoading } = useChats(instanceName);
  const { data: contacts, isLoading: contactsLoading } = useContacts(instanceName);
  const { data: groups, isLoading: groupsLoading } = useGroups(instanceName);

  // Calculate stats
  const totalContacts = contacts?.length || 0;
  const totalGroups = groups?.length || 0;
  const activeConversations = chats?.filter((chat) => chat.unreadCount > 0).length || 0;
  const totalUnread = chats?.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0) || 0;

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your WhatsApp instance and conversations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchInstances()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/instances">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Instance
            </Button>
          </Link>
        </div>
      </div>

      {/* Instance Status */}
      {instancesLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : mainInstance ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Instance Status</CardTitle>
                <CardDescription>{mainInstance.instanceName}</CardDescription>
              </div>
              <StatusIndicator status={mainInstance.status} showText />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{mainInstance.number || 'Not connected'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Name</p>
                <p className="font-medium">{mainInstance.profileName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{mainInstance.status}</p>
              </div>
              <div>
                <Link href="/instances">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Instance
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Instance Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create a new instance to start using the dashboard
            </p>
            <Link href="/instances">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Instance
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {mainInstance && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {chatsLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <StatsCard
                title="Active Conversations"
                value={activeConversations}
                description={`${totalUnread} unread messages`}
                icon={MessageSquare}
              />
              <StatsCard
                title="Total Chats"
                value={chats?.length || 0}
                description="All conversations"
                icon={Inbox}
              />
            </>
          )}

          {contactsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Contacts"
              value={totalContacts}
              description="Total contacts"
              icon={Users}
            />
          )}

          {groupsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <StatsCard
              title="Groups"
              value={totalGroups}
              description="Total groups"
              icon={UsersRound}
            />
          )}
        </div>
      )}

      {/* Quick Actions */}
      {mainInstance && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Link href="/conversations">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Conversations
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Contacts
              </Button>
            </Link>
            <Link href="/groups">
              <Button variant="outline" className="w-full justify-start">
                <UsersRound className="h-4 w-4 mr-2" />
                Manage Groups
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {mainInstance && chats && chats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Your most recent chats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chats.slice(0, 5).map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{chat.id.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(chat.conversationTimestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link href="/conversations">
              <Button variant="outline" className="w-full mt-4">
                View All Conversations
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
