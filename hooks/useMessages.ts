'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvolutionAPI } from '@/lib/evolution-api';
import type {
  Message,
  Chat,
  SendTextDto,
  SendMediaDto,
  SendLocationDto,
  SendContactDto,
  SendPollDto,
  SendListDto,
} from '@/types/evolution';
import { toast } from 'sonner';

export function useChats(instanceName: string) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['chats', instanceName],
    queryFn: async () => {
      const response = await api.findChats(instanceName);
      return response.data || [];
    },
    enabled: !!instanceName,
    refetchInterval: 15000,
  });
}

export function useMessages(instanceName: string, remoteJid: string, limit: number = 50) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['messages', instanceName, remoteJid, limit],
    queryFn: async () => {
      const response = await api.findMessages(instanceName, { remoteJid, limit });
      return response.data || [];
    },
    enabled: !!instanceName && !!remoteJid,
    refetchInterval: 5000,
  });
}

export function useSendText() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendTextDto }) => {
      const response = await api.sendText(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}

export function useSendMedia() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendMediaDto }) => {
      const response = await api.sendMedia(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
      toast.success('Media sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send media');
    },
  });
}

export function useSendLocation() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendLocationDto }) => {
      const response = await api.sendLocation(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
      toast.success('Location sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send location');
    },
  });
}

export function useSendContact() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendContactDto }) => {
      const response = await api.sendContact(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
      toast.success('Contact sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send contact');
    },
  });
}

export function useSendPoll() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendPollDto }) => {
      const response = await api.sendPoll(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
      toast.success('Poll sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send poll');
    },
  });
}

export function useSendList() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: SendListDto }) => {
      const response = await api.sendList(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName, data }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, data.number] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
      toast.success('List sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send list');
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({
      instanceName,
      messages,
    }: {
      instanceName: string;
      messages: Array<{ remoteJid: string; fromMe: boolean; id: string }>;
    }) => {
      const response = await api.markMessageAsRead(instanceName, { readMessages: messages });
      return response.data;
    },
    onSuccess: (_, { instanceName }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName] });
      queryClient.invalidateQueries({ queryKey: ['chats', instanceName] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({
      instanceName,
      key,
    }: {
      instanceName: string;
      key: { remoteJid: string; fromMe: boolean; id: string };
    }) => {
      const response = await api.deleteMessage(instanceName, { key });
      return response.data;
    },
    onSuccess: (_, { instanceName, key }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', instanceName, key.remoteJid] });
      toast.success('Message deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete message');
    },
  });
}
