import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {

  constructor(
    public Navigation: NavigationService,
    public StorageService: StorageService
  ) { }

  logout() {
    this.StorageService.remove('login');
    this.Navigation.navigateWithRoute('/login');
    console.log("Logout clicked");
  }

  goToSaved() {
    this.Navigation.navigateWithRoute('/saved-lists');
  }
}
