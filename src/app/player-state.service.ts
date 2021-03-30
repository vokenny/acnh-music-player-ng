import { Injectable } from '@angular/core';
import { SongObj, SongsService } from './songs.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {

  constructor(private songsService: SongsService) { }

  init = () => {
    this.songsService.getAllSongs();
  }

  songs: SongObj[] = this.songsService.songObjs;

  currentSong = {
    id: 95,
    name: 'Welcome Horizons',
    music_uri: '',
    image_uri: 'https://acnhapi.com/v1/images/songs/95'
  };
}
