import { Component } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import { FourDInterface } from '../js44D/js44D/JSFourDInterface';

@Component({
  moduleId: module.id,
  selector: 'sd-blank',
  template: `
        <ActionBar title="FourD Admin" icon="" class="action-bar">
            <ActionItem  *ngFor="let item of menuList" (tap)="openApp(item)">
                <Button [text]="item.title " class="action-item" paddingRight="10"></Button>
            </ActionItem>
            <ActionItem (tap)="doLogin()" ios.position="right">
                <Button text="Logout " class="action-item"></Button>
            </ActionItem>
        </ActionBar>
        <StackLayout padding="25">
          <Label class="body" text="Select function from the menu above" textWrap="true"></Label>
        </StackLayout>
    `
})
export class BlankPage {
  public menuList = [
    {
        routePath: '/browseTable',
        title: 'Browse Table'
    },
    {
        routePath: '/listEditor',
        title: 'List Editor'
    }
];

openApp(menu) {
  if (FourDInterface.authentication) {
      this.router.navigate([menu.routePath], { clearHistory: true });
  }
}

doLogin() {
  this.router.navigate(['/login'], { clearHistory: true });  
}

  constructor (private router:RouterExtensions) {}
}
