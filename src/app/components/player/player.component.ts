import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { SongInterface } from '../../interfaces/SongInterface';
import { SongObj } from '../../models/SongObj';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  songObjs: SongObj[] = [];

  // Default load Welcome Horizons
  currentSong: SongObj = {
    id: 95,
    name: 'Welcome Horizons',
    music_uri: 'https://acnhapi.com/v1/music/95',
    image_uri: 'https://acnhapi.com/v1/images/songs/95'
  };

  constructor(private songService: SongsService) { }

  ngOnInit(): void {
    this.getAllSongs();
  }

  private getAllSongs = () => this.songService.getAllSongs().subscribe({
    error: (_) => console.log('Error fetching all song information', _),
    next: (data: Object) => this.extractSongs(data)
  });
  
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
