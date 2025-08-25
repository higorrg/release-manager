import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ReleaseService } from '../../../shared/services/release.service';
import { 
  Release, 
  CreateReleaseRequest, 
  UpdateReleaseRequest,
  ReleasePriority 
} from '../../../shared/models/release.model';

@Component({
  selector: 'app-release-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzDatePickerModule,
    NzTagModule,
    NzSpinModule
  ],
  templateUrl: './release-form.component.html',
  styleUrls: ['./release-form.component.scss']
})
export class ReleaseFormComponent implements OnInit {
  releaseForm!: FormGroup;
  isLoading = this.releaseService.isLoading;
  isEditMode = signal(false);
  releaseId = signal<number | null>(null);
  
  priorityOptions = [
    { label: 'Baixa', value: ReleasePriority.LOW },
    { label: 'Média', value: ReleasePriority.MEDIUM },
    { label: 'Alta', value: ReleasePriority.HIGH },
    { label: 'Crítica', value: ReleasePriority.CRITICAL }
  ];

  constructor(
    private fb: FormBuilder,
    private releaseService: ReleaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'new') {
        this.isEditMode.set(true);
        this.releaseId.set(Number(id));
        this.loadRelease(Number(id));
      }
    });
  }

  private initializeForm(): void {
    this.releaseForm = this.fb.group({
      product: ['', [Validators.required, Validators.maxLength(100)]],
      version: ['', [Validators.required, Validators.maxLength(20)]],
      releaseNotes: ['', [Validators.required, Validators.maxLength(2000)]],
      prerequisites: ['', [Validators.maxLength(2000)]],
      priority: [ReleasePriority.MEDIUM, [Validators.required]],
      scheduledDate: [null],
      tags: [[]]
    });
  }

  private loadRelease(id: number): void {
    this.releaseService.getReleaseById(id).subscribe({
      next: (release) => {
        if (release) {
          this.populateForm(release);
        }
      },
      error: () => {
        this.router.navigate(['/releases']);
      }
    });
  }

  private populateForm(release: Release): void {
    this.releaseForm.patchValue({
      product: release.product,
      version: release.version,
      releaseNotes: release.releaseNotes,
      prerequisites: release.prerequisites,
      priority: release.priority,
      scheduledDate: release.scheduledDate ? new Date(release.scheduledDate) : null,
      tags: release.tags || []
    });
  }

  onSubmit(): void {
    if (this.releaseForm.valid) {
      const formValue = this.releaseForm.value;
      
      if (this.isEditMode()) {
        this.updateRelease(formValue);
      } else {
        this.createRelease(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createRelease(formValue: any): void {
    const createRequest: CreateReleaseRequest = {
      product: formValue.product,
      version: formValue.version,
      releaseNotes: formValue.releaseNotes,
      prerequisites: formValue.prerequisites,
      priority: formValue.priority,
      scheduledDate: formValue.scheduledDate,
      tags: formValue.tags
    };

    this.releaseService.createRelease(createRequest).subscribe({
      next: (release) => {
        this.router.navigate(['/releases', release.id]);
      }
    });
  }

  private updateRelease(formValue: any): void {
    const updateRequest: UpdateReleaseRequest = {
      product: formValue.product,
      version: formValue.version,
      releaseNotes: formValue.releaseNotes,
      prerequisites: formValue.prerequisites,
      priority: formValue.priority,
      scheduledDate: formValue.scheduledDate,
      tags: formValue.tags
    };

    this.releaseService.updateRelease(this.releaseId()!, updateRequest).subscribe({
      next: () => {
        this.router.navigate(['/releases', this.releaseId()]);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.releaseForm.controls).forEach(key => {
      const control = this.releaseForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/releases', this.releaseId()]);
    } else {
      this.router.navigate(['/releases']);
    }
  }

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.releaseForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.releaseForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      product: 'Produto',
      version: 'Versão',
      releaseNotes: 'Notas da Release',
      prerequisites: 'Pré-requisitos',
      priority: 'Prioridade'
    };
    return labels[fieldName] || fieldName;
  }
}