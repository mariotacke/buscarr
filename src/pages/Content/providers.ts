import { hostname as imdbHostname, provider as imdbProvider } from './www.imdb.com';
import { hostname as rottenTomatoesHostname, provider as rottenTomatoesProvider } from './www.rottentomatoes.com';

export interface MediaInformation {
  title: string,
  alternateTitles?: string[],
  year?: number | undefined,
}

export type Provider = () => MediaInformation | null;

export const providers: { [key: string]: Provider | null}  = {
  [imdbHostname]: imdbProvider,
  [rottenTomatoesHostname]: rottenTomatoesProvider,
};

export default providers;