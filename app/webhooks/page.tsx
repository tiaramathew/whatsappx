'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Webhook } from 'lucide-react';

export default function WebhooksPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
        <p className="text-muted-foreground">
          Configure webhook endpoints for real-time events
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Webhook className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Webhook Configuration Coming Soon</h3>
          <p className="text-muted-foreground text-center">
            Configure webhooks to receive real-time notifications
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
