import { StoreConfig } from './../../../models/store.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../services/store.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-store-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-config.component.html'
})
export class StoreConfigComponent implements OnInit {
  isLoading = true;
  isSaving = false;

  config: StoreConfig = {
    zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '', complement: '', melhorEnvioToken: ''
  };

  ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  constructor(
    private storeService: StoreService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Carregar dados atuais da loja
    this.storeService.getMyStore().subscribe({
      next: (data: any) => {
        // Se a loja já tiver dados, preenche
        if (data) {
           this.config = {
             zipCode: data.zipCode || '',
             street: data.street || '',
             number: data.number || '',
             complement: data.complement || '',
             neighborhood: data.neighborhood || '',
             city: data.city || '',
             state: data.state || '',
             melhorEnvioToken: data.melhorEnvioToken || ''
           };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  buscarCep() {
    const cep = this.config.zipCode.replace(/\D/g, '');
    if (cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((res: any) => {
        if (!res.erro) {
          this.config.street = res.logradouro;
          this.config.neighborhood = res.bairro;
          this.config.city = res.localidade;
          this.config.state = res.uf;
        }
      });
    }
  }

onSubmit() {
    this.isSaving = true;

    // 1. Criar uma cópia do objeto para não estragar a visualização na tela
    const payload = { ...this.config };

    // 2. Limpar o CEP (remover tudo que não for número)
    // Se o usuário digitou 24445-300, vira 24445300
    if (payload.zipCode) {
      payload.zipCode = payload.zipCode.replace(/\D/g, '');
    }

    // 3. Garantir que campos opcionais vazios vão como null ou string vazia
    // (Opcional, mas boa prática)

    this.storeService.updateConfig(payload).subscribe({
      next: () => {
        alert('Configurações salvas com sucesso!');
        this.isSaving = false;
      },
      error: (err) => {
        console.error(err); // Olhe o console para ver o array de erros!

        // Tenta mostrar mensagem específica se o backend mandar
        const msg = err.error?.errors?.[0]?.defaultMessage || err.error?.message || 'Erro desconhecido';
        alert('Erro ao salvar: ' + msg);

        this.isSaving = false;
      }
    });
  }
}
