'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvolutionAPI } from '@/lib/evolution-api';
import type { Group, CreateGroupDto, UpdateGroupParticipantsDto } from '@/types/evolution';
import { toast } from 'sonner';

export function useGroups(instanceName: string) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['groups', instanceName],
    queryFn: async () => {
      const response = await api.fetchAllGroups(instanceName, true);
      return response.data || [];
    },
    enabled: !!instanceName,
    refetchInterval: 30000,
  });
}

export function useGroup(instanceName: string, groupJid: string) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['group', instanceName, groupJid],
    queryFn: async () => {
      const response = await api.findGroupByJid(instanceName, groupJid);
      return response.data;
    },
    enabled: !!instanceName && !!groupJid,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, data }: { instanceName: string; data: CreateGroupDto }) => {
      const response = await api.createGroup(instanceName, data);
      return response.data;
    },
    onSuccess: (_, { instanceName }) => {
      queryClient.invalidateQueries({ queryKey: ['groups', instanceName] });
      toast.success('Group created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create group');
    },
  });
}

export function useUpdateGroupSubject() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({
      instanceName,
      groupJid,
      subject,
    }: {
      instanceName: string;
      groupJid: string;
      subject: string;
    }) => {
      const response = await api.updateGroupSubject(instanceName, { groupJid, subject });
      return response.data;
    },
    onSuccess: (_, { instanceName, groupJid }) => {
      queryClient.invalidateQueries({ queryKey: ['group', instanceName, groupJid] });
      queryClient.invalidateQueries({ queryKey: ['groups', instanceName] });
      toast.success('Group name updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update group name');
    },
  });
}

export function useUpdateGroupDescription() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({
      instanceName,
      groupJid,
      description,
    }: {
      instanceName: string;
      groupJid: string;
      description: string;
    }) => {
      const response = await api.updateGroupDescription(instanceName, { groupJid, description });
      return response.data;
    },
    onSuccess: (_, { instanceName, groupJid }) => {
      queryClient.invalidateQueries({ queryKey: ['group', instanceName, groupJid] });
      queryClient.invalidateQueries({ queryKey: ['groups', instanceName] });
      toast.success('Group description updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update group description');
    },
  });
}

export function useUpdateGroupParticipants() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({
      instanceName,
      groupJid,
      action,
      participants,
    }: {
      instanceName: string;
      groupJid: string;
      action: 'add' | 'remove' | 'promote' | 'demote';
      participants: string[];
    }) => {
      const response = await api.updateGroupMembers(instanceName, { groupJid, action, participants });
      return response.data;
    },
    onSuccess: (_, { instanceName, groupJid, action }) => {
      queryClient.invalidateQueries({ queryKey: ['group', instanceName, groupJid] });
      queryClient.invalidateQueries({ queryKey: ['groups', instanceName] });
      toast.success(`Participants ${action}ed successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update participants');
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, groupJid }: { instanceName: string; groupJid: string }) => {
      const response = await api.leaveGroup(instanceName, groupJid);
      return response.data;
    },
    onSuccess: (_, { instanceName }) => {
      queryClient.invalidateQueries({ queryKey: ['groups', instanceName] });
      toast.success('Left group successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to leave group');
    },
  });
}

export function useFetchInviteCode() {
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, groupJid }: { instanceName: string; groupJid: string }) => {
      const response = await api.fetchInviteCode(instanceName, groupJid);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.inviteCode) {
        toast.success('Invite code fetched successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch invite code');
    },
  });
}
