// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// libs
import { FourDInterface, FourDModel, FourDCollection } from 'js44d';

// app
import { FourDAdminComponent } from './fourDAdmin/fourDAdmin.component';
import { routes } from './fourDAdmin/fourDAdmin.component';

// applets
import { BlankPage } from './fourDAdmin/blankPage';
import { LoginComponent } from './login/login.component';

// feature modules
import { JS44DModule, ModalModule } from 'js44d';

const routerModule = RouterModule.forRoot(routes);



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    routerModule,
    JS44DModule, ModalModule
  ],
  declarations: [FourDAdminComponent, BlankPage, LoginComponent
  ],
  providers: [
    FourDInterface, FourDModel, FourDCollection
  ],
  exports: [JS44DModule, ModalModule],
  entryComponents: [LoginComponent],
  bootstrap: [FourDAdminComponent]
})

export class WebModule { }
