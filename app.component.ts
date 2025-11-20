import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.configureStatusBar();
  }

  async configureStatusBar() {
    await StatusBar.setOverlaysWebView({ overlay: false });

    await StatusBar.setStyle({
      style: Style.Dark,
    });
  }
}
