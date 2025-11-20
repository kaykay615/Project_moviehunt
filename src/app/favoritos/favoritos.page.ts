import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonBackButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-favoritos',
  templateUrl: 'favoritos.page.html',
  styleUrls: ['favoritos.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonBackButton,
    IonButtons,
  ],
})
export class FavoritosPage implements OnInit {
  favorites: any[] = [];
  private favoritesKey = 'moviehunt_favorites';

  ngOnInit() {
    this.loadFavorites();
  }

  ionViewWillEnter() {
    // refresh when the page becomes active
    this.loadFavorites();
  }

  private loadFavorites() {
    try {
      const raw = localStorage.getItem(this.favoritesKey);
      this.favorites = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.favorites = [];
    }
  }

  removeFavorite(id: number) {
    this.favorites = this.favorites.filter((f) => f.id !== id);
    try {
      localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
    } catch {}
  }
}
