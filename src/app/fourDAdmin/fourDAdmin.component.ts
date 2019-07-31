import { Component, AfterContentInit, ViewContainerRef } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { Config } from '../common/index';

import { LoginComponent } from '../login/login.component';
import { Modal } from 'js44d';
import { FourDInterface } from 'js44d';

import { BlankPage } from './blankPage';

export const routes: Routes = [
    { path: 'login', component: BlankPage },
    { path: 'browseTable', loadChildren: () => import('app/browseTable/browseTable.module').then(m => m.BrowseTableModule) },
    { path: 'listEditor', loadChildren: () => import('app/listEditor/listEditor.module').then(m => m.ListEditorModule) },
    { path: '**', component: BlankPage }
];


@Component({
    moduleId: module.id,
    selector: 'sd-fourdadmin',
    providers: [Modal, FourDInterface],
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

    constructor(public router: Router, private modal: Modal, private viewref: ViewContainerRef) {
        if (window.location.hostname === 'localhost' && window.location.port === '4200') {
            // FourDInterface.fourDUrl = 'http://www.vakeano.com';
            FourDInterface.fourDUrl = 'http://localhost:8080';
            // FourDInterface.fourDUrl = 'http://10.211.55.8:8181';
        } else {
            FourDInterface.fourDUrl = window.location.origin;
        }
        Modal.hostViewRef = this.viewref;
    }

    ngAfterContentInit() {
        // no predefined user, login...
        if (Config.PLATFORM_TARGET === Config.PLATFORMS.WEB) { this.showLoginDialog(); }
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
        if (Config.PLATFORM_TARGET === Config.PLATFORMS.WEB) { this.showLoginDialog(); }
    }

    showLoginDialog() {
        this.modal.openInside(<any>LoginComponent, this.viewref, null, LoginComponent['dialogConfig'])
            .then((result) => {
                this.userHasLoggedIn();
            });
    }


    openApp(menu) {
        if (FourDInterface.authentication) {
            this.router.navigate([menu.routePath], { skipLocationChange: true });
        }
    }
}
