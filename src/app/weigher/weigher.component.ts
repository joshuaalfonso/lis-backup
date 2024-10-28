import { Component, OnInit } from "@angular/core";
import { WeigherService } from "./weigher.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { MessageService } from "primeng/api";



@Component({
    selector: 'app-weigher',
    templateUrl: 'weigher.component.html',
    styleUrls: ['weigher.component.css']
})
export class WeigherComponent implements OnInit{

    weigher: any[] = [];

    weigherForm!: FormGroup;

    isLoading!: boolean;

    visible: boolean = false;

    dialogHeader?: string;

    constructor(
        private WeigherService: WeigherService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {

        this.weigherForm = new FormGroup({
            'WeigherID': new FormControl(0),
            'WeigherName': new FormControl(null, Validators.required),
            'UserID': new FormControl(0)
        })
        
        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.WeigherService.getWeigher().subscribe(
            response => {
                this.weigher = response;
                this.isLoading = false;
            }
        )
    }

    showDialog() {
        this.clearForm();
        this.dialogHeader = 'Add Weigher';
        this.visible = true;
    }

    clearForm() {
        this.weigherForm.reset();
        this.weigherForm.patchValue({WeigherID: 0})
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;
        authObs = this.WeigherService.saveData
        (
            this.weigherForm.value.WeigherID,
            this.weigherForm.value.WeigherName,
            this.weigherForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.weigherForm.value.WeigherName +  ' successfully recorded', life: 3000 });
                this.getData();
                this.clearForm();
            } 
            else if ( response === 2) {
                this.MessageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.weigherForm.value.WeigherName +  ' successfully updated', life: 3000 });
                this.getData();
                this.clearForm();
            }
            else if ( response === 0) {
                this.MessageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.weigherForm.value.WeigherName +  ' already exist', life: 3000 });
            }
            
        }, errorMessage => {
            this.MessageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
        });

    }

    onSelect(data: any) {
        this.showDialog();

        this.weigherForm.setValue({
            WeigherID: data.WeigherID,
            WeigherName: data.WeigherName,
            UserID: data.UserID
        })
    }

}

interface ResponseData {

}