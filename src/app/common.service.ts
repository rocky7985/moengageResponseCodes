import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private isMenuEnabled = new Subject<boolean>();
  baseUrl = 'http://localhost/moengage/'; // Live WordPress site URL
  url = 'http://localhost/moengage/wp-json/addapi/v1/'; // API endpoint for your WordPress backend
  private loader!: HTMLIonLoadingElement;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,

  ) { }

  setMenuState(enabled: boolean): void {
    this.isMenuEnabled.next(enabled);
  }

  // Method for get the Menu State
  getMenuState(): Subject<boolean> {
    return this.isMenuEnabled;
  }

  loginUrl(data: any) {
    return this.http.post(this.baseUrl + 'wp-json/jwt-auth/v1/token', data);
  }

  post(endpoint: any, data: any) {
    return this.http.post(this.url + endpoint, data);
  }

  sendData(endPoint: any, data: any, token?: any) {
    let headers = {};
    if (token) {
      headers = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      };
    }
    return this.http.post(this.url + endPoint, data, { headers }).pipe(map((result) => result));
  }

  checkUser(): boolean {

    const userData = localStorage.getItem('login');

    if (userData) {
      return true; // Data is available, allow navigation
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      this.presentToast('Not Authenticated');
      return false; // Prevent navigation
    }
  }



  async showLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 0,
      spinner: 'circles',
    });

    await this.loader.present();
  }

  async hideLoader() {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }

  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  canActivate(route: any, state: any): boolean {
    return this.checkUser();
  }

  async presentAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  async getSavedLists() {
    const loginData = await this.storageService.get('login');
    const token = loginData?.data?.token;
    return this.http.post<any>(this.url + 'get_saved_lists', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async presentAlertWithInput(header: string, message: string, inputs: any[], buttons: any[]) {
    const alert = await this.alertController.create({
      header,
      message,
      inputs,
      buttons
    });
    await alert.present();
    return alert;
  }

}
