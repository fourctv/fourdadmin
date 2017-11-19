import { Component, Input, ReflectiveInjector } from '@angular/core';
import { Config } from '../common/index';

import { ModalDialogInstance, ICustomModalComponent, ModalConfig } from 'js44d/ui';

import { FourDInterface, MD5 } from 'js44d';


@Component({
    selector: 'log-in',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements ICustomModalComponent {
    public static dialogConfig: ModalConfig = <ModalConfig>{
        size: 'sm',
        selfCentered: true,
        isResizable: false,
        isModal: true,
        isBlocking: true,
        title: 'Login',
        width: 1063, height: 667
    };

    @Input() public username = '';
    @Input() public password = '';
    @Input() public showError = false;
    @Input() public fourDVersion = '';
    @Input() public webAppVersion = Config.APP_VERSION;


    constructor(public dialog: ModalDialogInstance, private fourD: FourDInterface) {
        this.fourD.call4DRESTMethod('REST_GetApplicationVersion', {}, { responseType: 'text' })
            .subscribe((v) => { this.fourDVersion = v; });
    }

    login() {
        const md5pwd: string = MD5.md5(this.password);
        this.fourD.signIn(this.username, md5pwd.toUpperCase())
            .then((authentication) => {
                if (FourDInterface.authentication) {
                    this.showError = false;
                    this.dialog.close('loggedin');
                } else {
                    console.log('oops');
                    this.showError = true;
                }
            })
            .catch((e) => {
                console.log(e);
                this.showError = true;
            });
    }
}
