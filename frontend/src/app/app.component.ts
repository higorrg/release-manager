import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReleaseService, Release } from './release.service';

const STATUSES = [
  'MR_APROVADO',
  'FALHA_BUILD_TESTE',
  'PARA_TESTE_SISTEMA',
  'REPROVADA_TESTE',
  'APROVADA_TESTE',
  'FALHA_BUILD_PRODUCAO',
  'PARA_TESTE_REGRESSIVO',
  'FALHA_INSTALACAO_ESTAVEL',
  'INTERNO',
  'REVOGADA',
  'REPROVADA_TESTE_REGRESSIVO',
  'APROVADA_TESTE_REGRESSIVO',
  'CONTROLADA',
  'DISPONIVEL'
];

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Releases</h1>
      <button (click)="load()">Load</button>
      <ul>
        @for (release of releases(); track release.id) {
          <li>
            <div>{{ release.productName }} {{ release.version }} - {{ release.status }}</div>
            <select [value]="release.status" (change)="setStatus(release.id, ($event.target as HTMLSelectElement).value)">
              @for (s of statuses; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
            <div>
              <input
                placeholder="Client Code"
                [value]="clientCodes()[release.id] ?? ''"
                (input)="updateClientCode(release.id, ($event.target as HTMLInputElement).value)" />
              <select
                [value]="clientEnvs()[release.id] ?? 'HOMOLOGACAO'"
                (change)="updateClientEnv(release.id, ($event.target as HTMLSelectElement).value)">
                <option value="HOMOLOGACAO">HOMOLOGACAO</option>
                <option value="PRODUCAO">PRODUCAO</option>
              </select>
              <button (click)="addClient(release.id)">Adicionar Cliente</button>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  #service = inject(ReleaseService);
  releases = signal<Release[]>([]);
  statuses = STATUSES;
  clientCodes = signal<Record<string, string>>({});
  clientEnvs = signal<Record<string, string>>({});

  load(): void {
    this.#service.listAvailable('client', 'HOMOLOGACAO').subscribe(r => this.releases.set(r));
  }

  setStatus(id: string, status: string): void {
    this.#service.updateStatus(id, status).subscribe(() => this.load());
  }

  updateClientCode(id: string, code: string): void {
    this.clientCodes.update(c => ({ ...c, [id]: code }));
  }

  updateClientEnv(id: string, env: string): void {
    this.clientEnvs.update(e => ({ ...e, [id]: env }));
  }

  addClient(id: string): void {
    const code = this.clientCodes()[id];
    const env = this.clientEnvs()[id];
    if (code && env) {
      this.#service.addClient(id, code, env).subscribe(() => {
        this.load();
        this.updateClientCode(id, '');
      });
    }
  }
}
