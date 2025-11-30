import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Instance,
  CreateInstanceDto,
  InstanceSettings,
  Message,
  SendTextDto,
  SendMediaDto,
  SendLocationDto,
  SendContactDto,
  SendPollDto,
  SendListDto,
  Chat,
  Contact,
  CheckNumberDto,
  CheckNumberResponse,
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  UpdateGroupParticipantsDto,
  WebhookConfig,
  PresenceDto,
  ApiResponse,
  EvolutionError,
} from '@/types/evolution';

export class EvolutionAPIClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL?: string, apiKey?: string) {
    this.baseURL = baseURL || process.env.EVOLUTION_API_URL || 'http://localhost:8080';
    this.apiKey = apiKey || process.env.EVOLUTION_API_KEY || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        apikey: this.apiKey,
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<EvolutionError>) => {
        if (error.response) {
          throw {
            status: error.response.status,
            message: error.response.data?.message || error.message,
            error: error.response.data?.error,
            details: error.response.data?.details,
          } as EvolutionError;
        }
        throw {
          status: 500,
          message: error.message || 'Network error',
          error: 'NETWORK_ERROR',
        } as EvolutionError;
      }
    );
  }

  // ============= Instance Management =============
  async createInstance(data: CreateInstanceDto): Promise<ApiResponse<Instance>> {
    const response = await this.client.post('/instance/create', data);
    return response.data;
  }

  async fetchInstances(): Promise<ApiResponse<Instance[]>> {
    const response = await this.client.get('/instance/fetchInstances');
    return response.data;
  }

  async connectInstance(instanceName: string): Promise<ApiResponse> {
    const response = await this.client.get(`/instance/connect/${instanceName}`);
    return response.data;
  }

  async getConnectionState(instanceName: string): Promise<ApiResponse> {
    const response = await this.client.get(`/instance/connectionState/${instanceName}`);
    return response.data;
  }

  async logoutInstance(instanceName: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/instance/logout/${instanceName}`);
    return response.data;
  }

  async deleteInstance(instanceName: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/instance/delete/${instanceName}`);
    return response.data;
  }

  async restartInstance(instanceName: string): Promise<ApiResponse> {
    const response = await this.client.put(`/instance/restart/${instanceName}`);
    return response.data;
  }

  async setPresence(instanceName: string, data: PresenceDto): Promise<ApiResponse> {
    const response = await this.client.post(`/instance/setPresence/${instanceName}`, data);
    return response.data;
  }

  // ============= Messages =============
  async sendText(instanceName: string, data: SendTextDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendText/${instanceName}`, data);
    return response.data;
  }

  async sendMedia(instanceName: string, data: SendMediaDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendMedia/${instanceName}`, data);
    return response.data;
  }

  async sendWhatsAppAudio(instanceName: string, data: SendMediaDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendWhatsAppAudio/${instanceName}`, data);
    return response.data;
  }

  async sendSticker(instanceName: string, data: SendMediaDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendSticker/${instanceName}`, data);
    return response.data;
  }

  async sendLocation(instanceName: string, data: SendLocationDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendLocation/${instanceName}`, data);
    return response.data;
  }

  async sendContact(instanceName: string, data: SendContactDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendContact/${instanceName}`, data);
    return response.data;
  }

  async sendReaction(
    instanceName: string,
    data: { key: any; reaction: string }
  ): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendReaction/${instanceName}`, data);
    return response.data;
  }

  async sendPoll(instanceName: string, data: SendPollDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendPoll/${instanceName}`, data);
    return response.data;
  }

  async sendList(instanceName: string, data: SendListDto): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/message/sendList/${instanceName}`, data);
    return response.data;
  }

  // ============= Chats & Contacts =============
  async findChats(instanceName: string): Promise<ApiResponse<Chat[]>> {
    const response = await this.client.post(`/chat/findChats/${instanceName}`, {});
    return response.data;
  }

  async findMessages(
    instanceName: string,
    params: { remoteJid: string; limit?: number; offset?: number }
  ): Promise<ApiResponse<Message[]>> {
    const response = await this.client.post(`/chat/findMessages/${instanceName}`, params);
    return response.data;
  }

  async findContacts(instanceName: string): Promise<ApiResponse<Contact[]>> {
    const response = await this.client.post(`/chat/findContacts/${instanceName}`, {});
    return response.data;
  }

  async checkIsWhatsApp(instanceName: string, data: CheckNumberDto): Promise<ApiResponse<CheckNumberResponse[]>> {
    const response = await this.client.post(`/chat/checkIsWhatsApp/${instanceName}`, data);
    return response.data;
  }

  async fetchProfilePictureUrl(
    instanceName: string,
    data: { number: string }
  ): Promise<ApiResponse<{ profilePictureUrl: string }>> {
    const response = await this.client.post(`/chat/fetchProfilePictureUrl/${instanceName}`, data);
    return response.data;
  }

  async markMessageAsRead(
    instanceName: string,
    data: { readMessages: Array<{ remoteJid: string; fromMe: boolean; id: string }> }
  ): Promise<ApiResponse> {
    const response = await this.client.put(`/chat/markMessageAsRead/${instanceName}`, data);
    return response.data;
  }

  async deleteMessage(
    instanceName: string,
    data: { key: { remoteJid: string; fromMe: boolean; id: string } }
  ): Promise<ApiResponse> {
    const response = await this.client.delete(`/chat/deleteMessageForEveryone/${instanceName}`, { data });
    return response.data;
  }

  async archiveChat(instanceName: string, data: { chat: string; archive: boolean }): Promise<ApiResponse> {
    const response = await this.client.post(`/chat/archiveChat/${instanceName}`, data);
    return response.data;
  }

  // ============= Groups =============
  async createGroup(instanceName: string, data: CreateGroupDto): Promise<ApiResponse<Group>> {
    const response = await this.client.post(`/group/create/${instanceName}`, data);
    return response.data;
  }

  async fetchAllGroups(instanceName: string, getParticipants: boolean = true): Promise<ApiResponse<Group[]>> {
    const response = await this.client.get(`/group/fetchAllGroups/${instanceName}`, {
      params: { getParticipants },
    });
    return response.data;
  }

  async findGroupByJid(instanceName: string, groupJid: string): Promise<ApiResponse<Group>> {
    const response = await this.client.get(`/group/findGroupByJid/${instanceName}`, {
      params: { groupJid },
    });
    return response.data;
  }

  async findGroupMembers(instanceName: string, groupJid: string): Promise<ApiResponse<any[]>> {
    const response = await this.client.get(`/group/findGroupMembers/${instanceName}`, {
      params: { groupJid },
    });
    return response.data;
  }

  async updateGroupSubject(
    instanceName: string,
    data: { groupJid: string; subject: string }
  ): Promise<ApiResponse> {
    const response = await this.client.post(`/group/updateGroupSubject/${instanceName}`, data);
    return response.data;
  }

  async updateGroupDescription(
    instanceName: string,
    data: { groupJid: string; description: string }
  ): Promise<ApiResponse> {
    const response = await this.client.post(`/group/updateGroupDescription/${instanceName}`, data);
    return response.data;
  }

  async updateGroupPicture(
    instanceName: string,
    data: { groupJid: string; image: string }
  ): Promise<ApiResponse> {
    const response = await this.client.post(`/group/updateGroupPicture/${instanceName}`, data);
    return response.data;
  }

  async updateGroupMembers(instanceName: string, data: UpdateGroupParticipantsDto & { groupJid: string }): Promise<ApiResponse> {
    const response = await this.client.post(`/group/updateGroupMembers/${instanceName}`, data);
    return response.data;
  }

  async sendGroupInvite(
    instanceName: string,
    data: { groupJid: string; numbers: string[]; description?: string }
  ): Promise<ApiResponse> {
    const response = await this.client.post(`/group/sendGroupInvite/${instanceName}`, data);
    return response.data;
  }

  async fetchInviteCode(instanceName: string, groupJid: string): Promise<ApiResponse<{ inviteCode: string }>> {
    const response = await this.client.get(`/group/fetchInviteCode/${instanceName}`, {
      params: { groupJid },
    });
    return response.data;
  }

  async leaveGroup(instanceName: string, groupJid: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/group/leaveGroup/${instanceName}`, {
      params: { groupJid },
    });
    return response.data;
  }

  // ============= Webhooks =============
  async setWebhook(instanceName: string, data: WebhookConfig): Promise<ApiResponse> {
    const response = await this.client.post(`/webhook/instance/${instanceName}`, data);
    return response.data;
  }

  async getWebhook(instanceName: string): Promise<ApiResponse<WebhookConfig>> {
    const response = await this.client.get(`/webhook/find/${instanceName}`);
    return response.data;
  }

  // ============= Settings =============
  async setSettings(instanceName: string, data: InstanceSettings): Promise<ApiResponse> {
    const response = await this.client.post(`/settings/instance/${instanceName}`, data);
    return response.data;
  }

  async getSettings(instanceName: string): Promise<ApiResponse<InstanceSettings>> {
    const response = await this.client.get(`/settings/find/${instanceName}`);
    return response.data;
  }
}

// Create a singleton instance
let evolutionAPI: EvolutionAPIClient;

export function getEvolutionAPI(): EvolutionAPIClient {
  if (!evolutionAPI) {
    evolutionAPI = new EvolutionAPIClient();
  }
  return evolutionAPI;
}

export default EvolutionAPIClient;
