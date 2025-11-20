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
  IonTabs, 
  IonTabBar, 
  IonTabButton,
} from '@ionic/angular/standalone';
import { TmdbService } from '../services/tmdb.service';
import { Capacitor } from '@capacitor/core';
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

  constructor(private route: ActivatedRoute, private tmdb: TmdbService, private placesService: PlacesService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tmdb.getMovieDetails(id).subscribe((res: any) => {
        this.movie = res;
        const starCount = Math.round((this.movie.vote_average || 0) / 2);
        this.stars = Array.from({ length: starCount });
      });
    }
    this.pegarLocalizacao();
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

async pegarLocalizacao() {
  try {
    let lat: number;
    let lng: number;

    // ✔ 1. Solicitar permissão ANTES de pegar a localização
    if (Capacitor.isNativePlatform()) {
      const perm = await Geolocation.requestPermissions();

      // Se o usuário negar, para aqui
      if (perm.location !== 'granted') {
        console.warn('Permissão de localização negada');
        return;
      }
    }

    // 📱 ✔ 2. Obter localização no APP
    if (Capacitor.isNativePlatform()) {
      const pos = await Geolocation.getCurrentPosition();
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;

    } else {
      // 💻 ✔ 3. Obter localização no NAVEGADOR
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            resolve();
          },
          (err) => reject(err)
        );
      });
    }

    // 🔍 ✔ 4. Buscar cinemas no proxy Render
    this.placesService.getNearbyCinemas(lat!, lng!)
      .subscribe((res: any) => {
        this.cinemas = res.results.slice(0, 3);
      });

  } catch (error) {
    console.error('Erro ao pegar localização:', error);
  }
}



abrirNoGoogleMaps(cinema: any) {
  const lat = cinema.geometry.location.lat;
  const lng = cinema.geometry.location.lng;

  const url = `https://www.google.com/maps?q=${lat},${lng}`;

  window.open(url, "_blank");
}
}

