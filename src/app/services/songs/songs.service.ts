import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SongObj } from '../../models/SongObj';
import { SongInterface } from '../../interfaces/SongInterface';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  // https://acnhapi.com/doc
  baseUrl: string = 'https://acnhapi.com/v1';

  songObjs: SongObj[] = [];

  constructor(private http: HttpClient) { }

  getAllSongs = () => {
    return this.http.get(this.baseUrl + '/songs')
  }

  extractSongs = (songs: Object): void => {
    this.songObjs = Object.entries(songs).map(song => {
      const [_, songMetaData] = song;

      // SongInterface lets us select keys on the object.
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
