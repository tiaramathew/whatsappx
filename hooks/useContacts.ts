'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvolutionAPI } from '@/lib/evolution-api';
import type { Contact, CheckNumberDto } from '@/types/evolution';
import { toast } from 'sonner';

export function useContacts(instanceName: string) {
  const api = getEvolutionAPI();

  return useQuery({
    queryKey: ['contacts', instanceName],
    queryFn: async () => {
      const response = await api.findContacts(instanceName);
      return response.data || [];
    },
    enabled: !!instanceName,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useCheckWhatsApp() {
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, numbers }: { instanceName: string; numbers: string[] }) => {
      const response = await api.checkIsWhatsApp(instanceName, { numbers });
      return response.data || [];
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check numbers');
    },
  });
}

export function useProfilePicture() {
  const api = getEvolutionAPI();

  return useMutation({
    mutationFn: async ({ instanceName, number }: { instanceName: string; number: string }) => {
      const response = await api.fetchProfilePictureUrl(instanceName, { number });
      return response.data;
    },
    onError: (error: any) => {
      console.error('Failed to fetch profile picture:', error.message);
    },
  });
}
