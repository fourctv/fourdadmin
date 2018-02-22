import { Component, AfterContentInit, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { action, confirm } from 'tns-core-modules/ui/dialogs';
import * as appSettings from 'tns-core-modules/application-settings';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { BrowseQueryBand } from './browseQuery.component';
import { BrowseFormDialog } from './browseFormDialog.component';
import { BrowseFieldDialog } from './browseFieldDialog.component';

import { FourDInterface, FourDModel, FourDCollection, Base64, Utf8 } from 'js44d';

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
    title?: string;
    quickQuery?: boolean;
    index?: number;
    width?: string;
}


@Component({
    moduleId: module.id,
    selector: 'sd-browse-table',
    templateUrl: 'browseTable.component.html',
    styleUrls: ['browseTable.component.css'],
})


export class BrowseTableComponent implements AfterContentInit {

    @Input() numOfTables = 0;
    @Input() listOfTables: Array<string> = [];
    @Input() showTableList = 'visible';
    @Input() showFieldList = 'collapse';
    @Input() showBrowse = 'collapse';
    @Input() currentTable = '';
    @Input() listedTable = '';
    @Input() listOfFields: Array<FieldDescription> = [];
    @Input() listOfColumns: Array<FieldDescription> = [];
    @Input() displayListOfColumns: ObservableArray<FieldDescription> = new ObservableArray([]);
    @Input() relatedOneTables: Array<string> = [];
    @Input() currentField: FieldDescription = new FieldDescription();

    @Input() queryString: any = {};

    @Input() public recordList: Array<FourDModel> = [];
    @Input() public totalRecordCount = 0;


    // the columns for the datagrid
    @Input() public columnWidths = '';

    private previousQueryData: any = {};

    //
    // Declare Datagrid properties
    //
    public model = FourDModel; // the record datamodel to use 

    public selectedFieldIndex = -1;
    public selectedColumnIndex = -1;
    public selectedRecordIndex = -1;

    private selectedRow: any = null;
    private selectedColumn: any = null;


    constructor(private fourD: FourDInterface, private router: RouterExtensions, private viewref: ViewContainerRef, private modalService: ModalDialogService) {

    }

