import { NamesInterface } from './NamesInterface'

export interface SongInterface {
  id: number;
  name: NamesInterface;
  music_uri: string;
  image_uri: string;
}