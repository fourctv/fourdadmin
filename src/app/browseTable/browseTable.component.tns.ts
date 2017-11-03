import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from "tns-core-modules/data/observable-array"

//import { LogService } from '../core/services/logging/log.service';
import { FourDInterface } from '../js44D/js44D/JSFourDInterface';
import { FourDModel } from '../js44D/js44D/JSFourDModel';
import { FourDCollection } from '../js44D/js44D/JSFourDCollection';

import * as base64 from 'base-64';
import * as utf8 from 'utf8/utf8';

export class FieldDescription {
    name: string;
    fieldNo: number;
    longname: string;
    type: string;
    required: boolean;
    indexed: boolean;
    unique: boolean;
    readonly: boolean;
    choiceList: string;
    relatesTo: string;
    field?: string;
    title?:string;
    quickQuery?:boolean;
    index?:number;
    width?:string;
}


@Component({
    moduleId: module.id,
    selector: 'sd-browse-table',
    templateUrl: 'browseTable.component.html',
    styleUrls: ['browseTable.component.css'],
})


export class BrowseTableComponent implements AfterContentInit {

    @Input() numOfTables = 0;
    @Input() listOfTables:Array<string> = [];
    @Input() showTableList:string = 'visible';
    @Input() showFieldList:string = 'collapse';
    @Input() showBrowse:string = 'collapse';
    @Input() currentTable = '';
    @Input() listedTable = '';
    @Input() listOfFields:Array<FieldDescription> = [];
    @Input() listOfColumns:Array<FieldDescription> = [];
    @Input() displayListOfColumns:ObservableArray<FieldDescription> = new ObservableArray([]);
    @Input() relatedOneTables:Array<string> = [];
    @Input() currentField:FieldDescription = new FieldDescription();

    @Input() queryData:any = {};
       
        // the columns for the datagrid
    @Input() public columnWidths:string = '';

    //
    // Declare Datagrid properties
    //
    public recordList:Array<FourDModel> = [];
    public model = FourDModel; // the record datamodel to use 

    public selectedFieldIndex = -1;
    public selectedColumnIndex = -1;
    public selectedRecordIndex = -1;

    private selectedRow:any = null;
    private selectedColumn:any = null;
    
    private totalRecordCount:number = 0;

