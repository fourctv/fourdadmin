// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// app
import { FourDAdminComponent } from './fourDAdmin/fourDAdmin.component';
import { routes } from './fourDAdmin/fourDAdmin.component';

// applets
import { BlankPage } from './fourDAdmin/blankPage';
import { LoginComponent } from './login/login.component';

// feature modules
import { FourDModule, JS44DModule, ModalModule } from 'js44d';

const routerModule = RouterModule.forRoot(routes);



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    routerModule,
    FourDModule, JS44DModule, ModalModule
  ],
  declarations: [FourDAdminComponent, BlankPage, LoginComponent
  ],
  exports: [FourDModule, JS44DModule, ModalModule],
  entryComponents: [LoginComponent],
  bootstrap: [FourDAdminComponent]
})

export class WebModule { }
