import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private apiUrl = 'https://proxy-1-ivog.onrender.com/google/places';

  constructor(private http: HttpClient) {}

  getNearbyCinemas(lat: number, lng: number) {
    const url = `${this.apiUrl}?lat=${lat}&lng=${lng}`;
    return this.http.get(url);
  }
}
