import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-blank',
  template: `
    <side-bar pageTitle="FourD Admin">
        <StackLayout padding="25">
          <Label class="body" text="Select function from the menu above" textWrap="true"></Label>
        </StackLayout>
    </side-bar>`
})
export class BlankPage {

}
