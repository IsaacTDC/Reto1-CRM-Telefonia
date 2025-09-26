import { Component,Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClientsService } from '../../services/clients.service';
import { PhonesService } from '../../services/phones.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-client-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  @Input() client: any ;
  @Output() save = new EventEmitter <any>();
  @Input() saving = false; 
  form!: FormGroup;
  //

  constructor(
    private formBuilder: FormBuilder,
    
  ) {}

  ngOnChanges(changes: SimpleChanges) { //SimpleChanges muy útil en fomrularios <-------------revisa
    if (changes['client'] && this.client) {
      // Reinicializamos formulario cada vez que cambie el cliente
      this.form = this.formBuilder.group({
        nombre: [this.client.nombre || '', Validators.required],
        dni: [this.client.dni || '', Validators.required]
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      //console.log(this.form.value);
      const updatedClient = { ...this.client, ...this.form.value };
      this.save.emit(updatedClient);
    }
  }
}
