import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    public nav: NavController,
    public router: Router
  ) { }

  public goToNavigateForword(path: any, data: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: data
    };
    this.nav.navigateForward(path, navigationExtras);
  }

  public goToRoot(page: any) {
    this.nav.navigateRoot(page, { replaceUrl: true });
  }

  public navigateWithRoute(path: any) {
    this.router.navigate([path]);
  }

  public gotopageExtras(path: string, extraParams: any) {
    let navigationExtras: NavigationExtras = {
      state: extraParams
    }
    this.router.navigate([path], navigationExtras);
  }
}