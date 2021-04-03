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
    isPlaying: false,
    shuffleMode: false
  }

  setSong = (newSong: SongObj) => {
    this.audioObj.src = newSong.music_uri;
    this.audioState.isPlaying ? this.audioObj.play() : null;
  }

  play = (): Promise<void> => this.audioObj.play();

  pause = (): void => this.audioObj.pause();

  toggleShuffle = (): boolean => this.audioState.shuffleMode = !this.audioState.shuffleMode;

  setVolume = (vol: any): void => {
    typeof vol === 'number' && vol >= 0 && vol <= 100 ? this.audioObj.volume = vol / 100 : null;
  }

  getDuration = (): number => this.audioObj.duration;

  getCurrentTime = (): number => this.audioObj.currentTime;

  setCurrentTime = (time: any): void => {
    typeof time === 'number' && time >= 0 ? this.audioObj.currentTime = time : null;
  }
}
