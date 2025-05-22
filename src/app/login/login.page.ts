import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service';
import { StorageService } from '../storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {

  loginForm: FormGroup;
  loadProfileData: boolean = false;
  showPassword: boolean = false;

  constructor(
    private StorageService: StorageService,
    private CommonService: CommonService,
    private Navigation: NavigationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email,
      Validators.pattern(/^[a-z][a-z0-9._%+-]*@[a-z]+\.[a-z]+$/), Validators.maxLength(20)]),

      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),

      rememberMe: new FormControl(false),
    });
  }

  ionViewWillEnter() {
    this.rememberMe();
    this.loadProfileData = false;
  }

  login() {
    this.loadProfileData = true; // Show spinner when login starts

    const loginData = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.CommonService.loginUrl(loginData).subscribe({
      next: (response: any) => {

        if (response.status == 'success') {
          this.CommonService.presentToast('Login Successful');
          console.log('response', response);
          this.StorageService.set('login', response);

          if (this.loginForm.value.rememberMe) {
            this.StorageService.set('remember', loginData);
          } else {
            this.StorageService.remove('remember');
          }

          this.loginForm.reset();
          this.CommonService.setMenuState(true);
          this.Navigation.navigateWithRoute('/search');
        }
        else {
          // If the response status is not 'success'
          this.CommonService.presentToast('Login Failed: Invalid credentials');
        }

      },

      error: (error: any) => {
        console.log('LoginFailed', error);
        this.CommonService.presentToast('Login Failed. An Error Occurred.');
        this.loadProfileData = false; // Hide spinner when login completes
      },
      complete: () => {
        this.loadProfileData = false; // Hide spinner when login completes
      },
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async rememberMe() {
    const rememberUser = await this.StorageService.get('remember');
    if (rememberUser) {
      this.loginForm.patchValue({
        email: rememberUser.username,
        password: rememberUser.password,
        rememberMe: true,
      });
    }
    else {
      this.loginForm.patchValue({
        email: '',
        password: '',
        rememberMe: false,
      });
    }
  }

  goToSignup() {
    this.Navigation.navigateWithRoute('/signup');
  }


}
