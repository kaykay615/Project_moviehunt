import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.page.html',
  styleUrls: ['./genre.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
  ]
})
export class GenrePage implements OnInit {

  genreId!: number;
  movies: any[] = [];
  genreName = '';

  // paginação dinâmica
  currentPage = 1;
  totalPages = 1;  // será substituído pelo valor real da API

  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService
  ) {}

  ngOnInit() {
    this.genreId = Number(this.route.snapshot.paramMap.get('id'));
    this.setGenreName();
    this.loadMovies(1);
  }

  loadMovies(page: number) {
    this.tmdb.getMoviesByGenre(this.genreId, page).subscribe((res: any) => {
      this.movies = res.results;

      // aqui pegamos o TOTAL REAL de páginas da API
      this.totalPages = res.total_pages;

      this.currentPage = page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadMovies(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadMovies(this.currentPage - 1);
    }
  }

  setGenreName() {
    const names: any = {
      28: 'Ação',
      27: 'Terror',
      10749: 'Romance'
    };
    this.genreName = names[this.genreId] || 'Filmes';
  }

}
