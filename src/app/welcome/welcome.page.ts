import { Component } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone:false
})
export class WelcomePage {

  constructor(private Navigation: NavigationService
  ) { }


  goToLogin() {
    this.Navigation.navigateWithRoute('/login');
  }

  goToSignup() {
    this.Navigation.navigateWithRoute('/signup');
  }

}
