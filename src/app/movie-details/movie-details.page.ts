import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';

import { TmdbService } from '../services/tmdb.service';
import { PlacesService } from '../services/places';
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
    IonTabs,
    IonTabBar,
    IonTabButton,
  ],
})
export class MovieDetailsPage implements OnInit {

  movie: any = null;
  stars: number[] = [];
  cinemas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService,
    private places: PlacesService
  ) {}

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

  // ---------------------------
  // PEDIR PERMISSÃO DE LOCALIZAÇÃO
  // ---------------------------
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

  // ---------------------------
  // PEGAR LOCALIZAÇÃO + CINEMAS
  // ---------------------------
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

  // ---------------------------
  // ABRIR NO GOOGLE MAPS
  // ---------------------------
  abrirNoGoogleMaps(cinema: any) {
    const lat = cinema.location.latitude;
    const lng = cinema.location.longitude;

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  }

  // ---------------------------
  // FUNÇÕES DO MOVIE
  // ---------------------------
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
}
