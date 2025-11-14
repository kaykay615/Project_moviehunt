import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
} from '@ionic/angular/standalone';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: 'movie-details.page.html',
  styleUrls: ['movie-details.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;
  stars: number[] = [];

  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tmdb.getMovieDetails(id).subscribe((res: any) => {
        this.movie = res;
        const starCount = Math.round((this.movie.vote_average || 0) / 2);
        this.stars = Array.from({ length: starCount });
      });
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
}
