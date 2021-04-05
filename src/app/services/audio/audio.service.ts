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
    shuffleMode: false,
    loopMode: false,
    ended: false
  }

  private stopPollingEndState: any = null;

  private pollEndState = () => {
    this.audioObj.ended ? this.audioState.ended = true : null;    
  }

  setSong = (newSong: SongObj) => {
    this.audioObj.src = newSong.music_uri;
    this.audioState.isPlaying ? this.play() : null;
    this.resetEndState();
  }

  resetEndState = () => this.audioState.ended = false;

  play = (): void => {
    this.audioObj.play();

    // Only create a poll for end state if there isn't one already
    this.stopPollingEndState === null ? this.stopPollingEndState = setInterval(this.pollEndState, 2000) : null;
  }

  pause = (): void => {
    this.audioObj.pause();

    // Stop polling for end state to update this.audioState.ended
    clearInterval(this.stopPollingEndState);
    this.stopPollingEndState = null;
  }

  toggleShuffle = (): boolean => this.audioState.shuffleMode = !this.audioState.shuffleMode;

  toggleLoop = (): boolean => this.audioState.loopMode = !this.audioState.loopMode;

  setVolume = (vol: any): void => {
    typeof vol === 'number' && vol >= 0 && vol <= 100 ? this.audioObj.volume = vol / 100 : null;
  }

  getDuration = (): number => this.audioObj.duration;

  getCurrentTime = (): number => this.audioObj.currentTime;

  setCurrentTime = (time: any): void => {
    typeof time === 'number' && time >= 0 ? this.audioObj.currentTime = time : null;
  }
}
