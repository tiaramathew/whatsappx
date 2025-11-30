'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvolutionAPI } from '@/lib/evolution-api';
import type { Instance, CreateInstanceDto, InstanceSettings } from '@/types/evolution';
import { toast } from 'sonner';

export function useInstances() {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['instances'],
    queryFn: async () => {
      const response = await api.fetchInstances();
      return response.data || [];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useInstance(instanceName: string) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['instance', instanceName],
    queryFn: async () => {
      const response = await api.getConnectionState(instanceName);
      return response.data;
    },
    enabled: !!instanceName,
    refetchInterval: 5000,
  });
}

export function useCreateInstance() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async (data: CreateInstanceDto) => {
      const response = await api.createInstance(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create instance');
    },
  });
}

export function useDeleteInstance() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async (instanceName: string) => {
      const response = await api.deleteInstance(instanceName);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete instance');
    },
  });
}

export function useRestartInstance() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async (instanceName: string) => {
      const response = await api.restartInstance(instanceName);
      return response.data;
    },
    onSuccess: (_, instanceName) => {
      queryClient.invalidateQueries({ queryKey: ['instance', instanceName] });
      toast.success('Instance restarted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to restart instance');
    },
  });
}

export function useLogoutInstance() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async (instanceName: string) => {
      const response = await api.logoutInstance(instanceName);
      return response.data;
    },
    onSuccess: (_, instanceName) => {
      queryClient.invalidateQueries({ queryKey: ['instance', instanceName] });
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance logged out successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to logout instance');
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, settings }: { instanceName: string; settings: InstanceSettings }) => {
      const response = await api.setSettings(instanceName, settings);
      return response.data;
    },
    onSuccess: (_, { instanceName }) => {
      queryClient.invalidateQueries({ queryKey: ['instance', instanceName] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });
}
