import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = 'dfc441ae42821d9b9f4146f0a4d06a11';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // Filmes de Ação (28)
  getActionMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=28&language=pt-BR`);
  }

  // Filmes de Romance (10749)
  getRomanceMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=10749&language=pt-BR`);
  }

  // Filmes de Terror (27)
  getHorrorMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=27&language=pt-BR`);
  }

  // Buscar detalhes do filme
  getMovieDetails(movieId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR&append_to_response=credits`
    );
  }

  // Busca por nome
  getMoviesByQuery(query: string): Observable<any> {
    const q = encodeURIComponent(query);
    return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${q}`);
  }

getMoviesByGenre(genreId: number, page: number = 1): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&page=${page}&language=pt-BR`
  );
}




}
