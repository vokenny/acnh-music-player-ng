import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface NamesInterface {
  'name-EUen': string
}

interface SongInterface {
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

  songObjs: SongObj[] = [];

  getAllSongs = (): Subscription => {
    return this.http.get(this.baseUrl + '/songs').subscribe({
      error: (_) => console.log('Error fetching all song information', _),
      next: (data: Object) => this.extractSongs(data)
    });
  }

  private extractSongs = (songs: Object): void => {
    this.songObjs = Object.entries(songs).map(song => {
      const [_, songMetaData] = song;

      // SongInterface lets us select keys on the object
      // Return type of SongObj instead of SongInterface means
      // we only need to save the information we specify, and not the whole object
      const songI: SongInterface = songMetaData as SongInterface;
      return {
        id: songI.id,
        name: songI.name['name-EUen'],
        music_uri: songI.music_uri,
        image_uri: songI.image_uri
      }
    })    
  }
}
