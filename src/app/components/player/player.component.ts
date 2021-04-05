import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { SongObj } from '../../models/SongObj';
import { AudioService } from '../../services/audio/audio.service';
import { AudioState } from '../../models/AudioState';
import { Subscription } from 'rxjs';
import { formatTime } from './time-format';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private songsService: SongsService, private audio: AudioService) { }

  ngOnInit(): void {
    this.getAllSongs();
  }

  private getAllSongs = (): Subscription => this.songsService.getAllSongs().subscribe({
    error: (_) => console.log('Error fetching all song information', _),
    next: (data: Object) => {
      this.songsService.extractSongs(data);
      this.setDefaultSong();
      this.audio.setSong(this.currentSong);
      this.stopUpdatingSongDuration = setInterval(this.updateSongDuration, 100);
    }
  });

  private numOfAllSongs = () => this.songsService.songObjs.length;

  /*
   * Play/Pause/Next/Prev control logic
   */
  getAudioState = (): AudioState => this.audio.audioState;

  // Default load Welcome Horizons
  currentSong: SongObj = {
    id: 95,
    name: 'Welcome Horizons',
    music_uri: 'https://acnhapi.com/v1/music/95',
    image_uri: 'https://acnhapi.com/v1/images/songs/95'
  };
  
  songObjs = (): SongObj[] => this.songsService.songObjs;

  setDefaultSong = (): void => {
    const welcomeHorizonsSong: SongObj | undefined = this.songsService.songObjs.find(song => song.name === 'Welcome Horizons');

    welcomeHorizonsSong ? this.currentSong = welcomeHorizonsSong : null;
  }

  private stopPollingEndState: any = null;

  private pollEndState = (): void  => {
    this.getAudioState().ended ? this.nextSong() : null;    
  }

  play = (): void => {
    this.audio.play();
    this.stopUpdatingSongTime = setInterval(this.updateSongTime, 200);
    this.stopUpdatingSongDuration = setInterval(this.updateSongDuration, 100);
    this.audio.audioState.isPlaying = true;

    // Only create a poll for end state if there isn't one already
    this.stopPollingEndState === null ? this.stopPollingEndState = setInterval(this.pollEndState, 200) : null;
  }

  pause = (): void => {
    this.audio.pause();
    this.audio.audioState.isPlaying = false;

    // Stop polling for end state to change to next song
    clearInterval(this.stopPollingEndState);
    this.stopPollingEndState = null;    
  }

  selectSong = (newSong: SongObj): void => {
    this.audio.setSong(newSong);
    this.resetSongInfo();
  }

  prevSong = (): void => {
    const prevSong: SongObj = this.getPrevSong();

    this.currentSong = prevSong;
    this.audio.setSong(prevSong);
    this.resetSongInfo();
  }

  nextSong = (): void => {
    if (this.getAudioState().loopMode) {
      this.audio.resetEndState();
      this.audio.play();
    }
    else {
      const nextSong: SongObj = this.getNextSong();

      this.currentSong = nextSong;
      this.audio.setSong(nextSong);
    }

    this.resetSongInfo();
  }

  private getPrevSong = (): SongObj => {
    const idxOfCurrSong: number = this.songsService.songObjs.findIndex(song => song.name === this.currentSong.name);
    const idxOfPrevSong: number = idxOfCurrSong === 0 ? this.numOfAllSongs() - 1 : idxOfCurrSong - 1;
    
    return this.songsService.songObjs[idxOfPrevSong];
  }

  private getNextSong = (): SongObj => {
    const idxOfCurrSong: number = this.songsService.songObjs.indexOf(this.currentSong);
    const idxOfNextSong: number = idxOfCurrSong === this.numOfAllSongs() - 1 ? 0 : idxOfCurrSong + 1;

    return this.songsService.songObjs[idxOfNextSong];
  }

  /*
   * Song shuffle logic
   */
  private shuffle = (arr: SongObj[]): void => {
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  toggleShuffle = (): void => {
    // Disable looping over one song if shuffling
    this.getAudioState().loopMode ? this.toggleLoop() : null;

    // Change shuffle mode first
    this.audio.toggleShuffle();

    // Randomise or reorder based on new shuffle mode
    this.getAudioState().shuffleMode ? this.shuffle(this.songsService.songObjs) : this.sort(this.songsService.songObjs);
  }

  private sort = (arr: SongObj[]): SongObj[] => arr.sort((s1, s2) => s1.id - s2.id);

  /*
   * Loop single song logic
   */
  toggleLoop = (): void => {
    // Disable shuffling if looping over one song
    this.getAudioState().shuffleMode ? this.toggleShuffle() : null;

    this.audio.toggleLoop();
  }

  /*
   * Volume slider control logic
   */
  volume: number | null = 100;
  showVolSlider = false;

  setVolume = (event: any) => {
    this.volume = event.value;
    this.audio.setVolume(event.value);
  } 

  toggleVolSlider = () => this.showVolSlider = !this.showVolSlider;

  /*
   * Song playback control logic
   */
  playbackLabel = (value: number): string => formatTime(Math.round(value));

  songTime: number = 0;
  songTimeLabel: string = '0:00';
  songDuration: number = 0;
  songDurationLabel: string = '0:00';

  private resetSongInfo = (): void => {
    this.songTime = 0;
    this.songTimeLabel = '0:00';
    this.stopUpdatingSongDuration = setInterval(this.updateSongDuration, 200);
  }

  setSongTime = (event: any): void => this.audio.setCurrentTime(event.value);

  private stopUpdatingSongTime: any = null; 
  private stopUpdatingSongDuration: any = null;

  private updateSongTime = (): void => {
    // Updates song time only when audio is playing
    if (!this.getAudioState().isPlaying) {
      clearInterval(this.stopUpdatingSongTime);
    }
    else {
      const currTime: number = Math.round(this.audio.getCurrentTime());
      this.songTime = currTime;
      this.songTimeLabel = formatTime(currTime);  
    }
  }

  private updateSongDuration = (): void => {
    const duration: number = this.audio.getDuration();    

    // Stops polling for song duration data as soon as it finds it
    if (typeof duration === 'number' && duration > 0) {
      clearInterval(this.stopUpdatingSongDuration);      
      
      const roundedDur: number = Math.round(duration);
      this.songDuration = roundedDur;
      this.songDurationLabel = formatTime(roundedDur);
    }
  }
}
