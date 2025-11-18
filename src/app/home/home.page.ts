import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSearchbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonSearchbar,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    RouterModule
  ]
})
export class HomePage implements OnInit {
  actionMovies: any[] = [];
  romanceMovies: any[] = [];
  horrorMovies: any[] = [];

  maxMovies = 10;
  private searchTimeout: any = null;

  constructor(private tmdb: TmdbService) {}

  ngOnInit() {
    // Ação
    this.tmdb.getActionMovies().subscribe((res: any) => {
      this.actionMovies = res.results.slice(0, this.maxMovies);
    });

    // Romance
    this.tmdb.getRomanceMovies().subscribe((res: any) => {
      this.romanceMovies = res.results.slice(0, this.maxMovies);
    });

    // Terror
    this.tmdb.getHorrorMovies().subscribe((res: any) => {
      this.horrorMovies = res.results.slice(0, this.maxMovies);
    });
  }

  onSearch(event: any) {
    const value = event?.detail?.value ?? event?.target?.value ?? '';
    const query = (value || '').trim();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (!query) {
        // Se vazio → restaura APENAS filmes de ação (sessão principal)
        this.tmdb.getActionMovies().subscribe((res: any) => {
          this.actionMovies = res.results.slice(0, this.maxMovies);
        });
        return;
      }

      // Busca substitui apenas a primeira sessão
      this.tmdb.getMoviesByQuery(query).subscribe((res: any) => {
        this.actionMovies = (res.results || []).slice(0, this.maxMovies);
      });
    }, 300);
  }
}