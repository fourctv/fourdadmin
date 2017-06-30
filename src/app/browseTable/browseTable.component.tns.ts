import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';

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


    private selectedRow:any = null;
    private selectedColumn:any = null;
    private selectedColumnIndex = -1;

    private totalRecordCount:number = 0;
    private models = [];

    constructor ( private fourD:FourDInterface, /*private logger: LogService,*/ private viewref: ViewContainerRef) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables',{})
        .subscribe(response => {
            let resultJSON = response.json();
            this.numOfTables = resultJSON.tableCount;
            this.listOfTables = resultJSON.tableList;

        });
    }

    hideConfig() {
        this.hideBrowseConfig = true;
        this.currentGridHeight = 'calc(100% - 20px)';
    }

    showConfig() {
        this.hideBrowseConfig = false;
        this.currentGridHeight = 'calc(100% - 320px)';
    }

    selectTable(event) {
        if (this.selectedRow) {
            this.selectedRow.classList.remove('selectedItem');
        }
        
        let selectRow = event.currentTarget.rowIndex;
        if (selectRow < this.numOfTables) {
            this.selectedRow = event.target;
            this.currentTable = this.listOfTables[selectRow];
            this.listedTable = this.currentTable;
            this.fourD.call4DRESTMethod('REST_GetFieldsInTable',{TableName:this.listOfTables[selectRow]})
            .subscribe(response => {
                let resultJSON = response.json();
                this.listOfFields = resultJSON.fieldList;
                this.selectedRow.classList.add('selectedItem');

                this.model.prototype.tableName = this.currentTable;
                this.model.prototype.fields = <any>this.listOfFields;
                this.model.prototype.primaryKey_ = resultJSON.primaryKey;

                // set default columns
                this.listOfColumns = [];
                this.relatedOneTables = [this.currentTable];
                this.queryData = {};
                for (var index = 0; index < this.listOfFields.length; index++) {
                    var element = this.listOfFields[index];
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

                this.mapColumnsToGrid(); // update datagrid columns
            });
           
        }
    }

    selectColumn(event) {
        if (this.selectedColumn) {
            this.selectedColumn.classList.remove('selectedItem');
        }
        
        this.selectedColumnIndex = event.currentTarget.rowIndex;
        if (this.selectedColumnIndex < this.listOfColumns.length) {
            this.selectedColumn = event.target;
            this.selectedColumn.classList.add('selectedItem');
            this.currentField = this.listOfColumns[this.selectedColumnIndex];
        } else {
            this.selectedColumnIndex = -1;
        }
    }


    startDrag(event, type) {
        event.effectAllowed = 'copy';
        event.dataTransfer.setData('type',type);
        event.dataTransfer.setData('row', event.currentTarget.rowIndex);
   }

    allowDrop(event) {
        if (event.preventDefault)  event.preventDefault(); // Necessary. Allows us to drop.
        if (event.stopPropagation)  event.stopPropagation(); 


        if (event.type === 'dragenter') {
            event.target.classList.add('droppable');
            event.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
        }
        return false;    
    }

    disableDrop(event) {
        if (event.stopPropagation)  event.stopPropagation(); 
        event.target.classList.remove('droppable');
    }

    handleDrop(event) {
        if (event.stopPropagation)  event.stopPropagation(); 
        
        this.disableDrop(event);

        let source = event.dataTransfer.getData('type');
        let row = event.dataTransfer.getData('row');
        let element = this.listOfFields[row];
        element.quickQuery = false;
        if (event.currentTarget.localName === 'tbody') {
            //this.logger.debug('append => row:'+row+', from:'+source); 
            if (source === 'field') {
                this.listOfColumns.push(element);
            } else {
                this.listOfColumns.push(element);
                this.listOfColumns.splice(row,1);
            }
        } else {
            //this.logger.debug('move => row:'+row+', before:'+event.currentTarget.rowIndex+', from:'+source); 
            if (source === 'field') {
                this.listOfColumns.splice(event.currentTarget.rowIndex,0,element);
            } else {
                let moveToIndex = event.currentTarget.rowIndex;
                let item = this.listOfColumns.splice(row,1);
                if (row < moveToIndex) {
                    // moving up...
                    this.listOfColumns.splice(event.currentTarget.rowIndex-1,0,item[0]);
                } else {
                    // moving down
                    this.listOfColumns.splice(event.currentTarget.rowIndex,0,item[0]);
                }
            }
        }

        this.mapColumnsToGrid(); // update datagrid columns
    }

    deleteField() {
        if (this.selectedColumnIndex >= 0) {
            this.listOfColumns.splice(this.selectedColumnIndex,1);
            this.selectedColumnIndex = -1;
            this.selectedColumn = null;
            this.currentField = new FieldDescription();
            this.mapColumnsToGrid();
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

   

}
