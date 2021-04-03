import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs/songs.service';
import { SongInterface } from '../../interfaces/SongInterface';
import { SongObj } from '../../models/SongObj';
import { AudioService } from '../../services/audio/audio.service';
import { AudioState } from '../../models/AudioState';
import { Subscription } from 'rxjs';

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

  songObjs: SongObj[] = [];

  // Default load Welcome Horizons
  currentSong: SongObj = {
    id: 95,
    name: 'Welcome Horizons',
    music_uri: 'https://acnhapi.com/v1/music/95',
    image_uri: 'https://acnhapi.com/v1/images/songs/95'
  };

  private getAllSongs = (): Subscription => this.songsService.getAllSongs().subscribe({
    error: (_) => console.log('Error fetching all song information', _),
    next: (data: Object) => {
      this.extractSongs(data);
      this.setDefaultSong();
      this.audio.setSong(this.currentSong);
    }
  });
  
  private extractSongs = (songs: Object): void => {
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

  private setDefaultSong = (): void => {
    const welcomeHorizonsSong: SongObj | undefined = this.songObjs.find(song => song.name === 'Welcome Horizons');

    welcomeHorizonsSong ? this.currentSong = welcomeHorizonsSong : null;
  }

  private numOfAllSongs = () => this.songObjs.length;

  /*
   * Play/Pause/Next/Prev control logic
   */
  getAudioState = (): AudioState => this.audio.audioState;

  play = (): void => {
    this.audio.play();
    this.audio.audioState.isPlaying = true;
  }

  pause = (): void => {
    this.audio.pause();
    this.audio.audioState.isPlaying = false;
  }

  selectSong = (newSong: SongObj): void => this.audio.setSong(newSong);

  prevSong = (): void => {
    const prevSong: SongObj = this.getPrevSong();

    this.currentSong = prevSong;
    this.audio.setSong(prevSong);
  }

  nextSong = (): void => {
    const nextSong: SongObj = this.getNextSong();

    this.currentSong = nextSong;
    this.audio.setSong(nextSong);
  }

  private getPrevSong = (): SongObj => {
    const idxOfCurrSong: number = this.songObjs.findIndex(song => song.name === this.currentSong.name);
    const idxOfPrevSong: number = idxOfCurrSong === 0 ? this.numOfAllSongs() - 1 : idxOfCurrSong - 1;
    
    return this.songObjs[idxOfPrevSong];
  }

  private getNextSong = (): SongObj => {
    const idxOfCurrSong: number = this.songObjs.indexOf(this.currentSong);
    const idxOfNextSong: number = idxOfCurrSong === this.numOfAllSongs() - 1 ? 0 : idxOfCurrSong + 1;

    return this.songObjs[idxOfNextSong];
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
    // Change shuffle mode first
    this.audio.toggleShuffle();

    // Randomise or reorder based on new shuffle mode
    this.getAudioState().shuffleMode ? this.shuffle(this.songObjs) : this.sort(this.songObjs);
  }

  private sort = (arr: SongObj[]): SongObj[] => arr.sort((s1, s2) => s1.id - s2.id);

  /*
   * Volume Slider control logic
   */
  volume: number | null = 100;
  showVolSlider = false;

  setVolume = (event: any) => {
    this.volume = event.value;
    this.audio.setVolume(event.value);
  } 

  toggleVolSlider = () => this.showVolSlider = !this.showVolSlider;
}
