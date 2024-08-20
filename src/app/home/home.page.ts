import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { IonHeader, IonToolbar, IonTitle, IonLabel, IonItem, IonList, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, IonInput, IonText, IonContent } from "@ionic/angular/standalone";

interface Cliente {
  nome: string;
  cpf: string;
  dataNascimento: string; 
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonText, IonInput, IonButton, IonCard, IonCardHeader, ReactiveFormsModule, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonHeader, NgxMaskDirective],
  providers: [provideNgxMask()]
})

export class HomePage {
  clienteForm: FormGroup;
  clientes: Cliente[] = [];

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, this.validaCPF]],
      dataNascimento: ['', Validators.required]
    });
  }

  validaCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, '');
    if (cpf.length !== 11 || this.isCpfInvalid(cpf)) {
      return { cpfInvalido: true };
    }
    return null;
  }

  isCpfInvalid(cpf: string): boolean {
    let soma = 0;
    let resto;

    if (/^(\d)\1{10}$/.test(cpf)) return true;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return true;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return true;

    return false;
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const novoCliente: Cliente = {
        nome: this.clienteForm.value.nome,
        cpf: this.clienteForm.value.cpf,
        dataNascimento: this.clienteForm.value.dataNascimento
      };

      this.clientes.push(novoCliente); 
      this.clienteForm.reset(); 
    } else {
      console.log('Formulário inválido');
    }
  }
}