import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSearchbar,
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
  comedyMovies: any[] = [];
  ficMovies: any[] = [];
  dramaMovies: any[] = []; 
  aniMovies: any[] = [];
  avenMovies: any[] = [];
  nowPlayingMovies: any[] = [];


  // Controle da busca
  searchActive = false;
  searchResults: any[] = [];
  searchQuery = '';
  currentSearchPage = 1;
  totalSearchPages = 1;

  private searchTimeout: any = null;

  constructor(private tmdb: TmdbService) {}

  ngOnInit() {
    this.loadMainSections();
  }

  loadMainSections() {
    this.tmdb.getActionMovies().subscribe((res: any) => {
      this.actionMovies = res.results.slice(0, 20);
    });

    this.tmdb.getRomanceMovies().subscribe((res: any) => {
      this.romanceMovies = res.results.slice(0, 20);
    });

    this.tmdb.getHorrorMovies().subscribe((res: any) => {
      this.horrorMovies = res.results.slice(0, 20);
    });

    this.tmdb.getComedyMovies().subscribe((res: any) => {
      this.comedyMovies = res.results.slice(0, 20);
    });

    this.tmdb.getFicMovies().subscribe((res: any) => {
      this.ficMovies = res.results.slice(0, 20);
    });

    this.tmdb.getDramaMovies().subscribe((res: any) => {
      this.dramaMovies = res.results.slice(0, 20);
    });

    this.tmdb.getAniMovies().subscribe((res: any) => {
      this.aniMovies = res.results.slice(0, 20);
    });

    this.tmdb.getAvenMovies().subscribe((res: any) => {
      this.avenMovies = res.results.slice(0, 20);
    });

    this.tmdb.getNowPlayingMovies().subscribe((res: any) => {
    this.nowPlayingMovies = res.results.slice(0, 20);
    });


  }

  onSearch(event: any) {
    const value = event?.detail?.value ?? '';
    const query = value.trim();

    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      if (!query) {
        this.searchActive = false;
        this.searchResults = [];
        return;
      }

      this.searchActive = true;
      this.searchQuery = query;
      this.loadSearchResults(1);

    }, 300);
  }

  loadSearchResults(page: number) {
    this.tmdb.getMoviesByQuery(this.searchQuery, page).subscribe((res: any) => {
      this.searchResults = res.results;
      this.currentSearchPage = page;
      this.totalSearchPages = res.total_pages;
    });
  }

  nextSearchPage() {
    if (this.currentSearchPage < this.totalSearchPages) {
      this.loadSearchResults(this.currentSearchPage + 1);
    }
  }

  previousSearchPage() {
    if (this.currentSearchPage > 1) {
      this.loadSearchResults(this.currentSearchPage - 1);
    }
  }

}
