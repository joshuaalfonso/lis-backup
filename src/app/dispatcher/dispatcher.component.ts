import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { DispatcherService } from "./dispatcher.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";



@Component({
    selector: 'app-dispatcher',
    templateUrl: 'dispatcher.component.html',
    styleUrls: ['dispatcher.component.css']
})
export class DispatcherComponent implements OnInit{

    dispatcher: any[] = [];

    dispatcherForm!: FormGroup;

    visible: boolean = false;

    dialogHeader?: string;

    private subscription: Subscription = new Subscription();

    isLoading: boolean = false;

    constructor(
        private DispatcherService: DispatcherService,
        private MessageService: MessageService
    ) {}

    ngOnInit(): void {
        this.dispatcherForm = new FormGroup({
            DispatcherID: new FormControl(0),
            Dispatcher: new FormControl(null, Validators.required),
            UserID: new FormControl(0)
        })

        this.getData();
    }

    getData() {
        this.isLoading = true;
        this.subscription.add(
            this.DispatcherService.getDispatcherData().subscribe(
                response => {
                    this.isLoading = false;
                    this.dispatcher = response;
                }
            )
        )
    }

    showDialog() {
        this.dialogHeader = 'Add Dispatcher';
        this.clearItems();
        this.visible = true;
    }

    clearItems() {
        this.dispatcherForm.reset();
        this.dispatcherForm.patchValue({
            DispatcherID: 0,
            UserID: 0
        })
    }

    onSubmit() {
        let authObs: Observable<ResponseData>;

        authObs = this.DispatcherService.saveData
        (
            this.dispatcherForm.value.DispatcherID,
            this.dispatcherForm.value.Dispatcher,
            this.dispatcherForm.value.UserID
        )

        authObs.subscribe(response =>{

            if( response === 1) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully recorded', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearItems();
            } 
            else if ( response === 2) {
                this.MessageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'Successfully updated', 
                    life: 3000 
                });
                this.visible = false;
                this.getData();
                this.clearItems();
            }
            else if ( response === 0) {
                this.MessageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Item: ' + this.dispatcherForm.value.Dispatcher +  ' already exist', 
                    life: 3000 
                });
            }
            
        }, errorMessage => {
            this.MessageService.add({ 
                severity: 'error', 
                summary: 'Danger', 
                detail: errorMessage, 
                life: 3000 
            });
        });
    }

    onSelect(data: any) {
        this.showDialog();
        this.dispatcherForm.setValue({
            DispatcherID: data.DispatcherID,
            Dispatcher: data.DispatcherName,
            UserID: data.UserID
        })
    }

}

interface ResponseData {

}