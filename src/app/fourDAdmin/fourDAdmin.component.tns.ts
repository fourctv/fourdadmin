import { Component, AfterContentInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import { Config } from '../common/index';

import { LoginComponent } from '../login/login.component';
import { FourDInterface } from 'js44d';

import { BlankPage } from './blankPage';


@Component({
    moduleId: module.id,
    selector: 'sd-fourdadmin',
    providers: [FourDInterface],
    templateUrl: 'fourDAdmin.component.html',
    styleUrls: ['fourDAdmin.component.css']
})


export class FourDAdminComponent implements AfterContentInit {
    public menuList = [
        {
            routePath: '/browseTable',
            title: 'Browse Table'
        },
        {
            routePath: '/listEditor',
            title: 'List Editor'
        },
        /*  {
              routePath: '/userManager',
              title: 'User Manager'
          }*/
    ];

    public get currentUser(): string {
        return (FourDInterface.authentication) ? FourDInterface.currentUser : '?';
    }

    constructor(public router: RouterExtensions, private viewref: ViewContainerRef) {
        FourDInterface.fourDUrl = 'http://localhost:8080';
    }

    ngAfterContentInit() {
        // no predefined user, login...
    }

    userHasLoggedIn() {
        // load current profile user functions
        if (this.userIsLoggedIn) {
            FourDInterface.runningInsideWorkspace = true; // we are indeed running inside the workspace
        }

    }


    get userIsLoggedIn(): boolean { return FourDInterface.authentication !== undefined && FourDInterface.authentication !== null; }

    doLogin() {
        FourDInterface.authentication = null;
        this.router.navigate(['/login'], { skipLocationChange: true });
    }



    openApp(menu) {
        if (FourDInterface.authentication) {
            this.router.navigate([menu.routePath], { skipLocationChange: true });
        }
    }
}
