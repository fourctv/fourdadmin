import { FourDModel } from 'js44d';

export class _ShellUserGroups extends FourDModel {

	public static kTABLE:string = '_ShellUserGroups';
	public static kID:string = '_ShellUserGroups.ID';
	public static kGroupID:string = '_ShellUserGroups.GroupID';
	public static kGroupName:string = '_ShellUserGroups.GroupName';
	public static kOwnerID:string = '_ShellUserGroups.OwnerID';

	tableName:string = '_ShellUserGroups';
	tableNumber:number = 7;
	primaryKey_:string = 'ID';
	fields:Array<any> = [
		{name:'ID', longname:'_ShellUserGroups.ID', type:'number', required:true, readonly:true, indexed:true, unique:true},
		{name:'GroupID', longname:'_ShellUserGroups.GroupID', type:'number'},
		{name:'GroupName', longname:'_ShellUserGroups.GroupName', type:'string', required:true, length:16, indexed:true},
		{name:'OwnerID', longname:'_ShellUserGroups.OwnerID', type:'number', indexed:true, relatesTo:'_ShellUsers.ID', relationName:'OwnerID_2_ID'}
	];

	get ID():number {return this.get('ID');}
	set ID(v:number) {this.set('ID',v);}

	get GroupID():number {return this.get('GroupID');}
	set GroupID(v:number) {this.set('GroupID',v);}

	get GroupName():string {return this.get('GroupName');}
	set GroupName(v:string) {this.set('GroupName',v);}

	get OwnerID():number {return this.get('OwnerID');}
	set OwnerID(v:number) {this.set('OwnerID',v);}


}

