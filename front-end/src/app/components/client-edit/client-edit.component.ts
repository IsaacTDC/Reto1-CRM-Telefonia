import { Component,Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
[x: string]: any;
  @Input() client: any ;
  @Input() editingClient: any;
  @Input() saving = false; 
  @Output() save = new EventEmitter <any>();
  
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges) { //SimpleChanges muy útil en fomrularios <-------------revisa
    if (changes['client'] && this.client) {
      this.form = this.formBuilder.group({
        nombre: [this.client.nombre || '', Validators.required],
        dni: [this.client.dni || '', Validators.required],
        telefonos: this.formBuilder.array(
          this.client?.telefonos?.map((t: any) =>
            this.formBuilder.group({
              id: [t.id || null],
              numero: [t.numero, Validators.required]
            })
          ) || []
        )
      });
    }
  }

  get telefonos() {
    return this.form.get('telefonos') as FormArray;
  }

  addPhone() {
    this.telefonos.push(this.formBuilder.group({ numero: [''] }));
  }

  removePhone(index: number) {
    this.telefonos.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form);
      const updatedClient = { ...this.client, ...this.form.value };
      this.save.emit(updatedClient);
    }
  }


}
