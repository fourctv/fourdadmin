import { Component, AfterViewInit } from '@angular/core';
import { ModalConfig, MD5, FourDInterface, ICustomModalComponent, ICustomModal, ModalDialogInstance } from 'js44d';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { _ShellUsers } from './_ShellUsers';
import { _ShellUserGroups } from './_ShellUserGroups';

@Component({
  selector: 'app-admin-groups-edit',
  templateUrl: './admin-groups-edit.dialog.html',
  styles: []
})
export class AdminGroupsEditDialog implements ICustomModalComponent, AfterViewInit {
  public static dialogConfig: ModalConfig = <ModalConfig>{
    actions: ['Maximize', 'Minimize', 'Close'], position: { top: 100, left: 100 }, selfCentered: true,
    title: 'Admin User',
    isResizable: false,
    width: 750, height: 150
  };

  public currentGroupRecord: _ShellUserGroups = new _ShellUserGroups();

  public set modelContentData(parms: ICustomModal) {
    if (parms) {
      if (parms.hasOwnProperty('currentGroupRecord')) {
        this.currentGroupRecord = parms['currentGroupRecord'];
      }

    }
  }
  constructor(public dialog: ModalDialogInstance, private fourD: FourDInterface, private snackbar: MatSnackBar) { }

  ngAfterViewInit() {

  }

  doSaveRecord() {
    if (!this.currentGroupRecord.GroupName || this.currentGroupRecord.GroupName === '') {
      this.snackbar.open("Need Group Name...", 'OK')
      return;
    }

    this.saveRecord();

  }


  private saveRecord() {
    if (this.currentGroupRecord.isRecordLoaded()) {
      this.currentGroupRecord.updateRecord()
        .then(() => { this.dialog.close('recordSaved'); })
        .catch((reason) => { alert(reason); });
    } else {
      this.currentGroupRecord.insertRecord()
        .then((recnum) => { this.dialog.close('recordSaved'); })
        .catch((reason) => { alert(reason); });
    };
  }

}