    ngAfterContentInit() {
        this.fourD.call4DRESTMethod('REST_GetListOfTables', {})
            .subscribe(resultJSON => {
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
            this.fourD.call4DRESTMethod('REST_GetFieldsInTable', { TableName: this.listOfTables[selectRow] })
                .subscribe(resultJSON => {
                    this.listOfFields = resultJSON.fieldList;

                    this.model.prototype.tableName = this.currentTable;
                    this.model.prototype.fields = <any>this.listOfFields;
                    this.model.prototype.primaryKey_ = resultJSON.primaryKey;

                    // set default columns
                    this.listOfColumns = [];
                    this.relatedOneTables = [this.currentTable];
                    this.queryString = { query: ['All'] };
                    for (let index = 0; index < this.listOfFields.length; index++) {
                        const element = this.listOfFields[index];
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
                    this.previousQueryData = {};
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
        this.listOfColumns = this.displayListOfColumns.filter(() => { return true });
    }

    addField() {
        if (this.selectedFieldIndex >= 0) {
            const element = this.listOfFields[this.selectedFieldIndex];
            let dupe = false;
            this.listOfColumns.forEach(column => {
                if (column.name === element.name) { dupe = true; }
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
            this.listOfColumns.splice(this.selectedColumnIndex, 1);
            this.selectedColumnIndex = -1;
            this.selectedColumn = null;
            this.currentField = new FieldDescription();
            this.displayListOfColumns = new ObservableArray(this.listOfColumns);
        }
    }

    editField() {
        if (this.selectedColumnIndex >= 0) {
            const options: ModalDialogOptions = {
                viewContainerRef: this.viewref,
                context: { field: this.listOfColumns[this.selectedColumnIndex] }
            };

            this.modalService.showModal(BrowseFieldDialog, options);

        }
    }

    selectRelatedTable() {
        const options = {
            title: 'Select Related Table',
            message: 'Related One Tables',
            cancelButtonText: 'Cancel',
            actions: this.relatedOneTables
        };

        action(options).then((result) => {
            this.showRelatedTable(result);
        });
    }

    showRelatedTable(relatedTable) {
        this.listedTable = relatedTable;
        this.fourD.call4DRESTMethod('REST_GetFieldsInTable', { TableName: this.listedTable })
            .subscribe(resultJSON => {
                this.listOfFields = resultJSON.fieldList;
                for (let index = 0; index < this.listOfFields.length; index++) {
                    const element = this.listOfFields[index];
                    element.index = index;
                    element.field = element.longname;
                    element.title = element.name;
                    element.width = '100';
                    element.quickQuery = false;
                }
            });
    }

    handleConfig() {
        const options = {
            title: 'Browse Configuration',
            okButtonText: 'Cancel',
            cancelButtonText: 'Save',
            neutralButtonText: 'Load'
        };

        confirm(options).then((result: boolean) => {
            switch (result) {
                case undefined:
                    this.loadConfig()
                    break;

                case false:
                    this.saveConfig();
                    break;
            }
        });
    }

    saveConfig() {
        if (this.currentTable !== '') {
            appSettings.setString('4Dbrowse' + this.currentTable, JSON.stringify(this.listOfColumns));
        }
    }

    loadConfig() {
        if (this.currentTable !== '') {
            const config = appSettings.getString('4Dbrowse' + this.currentTable);
            if (config && config !== '') {
                // we have a saved configuration, use it...
                this.listOfColumns = JSON.parse(config);
                this.displayListOfColumns = new ObservableArray(this.listOfColumns);
            }
        }
    }

    doBrowse() {
        this.columnWidths = '';
        for (let i = 0; i < this.listOfColumns.length; i++) {
            if (i === 0) {
                this.columnWidths = this.listOfColumns[i].width;
            } else {
                this.columnWidths += ',' + this.listOfColumns[i].width;
            }
        }
        this.showTableList = 'collapse';
        this.showFieldList = 'collapse';
        this.showBrowse = 'visible';
        this.showQuery();
    }

    showQuery() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewref,
            context: { table: this.currentTable, queryFields: this.listOfColumns, previousQuery: this.previousQueryData }
        };

        this.modalService.showModal(BrowseQueryBand, options)
            .then(queryResult => {
                this.queryString = queryResult.currentQuery;
                this.previousQueryData = queryResult.queryData;
                this.runQuery();
            });
    }

    runQuery() {
        const body: any = { Username: FourDInterface.currentUser };
        body.TableName = this.currentTable;
        body.StartRec = 0;
        body.NumRecs = -1;

        body.QueryString = JSON.stringify(this.queryString);
        body.Columns = Base64.encode(Utf8.utf8encode(JSON.stringify(this.listOfColumns)));

        body.FilterOptions = '';
        body.OrderBy = '';


        this.fourD.call4DRESTMethod('REST_GetRecords', body)
            .subscribe(resultJSON => {
                this.totalRecordCount = 0;
                this.recordList = [];

                if (resultJSON && resultJSON['selected'] && resultJSON['records']) {
                    this.totalRecordCount = resultJSON['selected'];
                    const recList: Array<any> = resultJSON['records'];
                    recList.forEach(record => {
                        const newModel: FourDModel = new FourDModel();
                        newModel.populateModelData(record);
                        this.recordList.push(newModel);
                    });
                }

            },
            error => {
                console.log('error:' + JSON.stringify(error));

            });

    }

    showRecord(index) {
        const rec: FourDModel = this.recordList[index];
        rec.tableName = this.currentTable;
        rec.fields = this.model.prototype.fields;
        rec.refresh()
            .then(() => {
                const options: ModalDialogOptions = {
                    viewContainerRef: this.viewref,
                    context: { tableName: this.currentTable, record: rec, fieldList: this.model.prototype.fields }
                };

                this.modalService.showModal(BrowseFormDialog, options);
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
        } else { this.router.navigate(['/back'], { clearHistory: true }) }

    }

}
