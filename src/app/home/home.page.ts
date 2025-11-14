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
  maxMovies = 10; // <-- limite de filmes que serão exibidos
    private searchTimeout: any = null;

  constructor(private tmdb: TmdbService) {}

  ngOnInit() {
    this.tmdb.getActionMovies().subscribe((res: any) => {
      console.log('📽️ Filmes de ação recebidos:', res);
      // Limita a quantidade de filmes exibidos
      this.actionMovies = res.results.slice(0, this.maxMovies);
    });
  }

  onSearch(event: any) {
    const value = event?.detail?.value ?? event?.target?.value ?? '';
    const query = (value || '').trim();

    // debounce rápido para evitar muitas requisições
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (!query) {
        // se vazio, volta para os filmes de ação
        this.tmdb.getActionMovies().subscribe((res: any) => {
          this.actionMovies = res.results.slice(0, this.maxMovies);
        });
        return;
      }

      this.tmdb.getMoviesByQuery(query).subscribe((res: any) => {
        this.actionMovies = (res.results || []).slice(0, this.maxMovies);
      });
    }, 300);
  }
}
