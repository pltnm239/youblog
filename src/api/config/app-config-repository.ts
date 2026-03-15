import type {HostAPI} from '../host';
import type {BlogConfig} from '../types';
import type {ConfigRepository} from './config-repository';

interface SettingsResponse {
  project: {
    id: string;
    name: string;
    shortName: string;
  } | null;
  error?: string;
}

export class AppConfigRepository implements ConfigRepository {
  private readonly host: HostAPI;

  constructor(host: HostAPI) {
    this.host = host;
  }

  async getConfig(): Promise<BlogConfig | null> {
    const response = await this.host.fetchApp<SettingsResponse>(
      'backend/settings',
      {scope: false}
    );

    if (!response.project) {
      return null;
    }

    return {
      projectId: response.project.id,
      projectName: response.project.name,
      projectShortName: response.project.shortName,
    };
  }
}
