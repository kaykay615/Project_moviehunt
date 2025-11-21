import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { addIcons } from 'ionicons';
import { home, search, person, bookmark, informationCircleOutline } from 'ionicons/icons';

// 🔥 Importa o environment
import { environment } from './environments/environment';

// 🔥 Firebase
import { initializeApp } from 'firebase/app';

// Inicializa Firebase com o environment
initializeApp(environment.firebaseConfig);

addIcons({ home, search, person, bookmark, informationCircleOutline });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
