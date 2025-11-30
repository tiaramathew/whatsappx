'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInstances, useCreateInstance, useDeleteInstance, useLogoutInstance, useRestartInstance } from '@/hooks/useInstance';
import { StatusIndicator } from '@/components/dashboard/status-indicator';
import { Plus, RefreshCw, Trash2, LogOut, Power, QrCode } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import QRCode from 'react-qr-code';

export default function InstancesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [selectedQRInstance, setSelectedQRInstance] = useState<string | null>(null);

  const { data: instances, isLoading, refetch } = useInstances();
  const createInstance = useCreateInstance();
  const deleteInstance = useDeleteInstance();
  const logoutInstance = useLogoutInstance();
  const restartInstance = useRestartInstance();

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;

    await createInstance.mutateAsync({
      instanceName: newInstanceName.trim(),
      qrcode: true,
    });

    setNewInstanceName('');
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleDelete = async (instanceName: string) => {
    if (confirm(`Are you sure you want to delete instance "${instanceName}"?`)) {
      await deleteInstance.mutateAsync(instanceName);
    }
  };

  const handleLogout = async (instanceName: string) => {
    if (confirm(`Are you sure you want to logout instance "${instanceName}"?`)) {
      await logoutInstance.mutateAsync(instanceName);
    }
  };

  const handleRestart = async (instanceName: string) => {
    await restartInstance.mutateAsync(instanceName);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instance Management</h1>
          <p className="text-muted-foreground">
            Create and manage your WhatsApp instances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Instance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Instance</DialogTitle>
                <DialogDescription>
                  Create a new WhatsApp instance to start managing conversations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Instance Name</Label>
                  <Input
                    id="instanceName"
                    placeholder="my-whatsapp-instance"
                    value={newInstanceName}
                    onChange={(e) => setNewInstanceName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a unique name to identify this instance
                  </p>
                </div>
                <Button
                  onClick={handleCreateInstance}
                  disabled={!newInstanceName.trim() || createInstance.isPending}
                  className="w-full"
                >
                  {createInstance.isPending ? 'Creating...' : 'Create Instance'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Instances Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : instances && instances.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <Card key={instance.instanceName}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{instance.instanceName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <StatusIndicator status={instance.status} />
                      <span className="capitalize">{instance.status}</span>
                    </CardDescription>
                  </div>
                  {instance.qrcode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedQRInstance(instance.instanceName)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{instance.number || 'Not connected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Name</p>
                    <p className="font-medium">{instance.profileName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestart(instance.instanceName)}
                    disabled={restartInstance.isPending}
                  >
                    <Power className="h-3 w-3 mr-1" />
                    Restart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogout(instance.instanceName)}
                    disabled={logoutInstance.isPending}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Logout
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(instance.instanceName)}
                    disabled={deleteInstance.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Instances Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first instance to start managing WhatsApp conversations
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Instance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!selectedQRInstance} onOpenChange={() => setSelectedQRInstance(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - {selectedQRInstance}</DialogTitle>
            <DialogDescription>
              Scan this QR code with WhatsApp to connect your instance
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6 bg-white rounded-lg">
            {selectedQRInstance && instances?.find((i) => i.instanceName === selectedQRInstance)?.qrcode ? (
              <QRCode
                value={instances.find((i) => i.instanceName === selectedQRInstance)?.qrcode?.code || ''}
                size={256}
              />
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">QR Code not available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  The instance may already be connected
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Open WhatsApp on your phone</p>
            <p>2. Tap Menu or Settings and select Linked Devices</p>
            <p>3. Tap on Link a Device</p>
            <p>4. Point your phone at this screen to capture the QR code</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
