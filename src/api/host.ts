import type {RequestParams} from '@jetbrains/ring-ui-built/components/http/http';

export interface HostAPI {
  fetchYouTrack: <T = unknown>(relativeURL: string, requestParams?: RequestParams) => Promise<T>;
  fetchApp: <T = unknown>(relativeURL: string, requestParams?: RequestParams & {scope?: boolean}) => Promise<T>;
}
