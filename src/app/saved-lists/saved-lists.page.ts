import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-saved-lists',
  templateUrl: './saved-lists.page.html',
  styleUrls: ['./saved-lists.page.scss'],
  standalone: false
})
export class SavedListsPage implements OnInit {
  savedLists: any[] = [];
  expandedIndex: number | null = null;
  isProcessing: boolean = false;

  constructor(private commonService: CommonService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.loadSavedLists();
  }

  async loadSavedLists() {
    (await this.commonService.getSavedLists()).subscribe(res => {
      if (res.status === 'success') {
        this.savedLists = res.data;
        console.log('Saved Lists:', this.savedLists);
      } else {
        console.log('Error fetching lists:', res.message);
      }
    }, err => {
      console.error('API Error:', err);
    });
  }

  toggleList(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  getImageUrl(code: number | string): string {
    return `https://http.cat/${code}.jpg`; // Adjust if your backend provides image_url directly
  }

  async deleteSavedList(listId: number, listName: string) {
    const alert = await this.commonService.presentAlert(
      'Confirm Delete',
      `Are you sure you want to delete the list "${listName}"?`,
      [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            this.isProcessing = true;
            const loginData = await this.storageService.get('login');
            const token = loginData?.data?.token;

            this.commonService.sendData('delete_saved_list', { id: listId }, token)
              .subscribe(
                async (res: any) => {
                  this.isProcessing = false;
                  if (res.status === 'success') {
                    await this.commonService.presentToast('List deleted successfully');
                    this.loadSavedLists();
                  } else {
                    await this.commonService.presentToast('Error: ' + res.message);
                  }
                },
                async (error) => {
                  this.isProcessing = false;
                  await this.commonService.presentToast('API error: Unable to delete');
                  console.error(error);
                }
              );
          }
        }
      ]
    );
  }

  async editSavedList(listId: number, currentName: string) {
    const alert = await this.commonService.presentAlertWithInput(
      'Rename List',
      'Enter a new name for the list:',
      [
        {
          name: 'newName',
          type: 'text',
          placeholder: 'New list name',
          value: currentName
        }
      ],
      [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            const newName = data.newName?.trim();
            if (!newName || newName === currentName) {
              await this.commonService.presentToast('Please provide a different name.');
              return;
            }

            this.isProcessing = true;
            const loginData = await this.storageService.get('login');
            const token = loginData?.data?.token;

            this.commonService.sendData('edit_saved_list', { id: listId, name: newName }, token)
              .subscribe(
                async (res: any) => {
                  this.isProcessing = false;
                  if (res.status === 'success') {
                    await this.commonService.presentToast('List name updated successfully');
                    this.loadSavedLists();
                  } else {
                    await this.commonService.presentToast('Error: ' + res.message);
                  }
                },
                async (error) => {
                  this.isProcessing = false;
                  await this.commonService.presentToast('API error: Unable to update name');
                  console.error(error);
                }
              );
          }
        }
      ]
    );
  }

}
