import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';

//import { LogService } from '../core/services/logging/log.service';

import { FourDInterface } from '../js44D/js44D/JSFourDInterface';
import { FourDModel } from '../js44D/js44D/JSFourDModel';
import { FourDCollection } from '../js44D/js44D/JSFourDCollection';
import { DataGrid } from '../js44D/dataGrid/dataGrid';
import { RecordList } from '../js44D/containers/recordList';
import { Modal } from '../js44D/angular2-modal/providers/Modal';
import { ModalConfig } from '../js44D/angular2-modal/models/ModalConfig';
import { ICustomModalComponent } from '../js44D/angular2-modal/models/ICustomModalComponent';
import { ModalDialogInstance } from '../js44D/angular2-modal/models/ModalDialogInstance';

import { BrowseFormDialog } from './browseFormDialog.component';

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
    providers:[Modal]
})


export class BrowseTableComponent implements ICustomModalComponent, AfterContentInit {
    public static dialogConfig: ModalConfig = <ModalConfig>{
            actions:['Maximize', 'Minimize', 'Close'], position: {top:100, left:50},selfCentered:true,
            title:'Browse Table',
            isResizable:true,
            width:1000, height:800
        };

    public dialog: ModalDialogInstance;

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
    @Input() currentGridHeight = 'calc(100% - 330px)';
    /**
     * get the associated record list object instance
     */
    @ViewChild(RecordList) recordList: RecordList;
    
    // Declare Program edit Window
    //
    public editWindow = BrowseFormDialog;
    /**
     * get the associated Datagrid object instance
     */
    @ViewChild(DataGrid) theGrid: DataGrid;
       
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

    constructor ( private modal: Modal, private fourD:FourDInterface, /*private logger: LogService,*/ private viewref: ViewContainerRef) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables',{})
        .subscribe(response => {
            let resultJSON = response.json();
            this.numOfTables = resultJSON.tableCount;
            this.listOfTables = resultJSON.tableList;

            this.recordList.queryBand.switchState();
        });
    }

    hideConfig() {
        this.hideBrowseConfig = true;
        this.currentGridHeight = 'calc(100% - 30px)';
        this.recordList.windowResized(null)
        this.recordList.refreshGrid();
    }

    showConfig() {
        this.hideBrowseConfig = false;
        this.currentGridHeight = 'calc(100% - 330px)';
        this.recordList.windowResized(null);
        this.recordList.refreshGrid();
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
        this.theGrid.setExternalDataSource(this.dataSource, this.columnDefs);
        this.recordList.clearQuery(); // clear any previous query
        this.theGrid.loadData(); // and clear the grid
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
        this.modal.openInside(<any>this.editWindow, this.viewref, newModel, this.editWindow['dialogConfig']); // open edit dialog

    }

    //
    // define the dataSource used to populate/handle the grid's interface to 4D
    //
    private dataSource = new kendo.data.DataSource({
        transport: {
            read: (options: kendo.data.DataSourceTransportOptions) => {
                //console.log(options);
                let newModel: FourDModel = new FourDModel();
                newModel.tableName = this.currentTable;

                let start = (options.data.pageSize && options.data.pageSize > 0) ? options.data.skip : 0;
                let numrecs = (options.data.pageSize && options.data.pageSize > 0) ? options.data.pageSize : -1;
                // now build filter if set
                let filter = [];
                if (options.data.filter) {

                    options.data.filter.filters.forEach((item: kendo.data.DataSourceFilterItem) => {
                        let comparator = '=';
                        switch (item.operator) {
                            case 'eq':
                                comparator = '=';
                                break;
                            case 'neq':
                                comparator = '#';
                                break;
                            case 'startswith':
                                comparator = 'begins with';
                                break;
                            case 'endswith':
                                comparator = 'ends with';
                                break;
                            case 'isempty':
                                comparator = '=';
                                item.value = '';
                                break;
                            case 'isnotempty':
                                comparator = '#';
                                item.value = '';
                                break;

                            default:
                                comparator = <any>item.operator;
                                break;
                        }
                        filter.push(newModel.tableName + '.' + item.field + ';' + comparator + ';' + item.value + ';' + options.data.filter.logic);
                    });
                }

                let orderby = '';
                if (options.data.sort && options.data.sort.length > 0) {
                    options.data.sort.forEach((item: kendo.data.DataSourceSortItem) => {
                        orderby += (item.dir === 'asc') ? '>' : '<';
                        orderby += newModel.tableName + '.' + item.field + '%';
                    });
                }

                let query = this.theGrid.getDataProvider().queryString;

                let body: any = { Username: FourDInterface.currentUser };
                body.TableName = newModel.tableName;
                body.StartRec = start;
                body.NumRecs = numrecs;

                body.QueryString = JSON.stringify(query);
                body.Columns = base64.encode(utf8.encode(JSON.stringify(this.listOfColumns)));

                if (filter.length > 0) body.FilterOptions = JSON.stringify({query:filter});
                if (orderby) body.OrderBy = orderby;


                let me = this;
                this.fourD.call4DRESTMethod('REST_GetRecords', body)
                    .subscribe(response => {
                        me.totalRecordCount = 0;
                        me.models = [];
                        let jsonData:Object = response.json();
                        /*
                        if (Config.IS_MOBILE_NATIVE()) {
                            // on nativescript
                            jsonData = JSON.parse(jsonData);
                        }
                        */
                        if (jsonData && jsonData['selected'] && jsonData['records']) {
                            me.totalRecordCount = jsonData['selected'];
                            let recList: Array<any> = jsonData['records'];
                            recList.forEach(record => {
                                let newModel: FourDModel = new FourDModel();
                                newModel.populateModelData(record);
                                me.models.push(newModel);
                            });
                        }

                        this.theGrid.getDataProvider().models = me.models;
                        options.success(me.models);
                    },
                    error => {
                        //this.logger.debug('error:' + error.text());
                        console.log('error:' + error.text());

                    });


            },
            destroy: (options) => {
                console.log('delete', options);
            },
            update: (options) => {
                console.log('update', options);
            },
            create: (options) => {
                console.log('create', options);
            },
            parameterMap: (options, operation) => {
                console.log('map', options);
                if (operation !== 'read' && options.models) {
                    return { models: kendo.stringify(options.models) };
                } else return options;
            }
        },
        schema: {

            total: (response) => {
                //console.log('total');
                return this.totalRecordCount;
            }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        serverGrouping: true,
        pageSize: 50
    });

}
