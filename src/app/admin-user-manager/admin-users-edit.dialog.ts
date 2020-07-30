import { AfterViewInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FourDInterface, ICustomModal, ICustomModalComponent, MD5, ModalConfig, ModalDialogInstance } from 'js44d';
import { _ShellUsers } from './_ShellUsers';

@Component({
    selector: 'app-admin-users-edit',
    templateUrl: './admin-users-edit.dialog.html',
    styles: []
})
export class AdminUsersEditDialog implements ICustomModalComponent, AfterViewInit {
    public static dialogConfig: ModalConfig = <ModalConfig>{
        actions: ['Maximize', 'Minimize', 'Close'], position: { top: 100, left: 100 }, selfCentered: true,
        title: 'Admin User',
        isResizable: false,
        width: 750, height: 570
    };

    public currentUserRecord: _ShellUsers = new _ShellUsers();
    public currentUserGroups = [];
    public newPassword = '';
    public confirmPassword = '';

    public groupList = [];
    public groupValues = new FormControl();

    public set modelContentData(parms: ICustomModal) {
        if (parms) {
            if (parms.hasOwnProperty('currentUserRecord')) {
                this.currentUserRecord = parms['currentUserRecord'];
            }
            if (parms.hasOwnProperty('currentUserGroups')) {
                this.currentUserGroups = parms['currentUserGroups'];
            }
            if (parms.hasOwnProperty('groupList')) {
                this.groupList = parms['groupList'];
            }

        }
    }
    constructor(public dialog: ModalDialogInstance, private fourD: FourDInterface, private snackbar: MatSnackBar) { }

    ngAfterViewInit() {
        if (this.currentUserRecord.isRecordLoaded()) {
            // if editing a record, build the list of groups user belongs to
            if (this.currentUserGroups && this.currentUserGroups.length > 0) {
                this.groupValues.setValue(this.groupList.filter(g => { return this.currentUserGroups.find(gm => { return g.ID === gm.UserGroupID }) != undefined }));
            }

        }
    }

    doSaveRecord() {
        if (this.newPassword && this.newPassword != '') { // validate new password...
            if (this.newPassword === this.confirmPassword) {
                // passwords valid, update record...
                this.currentUserRecord.Password = MD5.md5(this.newPassword).toUpperCase();
            } else {
                this.snackbar.open('Password do not match!!', '', { duration: 800, verticalPosition: 'top' });
                return
            }
        }

        if (!this.currentUserRecord.UserName || this.currentUserRecord.UserName === '') {
            this.snackbar.open("Need username...", 'OK')
            return;
        }
        if (!this.currentUserRecord.Password || this.currentUserRecord.Password === '') {
            this.snackbar.open("Need password...", 'OK')
            return;
        }

        if (this.groupValues.touched) { // if group membership has been modified...
            let groupList = '';
            this.groupValues.value.forEach(group => {
                groupList += group.ID + ',';
            });

            const body = { userID: this.currentUserRecord.ID, groupIDs: groupList }
            this.fourD.call4DRESTMethod('users_restSetUserGroups', body, { responseType: 'text' })
                .subscribe(msg => {
                    if (msg && msg != '') {
                        this.snackbar.open(msg, 'OK')
                    } else {
                        if (this.currentUserRecord.recordIsDirty()) { // if record has been modified...
                            this.saveRecord();
                        } else this.dialog.close('recordSaved');
                    }
                })
        } else if (this.currentUserRecord.recordIsDirty()) { // if record has been modified...
            this.saveRecord();
        }
    }


    private saveRecord() {
        if (this.currentUserRecord.isRecordLoaded()) {
            this.currentUserRecord.updateRecord()
                .then(() => { this.dialog.close('recordSaved'); })
                .catch((reason) => { alert(reason); });
        } else {
            this.currentUserRecord.insertRecord()
                .then((recnum) => { this.dialog.close('recordSaved'); })
                .catch((reason) => { alert(reason); });
        };
    }

}
