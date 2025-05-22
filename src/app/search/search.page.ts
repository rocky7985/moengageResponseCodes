import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';
import { NavigationService } from '../navigation.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage {
  filter: string = '';
  filteredCodes: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  listAlreadySaved: boolean = false;

  constructor(
    private commonService: CommonService,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private Navigation: NavigationService
  ) { }

  async searchCodes() {
    this.errorMessage = '';
    this.filteredCodes = [];
    this.listAlreadySaved = false;

    if (!this.filter.trim()) {
      this.errorMessage = 'Please enter a filter like "2xx", "404", etc.';
      return;
    }

    this.isLoading = true;

    try {
      const loginData = await this.storageService.get('login');
      const token = loginData?.data?.token;

      if (!token) {
        this.errorMessage = 'Not authenticated. Please log in.';
        this.isLoading = false;
        return;
      }

      this.commonService.sendData('filter_response_codes', { filter: this.filter.trim() }, token)
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            if (res.status === 'success') {
              this.filteredCodes = Object.values(res.data);
              if (this.filteredCodes.length === 0) {
                this.errorMessage = 'No response codes found for the given filter.';
              } else {
                this.checkIfAlreadySaved(token);  // check on response
              }
            } else {
              this.errorMessage = res.message || 'Error fetching data.';
            }
          },
          error: (err: any) => {
            this.isLoading = false;
            this.errorMessage = 'Network or server error occurred.';
            console.error('API error:', err);
          }
        });

    } catch (err) {
      this.errorMessage = 'Unable to access stored credentials.';
      this.isLoading = false;
      console.error('Storage error:', err);
    }
  }

  async checkIfAlreadySaved(token: string) {
    const payload = {
      data: this.filteredCodes
    };

    this.commonService.sendData('check_filtered_list_exists', payload, token).subscribe({
      next: (res: any) => {
        if (res.status === 'success' && res.data.exists) {
          this.listAlreadySaved = true;
        } else {
          this.listAlreadySaved = false;
        }
      },
      error: () => {
        this.listAlreadySaved = false;
      }
    });
  }

  async promptAndSaveList() {
    const alert = await this.alertCtrl.create({
      header: 'Save List',
      inputs: [
        {
          name: 'listName',
          type: 'text',
          placeholder: 'Enter list name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async data => {
            if (!data.listName) {
              return false; // prevents the alert from closing
            }
            await this.saveList(data.listName); // await the save function
            return true; // signal that the alert can be dismissed
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async saveList(name: string) {
    const loginData = await this.storageService.get('login');
    const token = loginData?.data?.token;

    if (!token) {
      this.errorMessage = 'Not authenticated.';
      return;
    }

    const payload = {
      name: name.trim(),
      data: this.filteredCodes
    };

    this.commonService.sendData('save_filtered_list', payload, token).subscribe({
      next: async (res: any) => {
        if (res.status === 'success') {
          this.listAlreadySaved = true;
          await this.presentAlert('Success', 'List saved successfully.');
        } else if (res.message?.includes('already saved')) {
          this.listAlreadySaved = true;
          await this.presentAlert('Info', 'This list is already saved.');
        } else {
          this.errorMessage = res.message || 'Failed to save list.';
        }
      },
      error: async (err) => {
        this.errorMessage = err?.error?.message || 'Unknown error occurred.';
        await this.presentAlert('Error', this.errorMessage);
      }
    });
  }

  onSearchInputChange(event: any) {
    const input = event.detail.value;
    if (input && input.trim().length > 2) {
      this.filter = input;
      this.searchCodes();
    }
  }

}
