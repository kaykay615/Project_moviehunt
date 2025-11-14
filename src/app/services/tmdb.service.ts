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

  // Buscar filmes de ação (genre_id = 28)
  getActionMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=28&language=pt-BR`);
  }

  // Buscar detalhes do filme (inclui créditos)
  getMovieDetails(movieId: number): Observable<any> {
    // append_to_response=credits traz elenco e equipe junto
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=pt-BR&append_to_response=credits`
    );
  }

  // Buscar filmes por query (nome)
  getMoviesByQuery(query: string): Observable<any> {
    const q = encodeURIComponent(query);
    return this.http.get(`${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${q}`);
  }
}
