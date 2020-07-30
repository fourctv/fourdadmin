import { AfterViewInit, Component } from '@angular/core';
import { ICustomModal, ICustomModalComponent, Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent } from 'js44d';
import { _ShellUserGroupMember } from './_ShellUserGroupMember';
import { _ShellUserGroups } from './_ShellUserGroups';
import { _ShellUsers } from './_ShellUsers';
import { AdminGroupsEditDialog } from './admin-groups-edit.dialog';
import { AdminUsersEditDialog } from './admin-users-edit.dialog';

@Component({
  selector: 'mol-angular-admin-user-manager',
  templateUrl: './admin-user-manager.component.html',
  styles: [`
        .vGroup {
        display: flex;
        flex-direction: column;
        margin-top: 2px;
        margin-bottom: 2px;
        }

        .hGroup {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 2px;
        margin-bottom: 2px;
        }

  `],
  providers: [Modal]
})
export class AdminUserManagerComponent implements AfterViewInit, ICustomModalComponent {
    public static dialogConfig: ModalConfig = <ModalConfig>{
        actions: ['Maximize', 'Minimize', 'Close'], position: { top: 100, left: 150 }, selfCentered: true,
        title: '4D User Manager',
        isResizable: true,
        width: 1100, height: 510
    };

  private userList: Array<any> = [];
  private groupList: Array<any> = [];

  public currentUser: _ShellUsers;
  public currentGroup: _ShellUserGroups;


  private currentUserGroupList = [];
  private currentGroupUserList = [];

  private initialize = true;

    constructor(public dialog: ModalDialogInstance, private modal: Modal) { }

  ngAfterViewInit() {
    this.loadUsersAndGroups();
  }

  private loadUsersAndGroups() {
    let users: _ShellUsers = new _ShellUsers();
    users.getRecords({ query: ['all'] }, null, 0, -1, null, '>UserName').then(userRecs => {
      this.userList = userRecs.toArray(); // looad all users
      this.userList.forEach(item => item.name = item.UserName);
      let groups: _ShellUserGroups = new _ShellUserGroups();
      groups.getRecords({ query: ['all'] }, null, 0, -1, null, '>GroupName').then(groupRecs => {
        this.groupList = groupRecs.toArray(); // load all groups
        this.groupList.forEach(item => item.name = item.GroupName);
        let usersInGroups: _ShellUserGroupMember = new _ShellUserGroupMember();
        usersInGroups.getRecords({ query: ['all'] }).then(recs => {
          // now build users & groups trees
          for (const userInGroup of recs.models) {
            let user = this.userList.find(item => { return (item.ID === userInGroup.UserID) });
            let group = this.groupList.find(item => { return (item.ID === userInGroup.UserGroupID) });
            if (user && group) {
              if (!user.hasOwnProperty('items')) {
                user.items = []
              }
              user.items.push({ name: group.GroupName, UserGroupID: group.ID, id: user.ID });
              if (!group.hasOwnProperty('items')) {
                group.items = [];
              }
              group.items.push({ name: user.UserName, UserID: user.ID, id: group.ID });
            }
          }

          if (this.initialize) {
            this.initialize = false;
            this.initTrees();
          } else {
            $('#userTreeView').data('kendoTreeView').setDataSource(<any>this.userList);
            $('#groupTreeView').data('kendoTreeView').setDataSource(<any>this.groupList);
          }
        });
      });
    });
  }

  private initTrees() {
    // this.userTree.data = this.userList;
    $('#userTreeView').kendoTreeView({
      dataSource: this.userList,
      dataTextField: 'name',
      select: (e) => {
        let data: any = $('#userTreeView').data('kendoTreeView').dataItem(e.node);
        if (data.ID) { // did user select a User record?
          this.currentUser = new _ShellUsers();
          this.currentUser.populateModelData(data);
          this.currentUser.clearRecordDirtyFlag();
          this.currentUserGroupList = data.items;
        } else {
          this.currentUserGroupList = null;
          this.currentUser = null;
        }
      }
    })
    $('#groupTreeView').kendoTreeView({
      dataSource: this.groupList,
      dataTextField: 'name',
      select: (e) => {
        let data: any = $('#groupTreeView').data('kendoTreeView').dataItem(e.node);
        if (data.ID) { // did user select a Group record?
          this.currentGroup = new _ShellUserGroups();
          this.currentGroup.populateModelData(data);
          this.currentGroup.clearRecordDirtyFlag();
          this.currentGroupUserList = data.items;
        } else {
          this.currentGroupUserList = null;
          this.currentGroup = null;
        }
      }
    })

  }

  public addUser() {
    this.modal.openDialog(AdminUsersEditDialog, { groupList: this.groupList }).then(res => {
      if (res === 'recordSaved') {
        this.loadUsersAndGroups();
      }
    });
  }

  public editUser() {
    this.modal.openDialog(AdminUsersEditDialog, { currentUserRecord: this.currentUser, currentUserGroups: this.currentUserGroupList, groupList: this.groupList }).then(res => {
      if (res === 'recordSaved') {
        this.loadUsersAndGroups();
      }
    });
  }

  public delUser() {
    if (this.currentUser) {
      this.showConfirm("Confirm delete User:" + this.currentUser.UserName + '?').then(res => {
        if (res) {
          this.currentUser.deleteRecord(true).then(() => this.loadUsersAndGroups())
        }
      });
    }
  }

  public addGroup() {
    this.modal.openDialog(AdminGroupsEditDialog, { }).then(res => {
      if (res === 'recordSaved') {
        this.loadUsersAndGroups();
      }
    });
  }

  public editGroup() {
    this.modal.openDialog(AdminGroupsEditDialog, { currentGroupRecord: this.currentGroup }).then(res => {
      if (res === 'recordSaved') {
        this.loadUsersAndGroups();
      }
    });
  }

  public delGroup() {
    if (this.currentGroup) {
      this.showConfirm("Confirm delete Group:" + this.currentGroup.GroupName + '?').then(res => {
        if (res) {
          this.currentGroup.deleteRecord(true).then(() => this.loadUsersAndGroups())
        }
      });
    }

  }



  public showConfirm(body, title = 'Confirm', yesText = 'Yes', noText = 'No'): Promise<string> {
    let confirm: YesNoModalContent = new YesNoModalContent();
    confirm.title = title;
    confirm.body = body;
    confirm.yesText = yesText;
    confirm.noText = noText;
    return this.modal.openDialog(YesNoModal, <ICustomModal>confirm);
  }
}
