import { Component,Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { FormArray } from '@angular/forms';


@Component({
  selector: 'app-client-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroup, InputGroupAddonModule],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  @Input() client: any ;
  @Input() editingClient: any;
  @Input() saving = false; 
  @Output() save = new EventEmitter <any>();
  
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges) { //SimpleChanges muy útil en fomrularios <-------------revisa
    if (changes['client'] && this.client) {
      this.form = this.formBuilder.group({
        nombre: [this.client.nombre || '', Validators.required],
        dni: [this.client.dni || '', Validators.required],
        Telefono: this.formBuilder.array(
          this.client?.Telefono?.map((t: any) =>
            this.formBuilder.control(t.numero, Validators.required)
          ) || []
        )
      });
    }
  }

  get Telefono() {
    return this.form.get('Telefono') as FormArray;
  }

  addPhone() {
    this.Telefono.push(this.formBuilder.control('', Validators.required));
  }

  removePhone(index: number) {
    this.Telefono.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedClient = {
        ...this.client,
        ...this.form.value,
        Telefono: this.form.value.Telefono.map((num: string, i: number) => {
          const original = this.client.Telefono[i];
          return original
            ? { id: original.id, numero: num } // si ya existía, mando el id
            : { numero: num };                 // si es nuevo, solo número
        })
      };
      this.save.emit(updatedClient);
    }
  }


}
