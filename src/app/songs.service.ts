import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface NamesInterface {
  'name-EUen': string
}

export interface SongInterface {
  id: number,
  name: NamesInterface
  music_uri: string
  image_uri: string
}

export type SongObj = {
  id: number,
  name: string,
  music_uri: string,
  image_uri: string
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  // https://acnhapi.com/doc
  baseUrl: string = 'https://acnhapi.com/v1';

  constructor(private http: HttpClient) { }

  getAllSongs = () => {
    return this.http.get(this.baseUrl + '/songs')
  }
}
