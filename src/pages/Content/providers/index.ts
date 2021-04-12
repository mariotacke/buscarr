import { hostname as trakt, provider as traktProvider } from './trakt.tv';
import { hostname as imdb, provider as imdbProvider } from './www.imdb.com';
import { hostname as rottenTomatoes, provider as rottenTomatoesProvider } from './www.rottentomatoes.com';
import { hostname as theMovieDb, provider as theMovieDbProvider } from './www.themoviedb.org';

export interface MediaInformation {
  title: string,
  alternateTitles?: string[],
  year?: number | undefined,
}

export type Provider = () => MediaInformation | null;

export const providers: { [key: string]: Provider | null}  = {
  [imdb]: imdbProvider,
  [rottenTomatoes]: rottenTomatoesProvider,
  [theMovieDb]: theMovieDbProvider,
  [trakt]: traktProvider,
};

export default providers;