import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  // https://acnhapi.com/doc
  baseUrl: string = 'https://acnhapi.com/v1';

  constructor(private http: HttpClient) { }

  getAllSongs = () => {
    return this.http.get(this.baseUrl + '/songs')
  }
}
