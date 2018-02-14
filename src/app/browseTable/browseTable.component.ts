import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FourDInterface, FourDModel, FourDCollection } from 'js44d';
import { DataGrid } from 'js44d';
import { RecordList } from 'js44d';
import { Modal } from 'js44d';
import { ModalConfig } from 'js44d';
import { ICustomModalComponent } from 'js44d';
import { ModalDialogInstance } from 'js44d';

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
    length?: number;
    field?: string;
    title?: string;
    quickQuery?: boolean;
}


@Component({
    moduleId: module.id,
    selector: 'sd-browse-table',
    templateUrl: 'browseTable.component.html',
    styleUrls: ['browseTable.component.css'],
    providers: [HttpClient, FourDInterface, Modal]
})


export class BrowseTableComponent implements ICustomModalComponent, AfterContentInit {
    public static dialogConfig: ModalConfig = <ModalConfig>{
        actions: ['Maximize', 'Minimize', 'Close'], position: { top: 100, left: 50 }, selfCentered: true,
        title: 'Browse Table',
        isResizable: true,
        width: 1200, height: 800, minWidth: 1200, minHeight: 700
    };

    public dialog: ModalDialogInstance;

    @Input() numOfTables = 0;
    @Input() listOfTables: Array<string> = [];
    @Input() currentTable = '';
    @Input() listedTable = '';
    @Input() listOfFields: Array<FieldDescription> = [];
    @Input() listOfColumns: Array<FieldDescription> = [];
    @Input() relatedOneTables: Array<string> = [];
    @Input() currentField: FieldDescription = new FieldDescription();

    @Input() queryData: any = {};

