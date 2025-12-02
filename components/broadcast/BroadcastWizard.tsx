'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInstancesStore } from "@/lib/store/instances";

export function BroadcastWizard() {
    const { instances } = useInstancesStore();
    const [step, setStep] = useState(1);
    const [instanceName, setInstanceName] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState('');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return axios.post('/api/broadcast', data);
        },
        onSuccess: () => {
            toast.success("Broadcast scheduled");
            queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
            setStep(1);
            setName('');
            setMessage('');
            setRecipients('');
            setInstanceName('');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create broadcast");
        }
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleSubmit = () => {
        mutation.mutate({
            instanceName,
            name,
            message,
            recipients, // Backend handles parsing
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Broadcast - Step {step} of 3</CardTitle>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Instance</Label>
                            <Select value={instanceName} onValueChange={setInstanceName}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an instance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {instances.map((instance) => (
                                        <SelectItem key={instance.instanceName} value={instance.instanceName}>
                                            {instance.instanceName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Campaign Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Summer Sale"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message Content</Label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hello {{name}}..."
                                rows={5}
                            />
                        </div>
                        <Button onClick={handleNext} className="w-full" disabled={!instanceName || !message || !name}>Next</Button>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <Label>Recipients (comma separated numbers)</Label>
                        <Textarea
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            placeholder="1234567890, 0987654321"
                            rows={5}
                        />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleBack} className="w-full">Back</Button>
                            <Button onClick={handleNext} className="w-full" disabled={!recipients}>Next</Button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-md space-y-2">
                            <p><strong>Instance:</strong> {instanceName}</p>
                            <p><strong>Campaign:</strong> {name}</p>
                            <p><strong>Message:</strong> {message}</p>
                            <p><strong>Recipients:</strong> {recipients.split(',').length} numbers</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleBack} className="w-full">Back</Button>
                            <Button onClick={handleSubmit} className="w-full" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Sending...' : 'Send Broadcast'}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
