import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../services/places';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTabBar, 
  IonTabButton,
} from '@ionic/angular/standalone';
import { TmdbService } from '../services/tmdb.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-movie-details',
  templateUrl: 'movie-details.page.html',
  styleUrls: ['movie-details.page.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel, 
    IonTabBar, 
    IonTabButton,
  ],
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;
  stars: number[] = [];
  providers: { type: string; providers: any[] }[] = [];
  isFavorite = false;

  constructor(private route: ActivatedRoute, private tmdb: TmdbService, private places: PlacesService) {}

async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.tmdb.getMovieDetails(id).subscribe((res: any) => {
        this.movie = res;
        const starCount = Math.round((this.movie.vote_average || 0) / 2);
        this.stars = Array.from({ length: starCount });
      });
    }

    // Agora pede permissão antes de buscar cinemas
    await this.pedirPermissaoLocalizacao();
  }

  async pedirPermissaoLocalizacao() {
    try {
      console.log("🟡 Solicitando permissão de localização...");

      const perm = await Geolocation.requestPermissions();

      console.log("🔵 Permissão retornada:", perm);

      if (perm.location === "granted") {
        console.log("🟢 Permissão concedida. Buscando cinemas...");
        this.carregarCinemas();
      } else {
        console.warn("🔴 Permissão negada pelo usuário.");
      }

    } catch (e) {
      console.error("❌ Erro ao pedir permissão:", e);
    }
  }

    async carregarCinemas() {
    try {
      console.log("🔵 Pegando posição atual...");

      const pos = await Geolocation.getCurrentPosition();

      console.log("📍 Localização recebida:", pos);

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      this.places.buscarCinemas(lat, lng).subscribe((resp: any) => {
        console.log("🎬 Cinemas encontrados:", resp);
        this.cinemas = resp?.places || [];
      });

    } catch (e) {
      console.error("❌ Erro ao buscar cinemas:", e);
    }
  }

  abrirNoGoogleMaps(cinema: any) {
    const lat = cinema.location.latitude;
    const lng = cinema.location.longitude;

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  }


  getRating(): string {
    if (!this.movie || this.movie.vote_average == null) return '0.0';
    // format to one decimal place, e.g. 7.7
    return Number(this.movie.vote_average).toFixed(1);
  }

  private extractProviders() {
    this.providers = [];
    if (!this.movie) return;

    // TMDB returns providers in movie['watch/providers'].results with country codes
    const results = this.movie['watch/providers']?.results || {};

    // Prefer BR entry, then US, then first available
    const preferredCountries = ['BR', 'US'];
    let countryEntry: any = null;
    for (const c of preferredCountries) {
      if (results[c]) {
        countryEntry = results[c];
        break;
      }
    }
    if (!countryEntry) {
      const keys = Object.keys(results);
      if (keys.length) countryEntry = results[keys[0]];
    }

    if (!countryEntry) return;

    const mapAndPush = (type: string, list: any[]) => {
      if (!list || !Array.isArray(list) || list.length === 0) return;
      const items = list.map(p => ({ provider_name: p.provider_name, logo_path: p.logo_path }));
      this.providers.push({ type, providers: items });
    };

    // types: flatrate (streaming), rent, buy
    mapAndPush('Streaming', countryEntry.flatrate || countryEntry['flatrate']);
    mapAndPush('Aluguel', countryEntry.rent || countryEntry['rent']);
    mapAndPush('Compra', countryEntry.buy || countryEntry['buy']);
  }

  hasAnyProvider(): boolean {
    return this.providers && this.providers.length > 0;
  }

  private favoritesKey = 'moviehunt_favorites';

  private loadFavoriteState() {
    const list = this.getFavoritesList();
    this.isFavorite = !!list.find((m: any) => m.id === this.movie?.id);
  }

  toggleFavorite() {
    if (!this.movie) return;
    const list = this.getFavoritesList();
    const exists = list.find((m: any) => m.id === this.movie.id);
    if (exists) {
      const newList = list.filter((m: any) => m.id !== this.movie.id);
      this.saveFavoritesList(newList);
      this.isFavorite = false;
    } else {
      // store minimal movie info
      const toSave = {
        id: this.movie.id,
        title: this.movie.title,
        poster_path: this.movie.poster_path,
        vote_average: this.movie.vote_average,
        release_date: this.movie.release_date
      };
      list.unshift(toSave);
      this.saveFavoritesList(list);
      this.isFavorite = true;
    }
  }

  private getFavoritesList(): any[] {
    try {
      const raw = localStorage.getItem(this.favoritesKey);
      if (!raw) return [];
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  private saveFavoritesList(list: any[]) {
    try {
      localStorage.setItem(this.favoritesKey, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }

  getYear() {
    return this.movie?.release_date ? this.movie.release_date.split('-')[0] : '';
  }

  getDirector() {
    return this.movie?.credits?.crew?.find((c: any) => c.job === 'Director')?.name || '';
  }

  getMainCast() {
    return this.movie?.credits?.cast?.slice(0, 3) || [];
  }

  getProduction() {
    return this.movie?.production_companies?.[0]?.name || '';
  }

  getRuntime() {
    return this.movie?.runtime ? `${this.movie.runtime} min` : '';
  }

cinemas: any[] = [];


}

