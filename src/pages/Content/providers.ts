import { hostname as rottenTomatoesHostname, provider as rottenTomatoesProvider } from './www.rottentomatoes.com';

export interface MediaInformation {
  title: string,
  alternateTitles?: string[],
  year?: number | null,
}

export type Provider = () => MediaInformation | null;

export const providers: { [key: string]: Provider | null}  = {
  [rottenTomatoesHostname]: rottenTomatoesProvider,
};

export default providers;