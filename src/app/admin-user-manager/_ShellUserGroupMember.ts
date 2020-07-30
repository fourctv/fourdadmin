import { FourDModel } from 'js44d';

export class _ShellUserGroupMember extends FourDModel {

	public static kTABLE:string = '_ShellUserGroupMember';
	public static kUserID:string = '_ShellUserGroupMember.UserID';
	public static kUserGroupID:string = '_ShellUserGroupMember.UserGroupID';

	tableName:string = '_ShellUserGroupMember';
	tableNumber:number = 8;
	fields:Array<any> = [
		{name:'UserID', longname:'_ShellUserGroupMember.UserID', type:'number', indexed:true, relatesTo:'_ShellUsers.ID', relationName:'UserID_3_ID'},
		{name:'UserGroupID', longname:'_ShellUserGroupMember.UserGroupID', type:'number', indexed:true, relatesTo:'_ShellUserGroups.ID', relationName:'UserGroupID_4_ID'}
	];

	get UserID():number {return this.get('UserID');}
	set UserID(v:number) {this.set('UserID',v);}

	get UserGroupID():number {return this.get('UserGroupID');}
	set UserGroupID(v:number) {this.set('UserGroupID',v);}


}

