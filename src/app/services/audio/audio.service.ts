import { Injectable } from '@angular/core';
import { SongObj } from 'src/app/models/SongObj';
import { AudioState } from '../../models/AudioState';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  audioObj: HTMLAudioElement = new Audio();

  audioState: AudioState = {
    isPlaying: false
  }

  setSong = (newSong: SongObj) => {
    this.audioObj.src = newSong.music_uri;
    this.audioState.isPlaying ? this.audioObj.play() : null;
  }

  play = () => this.audioObj.play();

  pause = () => this.audioObj.pause();
}
