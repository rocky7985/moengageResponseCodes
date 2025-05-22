import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedListsPage } from './saved-lists.page';

describe('SavedListsPage', () => {
  let component: SavedListsPage;
  let fixture: ComponentFixture<SavedListsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedListsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
