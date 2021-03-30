import { Component, OnInit } from '@angular/core';
import { PlayerStateService } from '../player-state.service';
import { SongObj, SongsService } from '../songs.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private player: PlayerStateService) { }

  ngOnInit(): void {
    this.player.init();
  }

  songs: SongObj[] = this.player.songs;

  currentSong: SongObj = this.player.currentSong;
}
