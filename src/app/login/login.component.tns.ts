import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import { Config } from '../common/index';

import { FourDInterface, MD5 } from '../js44D/js44D/JSFourDInterface';


@Component({
    selector: 'log-in',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls : ['login.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class LoginComponent {


    @Input() public username:string = '';
    @Input() public password:string = '';
    @Input() public showError:string = '';
    @Input() public fourDVersion:string = '';
    @Input() public webAppVersion:string = Config.APP_VERSION;
    public get serverURL():string {return this._serverURL}
    public set serverURL(v:string) {
        this._serverURL = v;
        FourDInterface.fourDUrl = v;
        this.fourD.call4DRESTMethod('REST_GetApplicationVersion',{},{responseType:'text'})
        .subscribe((v) => {
            this.fourDVersion = v;
            this.webAppVersion = Config.APP_VERSION + ' - 4D '+this.fourDVersion;
        });
}
    private _serverURL:string = "http://localhost:8080";

    constructor( private fourD:FourDInterface, public router:RouterExtensions ) {
        this.fourD.call4DRESTMethod('REST_GetApplicationVersion',{},{responseType:'text'})
            .subscribe((v) => {
                this.fourDVersion = v;
                this.webAppVersion = Config.APP_VERSION + ' - 4D '+this.fourDVersion;
            });
    }

    login() {
        let md5pwd:string = MD5.md5(this.password);
        this.fourD.signIn(this.username, md5pwd.toUpperCase())
            .then((authentication) => {
                if (FourDInterface.authentication) {
                    this.router.navigate(['/loggedin'], { skipLocationChange: true, clearHistory:true, transition:{name:'fade' } });
 
                    this.showError = '';
                } else {
                    console.log('oops');
                    this.showError = 'Sorry, the username and/or password was incorrect';
                }
            })
            .catch((e) => {
                console.log(e);
                this.showError = 'Sorry, the username and/or password was incorrect';
            });
    }
}
