import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MzModalComponent } from 'ng2-materialize'

import { Employee, Dependent, Person } from '../../models';

@Component({
  selector: 'app-dependent-list',
  templateUrl: './dependent-list.component.html',
  styles: ['']
})
export class DependentListComponent implements OnInit {
  @Input() employee: Employee;
  @Output() editingDependent = new EventEmitter<boolean>();
  @ViewChild('dependentForm') dependentForm: MzModalComponent;

  item: Dependent;
  index: number;
  form: FormGroup;
  modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: (modal, trigger) => {
    },
    complete: () => { 
      this.onSave(); 
    }
  };
  constructor(private router: Router,  private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.index = -1;
    this.item = null;
    this.form = this.formBuilder.group({
      givenNameDep: '',
      familyNameDep: ''
    });
  }

  onAddDependent() {
    this.item = new Dependent("", "");
    this.edit();
  }

  onSelected(index: number) {
    this.index = index;
    this.item = this.employee.dependents[index];
    this.edit();
  }

  private edit() {
    this.form = this.formBuilder.group({
      givenNameDep: this.item.givenName,
      familyNameDep: this.item.familyName
    });
    this.dependentForm.open();
    this.editingDependent.emit(true);
  }

  onSave() {
    this.dependentForm.close();
    this.item.givenName = this.form.value.givenNameDep as string;
    this.item.familyName = this.form.value.familyNameDep as string;
    if (this.index === -1) {
      this.employee.addDependent(this.item);
    }
    else {
      this.employee.dependents[this.index] = this.item;
    }
    this.index = -1;
    this.item = null;
    this.editingDependent.emit(false);
  }
}