    @Input() hideBrowseConfig = false;
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
        { title: 'Record ID', field: 'RecordID', width: '' }
    ];

    //
    // Declare Datagrid properties
    //
    public model = FourDModel; // the record datamodel to use 


    private selectedRow: any = null;
    private selectedColumn: any = null;
    private selectedColumnIndex = -1;

    private totalRecordCount = 0;
    private models = [];

    constructor(private http:HttpClient, private fourD: FourDInterface, private modal: Modal, private viewref: ViewContainerRef) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables', {})
            .subscribe(resultJSON => {
                this.numOfTables = resultJSON.tableCount;
                this.listOfTables = resultJSON.tableList;
                this.listOfTables.sort();
                this.recordList.queryBand.switchState();
            });
    }

    hideConfig() {
        this.hideBrowseConfig = true;
        this.currentGridHeight = 'calc(100% - 30px)';
        this.recordList.theGrid.resize();
        this.recordList.refreshGrid();
    }

    showConfig() {
        this.hideBrowseConfig = false;
        this.currentGridHeight = 'calc(100% - 330px)';
        this.recordList.theGrid.resize();
        this.recordList.refreshGrid();
    }

    saveConfig() {
        if (this.currentTable !== '') {
            localStorage.setItem('4Dbrowse' + this.currentTable, JSON.stringify(this.listOfColumns));
        }
    }

    loadConfig() {
        if (this.currentTable !== '') {
            const config = localStorage.getItem('4Dbrowse' + this.currentTable);
            if (config && config !== '') {
                // we have a saved configuration, use it...
                this.listOfColumns = JSON.parse(config);
                this.mapColumnsToGrid(); // update grid then
            }
        }
    }

    selectTable(event) {
        if (this.selectedRow) {
            this.selectedRow.classList.remove('selectedItem');
        }

        const selectRow = event.currentTarget.rowIndex;
        if (selectRow < this.numOfTables) {
            this.selectedRow = event.target;
            this.currentTable = this.listOfTables[selectRow];
            this.listedTable = this.currentTable;
            this.fourD.call4DRESTMethod('REST_GetFieldsInTable', { TableName: this.listOfTables[selectRow] })
                .subscribe(resultJSON => {
                    this.listOfFields = resultJSON.fieldList;
                    this.selectedRow.classList.add('selectedItem');

                    this.model.prototype.tableName = this.currentTable;
                    this.model.prototype.fields = <any>this.listOfFields;
                    this.model.prototype.primaryKey_ = resultJSON.primaryKey;

                    // set default columns
                    this.listOfColumns = [];
                    this.relatedOneTables = [this.currentTable];
                    this.queryData = {};
                    for (let index = 0; index < this.listOfFields.length; index++) {
                        const element = this.listOfFields[index];
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
        event.dataTransfer.setData('type', type);
        event.dataTransfer.setData('row', event.currentTarget.rowIndex);
    }

    allowDrop(event) {
        if (event.preventDefault) { event.preventDefault(); } // Necessary. Allows us to drop.
        if (event.stopPropagation) { event.stopPropagation(); }


        if (event.type === 'dragenter') {
            event.target.classList.add('droppable');
            event.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
        }
        return false;
    }

    disableDrop(event) {
        if (event.stopPropagation) { event.stopPropagation(); }
        event.target.classList.remove('droppable');
    }

    handleDrop(event) {
        if (event.stopPropagation) { event.stopPropagation(); }

        this.disableDrop(event);

        const source = event.dataTransfer.getData('type');
        const row = event.dataTransfer.getData('row');
        const element = this.listOfFields[row];
        element.quickQuery = false;
        if (event.currentTarget.localName === 'tbody') {
            if (source === 'field') {
                this.listOfColumns.push(element);
            } else {
                this.listOfColumns.push(element);
                this.listOfColumns.splice(row, 1);
            }
        } else {
            if (source === 'field') {
                this.listOfColumns.splice(event.currentTarget.rowIndex, 0, element);
            } else {
                const moveToIndex = event.currentTarget.rowIndex;
                const item = this.listOfColumns.splice(row, 1);
                if (row < moveToIndex) {
                    // moving up...
                    this.listOfColumns.splice(event.currentTarget.rowIndex - 1, 0, item[0]);
                } else {
                    // moving down
                    this.listOfColumns.splice(event.currentTarget.rowIndex, 0, item[0]);
                }
            }
        }

        this.mapColumnsToGrid(); // update datagrid columns
    }

    deleteField() {
        if (this.selectedColumnIndex >= 0) {
            this.listOfColumns.splice(this.selectedColumnIndex, 1);
            this.selectedColumnIndex = -1;
            this.selectedColumn = null;
            this.currentField = new FieldDescription();
            this.mapColumnsToGrid();
        }
    }

    mapColumnsToGrid() {
        this.columnDefs = [];
        for (let index = 0; index < this.listOfColumns.length; index++) {
            const element = this.listOfColumns[index];
            this.columnDefs.push({ title: element.title, field: element.name, width: (element['width']) ? element['width'] : '' });
        }

        // this.theGrid.setColumnConfig(this.columnDefs);
        this.theGrid.setExternalDataSource(this.dataSource, this.columnDefs);
        this.recordList.clearQuery(); // clear any previous query
        this.theGrid.loadData(); // and clear the grid
        this.theGrid.gridObject.bind('columnResize', () => { this.saveColumnConfig() });
    }

    showRelatedTable(event) {
        this.listedTable = event.target.textContent;
        this.fourD.call4DRESTMethod('REST_GetFieldsInTable', { TableName: this.listedTable })
            .subscribe(resultJSON => {
                this.listOfFields = resultJSON.fieldList;
                for (let index = 0; index < this.listOfFields.length; index++) {
                    const element = this.listOfFields[index];
                    element.field = element.longname;
                    element.title = element.name;
                    element.quickQuery = false;

                }
            });
    }

    addRecord() {
        const newModel: FourDModel = new FourDModel();
        newModel.tableName = this.currentTable;
        newModel.fields = <any>this.listOfFields;
        newModel.clearRecord();
        this.modal.openInside(<any>this.editWindow, this.viewref, newModel, this.editWindow['dialogConfig']); // open edit dialog

    }

    noTableSelected(): boolean { return this.currentTable === ''; }


    private saveColumnConfig() {
        if (this.currentTable !== '') {
            for (let i = 0; i < this.listOfColumns.length; i++) {
                if (this.theGrid.gridObject.columns[i]['width'] && this.theGrid.gridObject.columns[i]['width'] > 0) {
                    this.listOfColumns[i]['width'] = this.theGrid.gridObject.columns[i]['width'];
                }
            }
        }

    }

    /* tslint:disable */
    // need to disable lint here otw if'll flag variable before method rule, but I'm puting this at the button
    // on purpose, to have it out of the way
    //
    // define the dataSource used to populate/handle the grid's interface to 4D
    //
    private dataSource = new kendo.data.DataSource({
    /* tslint:enabe */
        transport: {
            read: (options: kendo.data.DataSourceTransportOptions) => {
                // console.log(options);
                const newModel: FourDModel = new FourDModel();
                newModel.tableName = this.currentTable;

                const start = (options.data.pageSize && options.data.pageSize > 0) ? options.data.skip : 0;
                const numrecs = (options.data.pageSize && options.data.pageSize > 0) ? options.data.pageSize : -1;
                // now build filter if set
                const filter = [];
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

                const query = this.theGrid.getDataProvider().queryString;

                const body: any = { Username: FourDInterface.currentUser };
                body.TableName = newModel.tableName;
                body.StartRec = start;
                body.NumRecs = numrecs;

                body.QueryString = JSON.stringify(query);
                body.Columns = base64.encode(utf8.encode(JSON.stringify(this.listOfColumns)));

                if (filter.length > 0) { body.FilterOptions = JSON.stringify({ query: filter }); }
                if (orderby) { body.OrderBy = orderby; }


                this.fourD.call4DRESTMethod('REST_GetRecords', body)
                    .subscribe(resultJSON => {
                        this.totalRecordCount = 0;
                        this.models = [];
                        let data = [];
                        if (resultJSON && resultJSON['selected'] && resultJSON['records']) {
                            this.totalRecordCount = resultJSON['selected'];
                            const recList: Array<any> = resultJSON['records'];
                            recList.forEach(record => {
                                const theModel: FourDModel = new FourDModel();
                                theModel.populateModelData(record);
                                this.models.push(theModel);
                                data.push(record);
                            });
                        }

                        this.theGrid.getDataProvider().models = this.models;
                        options.success(data);
                    },
                    error => {
                        console.log('error:' + JSON.stringify(error));

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
                } else { return options; }
            }
        },
        schema: {

            total: (response) => {
                // console.log('total');
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
