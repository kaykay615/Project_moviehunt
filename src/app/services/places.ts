import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlacesService {

  private readonly API_KEY = 'AIzaSyBUJcWNUw850vwvLKCSB-f0SO2pkbLYAmw';

  constructor(private http: HttpClient) {}

  buscarCinemas(lat: number, lng: number) {
    const url = 'https://places.googleapis.com/v1/places:searchNearby';

    const body = {
      includedTypes: ["movie_theater"],
      maxResultCount: 3,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 6000.0
        }
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location'
    });

    return this.http.post(url, body, { headers });
  }
}
