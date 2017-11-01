import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

//import { LogService } from '../core/services/logging/log.service';
import timer = require("tns-core-modules/timer");
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
    @Input() currentTable = '';
    @Input() listedTable = '';
    @Input() listOfFields:Array<FieldDescription> = [];
    @Input() listOfColumns:Array<FieldDescription> = [];
    @Input() relatedOneTables:Array<string> = [];
    @Input() currentField:FieldDescription = new FieldDescription();

    @Input() queryData:any = {};
    
    @Input() hideBrowseConfig:boolean = false;
    @Input() currentGridHeight = 'calc(100% - 320px)';

    
       
        // the columns for the datagrid
    public columnDefs = [
        { title: 'Record ID', field: 'RecordID'}
    ];

    //
    // Declare Datagrid properties
    //
    public model = FourDModel; // the record datamodel to use 

    public selectedFieldIndex = -1;
    public selectedColumnIndex = -1;

    private selectedRow:any = null;
    private selectedColumn:any = null;
    
    private totalRecordCount:number = 0;
    private models = [];

    constructor ( private fourD:FourDInterface, private router:RouterExtensions, private viewref: ViewContainerRef) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables',{})
        .subscribe(response => {
            let resultJSON = response.json();
            this.numOfTables = resultJSON.tableCount;
            this.listOfTables = resultJSON.tableList;
            this.listOfTables.sort();

        });
    }

    selectTable(selectRow) {
       
        if (selectRow < this.numOfTables) {
            this.showTableList = 'collapse';
            this.currentTable = this.listOfTables[selectRow];
            this.listedTable = this.currentTable;
            this.fourD.call4DRESTMethod('REST_GetFieldsInTable',{TableName:this.listOfTables[selectRow]})
            .subscribe(response => {
                let resultJSON = response.json();
                this.listOfFields = resultJSON.fieldList;

                this.model.prototype.tableName = this.currentTable;
                this.model.prototype.fields = <any>this.listOfFields;
                this.model.prototype.primaryKey_ = resultJSON.primaryKey;

                // set default columns
                this.listOfColumns = [];
                this.relatedOneTables = [this.currentTable];
                this.queryData = {};
                for (var index = 0; index < this.listOfFields.length; index++) {
                    var element = this.listOfFields[index];
                    element.index = index;
                    element.field = element.longname;
                    element.title = element.name;
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

                this.showFieldList = 'visible';
            });
           
        }
    }

    selectField(index) {
        this.selectedFieldIndex = index;
        console.log('itemtap: '+this.selectedFieldIndex);
    }

    selectColumn(index) {
        if (index >= 0 && index < this.listOfColumns.length) {
            this.selectedColumnIndex = index;
            this.selectedColumn = this.listOfColumns[index]
            console.log('column:'+this.selectedColumnIndex+', field:'+this.selectedColumn.name);
        } else {
            this.selectedColumnIndex = -1;
        }
    }

    itemReordered(event) {
        timer.setTimeout( () => {
            event.object.refresh();
            this.selectedColumnIndex = -1;
        }, 50);

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
                if (element.indexed) {
                    element.quickQuery = true;
                } else {
                    element.quickQuery = false;
                }
                this.listOfColumns.push(element);
            }
        }
    }

    removeField() {
        if (this.selectedColumnIndex >= 0) {
            this.listOfColumns.splice(this.selectedColumnIndex,1);
            this.selectedColumnIndex = -1;
            this.selectedColumn = null;
            this.currentField = new FieldDescription();
        }
    }

    mapColumnsToGrid() {
        this.columnDefs = [];
        for (var index = 0; index < this.listOfColumns.length; index++) {
            var element = this.listOfColumns[index];
            this.columnDefs.push({title: element.title, field: element.name});
        }

       // this.theGrid.setColumnConfig(this.columnDefs);
    }

    showRelatedTable(event) {
        this.listedTable = event.target.textContent;
        this.fourD.call4DRESTMethod('REST_GetFieldsInTable',{TableName:this.listedTable})
        .subscribe(response => {
            let resultJSON = response.json();
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

    onNavBtnTap() {
        this.router.navigate(['/back'], { clearHistory: true }); 
    }

}
