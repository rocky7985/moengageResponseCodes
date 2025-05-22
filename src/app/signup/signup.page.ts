import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage {

  signupForm: FormGroup;
  isSubmit: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private CommonService: CommonService,
    private Navigation: NavigationService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(20),
      Validators.pattern(/^[A-Z][a-zA-Z -]*$/)]),

      email: new FormControl('', [Validators.required, Validators.email,
      Validators.pattern(/^[a-z][a-z0-9._%+-]*@[a-z]+\.[a-z]+$/), Validators.maxLength(20)]),

      phone: new FormControl('', [Validators.required, Validators.pattern(/^(?!.*[eE+\-.])\d{10}$/),
      Validators.minLength(10),
      Validators.maxLength(10),
      ]),

      address: new FormControl('', [Validators.required, Validators.maxLength(30)]),

      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]),

      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]),

    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  passwordMatchValidator() {
    const passwordControl = this.signupForm?.get('password');
    const confirmPasswordControl = this.signupForm?.get('confirmPassword');
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    return password == confirmPassword ? null : { passwordNotMatch: true };
  }

  signup(form: any) {
    if (this.signupForm.valid) {
      this.isSubmit = true; // Show spinner when submitting
      this.CommonService.post('signup', form).subscribe({
        next: (res: any) => {
          if (res.status == 'success') {
            console.log('signin', res)
            this.CommonService.presentToast('Success');
            this.signupForm.reset();
            this.Navigation.navigateWithRoute('/login');


          }
        }, error: (err: any) => {
          this.CommonService.presentToast('Error Detected');
          console.log('SignupFailed', err);
        }, complete: () => {
          this.isSubmit = false;
        }
      });
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.Navigation.navigateWithRoute('/login');
  }

  goToWelcome() {
    this.Navigation.navigateWithRoute('/welcome');
  }

}