    constructor ( private fourD:FourDInterface, private router:RouterExtensions, private viewref: ViewContainerRef) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables',{})
        .subscribe(resultJSON => {
            //let resultJSON = response.json();
            this.numOfTables = resultJSON.tableCount;
            this.listOfTables = resultJSON.tableList;
            this.listOfTables.sort();

        });
    }

    selectTable(selectRow) {
       
        if (selectRow < this.numOfTables) {
            this.showTableList = 'collapse';
            this.showBrowse = 'collapse';
            this.currentTable = this.listOfTables[selectRow];
            this.listedTable = this.currentTable;
            this.fourD.call4DRESTMethod('REST_GetFieldsInTable',{TableName:this.listOfTables[selectRow]})
            .subscribe(resultJSON => {
                //let resultJSON = response.json();
                this.listOfFields = resultJSON.fieldList;

                this.model.prototype.tableName = this.currentTable;
                this.model.prototype.fields = <any>this.listOfFields;
                this.model.prototype.primaryKey_ = resultJSON.primaryKey;

                // set default columns
                this.listOfColumns = [];
                this.relatedOneTables = [this.currentTable];
                this.queryData = {query:["All"]};
                for (var index = 0; index < this.listOfFields.length; index++) {
                    var element = this.listOfFields[index];
                    element.index = index;
                    element.field = element.longname;
                    element.title = element.name;
                    element.width = '100';
                   if (element.indexed) {
                       element.quickQuery = true;
                        this.listOfColumns.push(element);
                    } else {
                        element.quickQuery = false;
                    }
                    if (element.relatesTo && element.relatesTo !== '') {
                        this.relatedOneTables.push(element.relatesTo.split('.')[0]);
                    }
                    
                }

                this.displayListOfColumns = new ObservableArray(this.listOfColumns);
                this.showFieldList = 'visible';
            });
           
        }
    }

    selectField(index) {
        this.selectedFieldIndex = index;
    }

    selectRecord(index) {
        this.selectedRecordIndex = index;
    }

    selectColumn(index) {
        if (index >= 0 && index < this.listOfColumns.length) {
            this.selectedColumnIndex = index;
            this.selectedColumn = this.listOfColumns[index]
        } else {
            this.selectedColumnIndex = -1;
        }
    }

    itemReordered(event) {
        this.listOfColumns = this.displayListOfColumns.filter(() => {return true});
    }

    addField() {
        if (this.selectedFieldIndex >= 0) {
            var element = this.listOfFields[this.selectedFieldIndex];
            let dupe = false;
            this.listOfColumns.forEach(column => {
                if (column.name === element.name) dupe = true;
            });
            if (!dupe) {
                element.field = element.longname;
                element.title = element.name;
                element.width = '100';
                if (element.indexed) {
                    element.quickQuery = true;
                } else {
                    element.quickQuery = false;
                }
                this.listOfColumns.push(element);
                this.displayListOfColumns = new ObservableArray(this.listOfColumns);
            }
        }
    }

    removeField() {
        if (this.selectedColumnIndex >= 0) {
            this.listOfColumns.splice(this.selectedColumnIndex,1);
            this.selectedColumnIndex = -1;
            this.selectedColumn = null;
            this.currentField = new FieldDescription();
            this.displayListOfColumns = new ObservableArray(this.listOfColumns);
        }
    }

    showRelatedTable(event) {
        this.listedTable = event.target.textContent;
        this.fourD.call4DRESTMethod('REST_GetFieldsInTable',{TableName:this.listedTable})
        .subscribe(resultJSON => {
            //let resultJSON = response.json();
            this.listOfFields = resultJSON.fieldList;
            for (var index = 0; index < this.listOfFields.length; index++) {
                var element = this.listOfFields[index];
                element.field = element.longname;
                element.title = element.name;
                element.quickQuery = false;
                 
            }
        });
    }

    addRecord() {
        let newModel: FourDModel = new FourDModel();
        newModel.tableName = this.currentTable;
        newModel.fields = <any>this.listOfFields;
        newModel.clearRecord();
//        this.modal.openInside(<any>this.editWindow, this.viewref, newModel, this.editWindow['dialogConfig']); // open edit dialog

    }

    doBrowse() {
        this.columnWidths = '';
        for (var i = 0; i < this.listOfColumns.length; i++) {
           if (i===0) {
               this.columnWidths = this.listOfColumns[i].width;
           } else {
                this.columnWidths += ','+this.listOfColumns[i].width;
           }
        }
        this.showTableList = 'collapse';
        this.showFieldList = 'collapse';
        this.showBrowse = 'visible';
        if (this.queryData) this.doQuery();
    }

    doQuery() {
        console.log('query:'+this.currentTable);
        let body: any = { Username: FourDInterface.currentUser };
        body.TableName = this.currentTable;
        body.StartRec = 0;
        body.NumRecs = -1;

        body.QueryString = JSON.stringify(this.queryData);
        body.Columns = base64.encode(utf8.encode(JSON.stringify(this.listOfColumns)));

        body.FilterOptions = '';
        body.OrderBy = '';


        let me = this;
        this.fourD.call4DRESTMethod('REST_GetRecords', body)
            .subscribe(resultJSON => {
                me.totalRecordCount = 0;
                me.recordList = [];
                //let jsonData:Object = response.json();

                if (resultJSON && resultJSON['selected'] && resultJSON['records']) {
                    me.totalRecordCount = resultJSON['selected'];
                    console.log('got:'+me.totalRecordCount);
                    let recList: Array<any> = resultJSON['records'];
                    recList.forEach(record => {
                        let newModel: FourDModel = new FourDModel();
                        newModel.populateModelData(record);
                        me.recordList.push(newModel);
                    });
                }

            },
            error => {
                //this.logger.debug('error:' + error.text());
                console.log('error:' + error.text());

            });
   
    }

    onNavBtnTap() {
        if (this.showBrowse === 'visible') {
            this.showTableList = 'collapse';
            this.showFieldList = 'visible';
            this.showBrowse = 'collapse';  
        } else if (this.showFieldList === 'visible') { 
            this.showTableList = 'visible';
            this.showFieldList = 'collapse';
            this.showBrowse = 'collapse';  
        } else this.router.navigate(['/back'], { clearHistory: true })

    }

}
