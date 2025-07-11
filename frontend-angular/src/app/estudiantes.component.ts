import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';

interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
  carreraId: number;
}

interface Carrera {
  id: number;
  nombre: string;
  duracion: number;
}

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="crud-container">
      <!-- Indicador de carga -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        Cargando...
      </div>

      <div class="header">
        <h2 class="text-2xl font-bold">Gestión de Estudiantes</h2>
        <button 
          type="button" 
          (click)="toggleForm()" 
          class="btn-primary"
          [disabled]="isLoading">
          <span class="icon">{{ mostrarForm ? '✕' : '+' }}</span>
          {{ mostrarForm ? 'Cancelar' : 'Agregar Estudiante' }}
        </button>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Formulario (solo visible cuando se solicita) -->
      <div *ngIf="mostrarForm" class="form-container">
        <form [formGroup]="estudianteForm" (ngSubmit)="guardar()" class="crud-form">
          <div class="form-group">
            <input 
              formControlName="nombre" 
              placeholder="Nombre completo" 
              [class.error]="hasError('nombre')"
              class="form-input" />
            <div *ngIf="hasError('nombre')" class="error-text">
              {{ getErrorMessage('nombre') }}
            </div>
          </div>

          <div class="form-group">
            <input 
              formControlName="email" 
              placeholder="Correo electrónico" 
              type="email"
              [class.error]="hasError('email')"
              class="form-input" />
            <div *ngIf="hasError('email')" class="error-text">
              {{ getErrorMessage('email') }}
            </div>
          </div>

          <div class="form-group">
            <select 
              formControlName="carreraId" 
              [class.error]="hasError('carreraId')"
              class="form-input">
              <option value="" disabled>Selecciona una carrera</option>
              <option *ngFor="let car of carreras" [value]="car.id">{{ car.nombre }}</option>
            </select>
            <div *ngIf="hasError('carreraId')" class="error-text">
              {{ getErrorMessage('carreraId') }}
            </div>
          </div>

          <div class="form-buttons">
            <button 
              type="submit" 
              [disabled]="estudianteForm.invalid || isLoading"
              class="btn-success">
              <span class="icon">{{ editando ? '✓' : '+' }}</span>
              {{ editando ? 'Actualizar' : 'Agregar' }} {{ isLoading ? '...' : '' }}
            </button>
            <button 
              type="button" 
              (click)="cancelar()" 
              class="btn-secondary"
              [disabled]="isLoading">
              <span class="icon">✕</span>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- Tabla -->
      <div class="table-container" *ngIf="estudiantes.length; else noData">
        <table class="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Carrera</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let est of estudiantes">
              <td>
                <span class="student-name">
                  <span class="icon">👤</span>
                  {{ est.nombre }}
                </span>
              </td>
              <td>
                <span class="email-badge">
                  {{ est.email }}
                </span>
              </td>
              <td>
                <span class="carrera-badge">
                  <span class="icon">🎓</span>
                  {{ getCarreraNombre(est.carreraId) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    (click)="editar(est)" 
                    class="btn-edit" 
                    [disabled]="isLoading"
                    title="Editar estudiante">
                    Editar
                  </button>
                  <button 
                    (click)="eliminar(est)" 
                    class="btn-delete" 
                    [disabled]="isLoading"
                    title="Eliminar estudiante">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noData>
        <div class="no-data">
          <div class="icon-large">👥</div>
          <p>No hay estudiantes registrados</p>
          <button 
            type="button" 
            (click)="toggleForm()" 
            class="btn-primary"
            [disabled]="isLoading">
            <span class="icon">+</span>
            Agregar Primer Estudiante
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', sans-serif;
    }

    .crud-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .form-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .crud-form {
      display: grid;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-text {
      color: #ef4444;
      font-size: 0.85rem;
    }

    .form-buttons {
      display: flex;
      gap: 1rem;
    }

    .icon {
      margin-right: 0.5rem;
      font-size: 0.9rem;
    }

    .icon-large {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-success {
      background: #10b981;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-success:hover:not(:disabled) {
      background: #059669;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #4b5563;
    }

    .btn-primary:disabled,
    .btn-success:disabled,
    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #ef4444;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      padding: 0.75rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: white;
    }

    .crud-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .crud-table th,
    .crud-table td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }

    .crud-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }

    .crud-table tbody tr:hover {
      background: #f8fafc;
    }

    .crud-table tbody tr:last-child td {
      border-bottom: none;
    }

    .student-name {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: #1f2937;
    }

    .email-badge {
      display: inline-flex;
      align-items: center;
      background: #f3f4f6;
      color: #4b5563;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .carrera-badge {
      display: inline-flex;
      align-items: center;
      background: #dcfce7;
      color: #166534;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit {
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      transition: background 0.2s;
    }

    .btn-delete {
      background: #ef4444;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      transition: background 0.2s;
    }

    .btn-edit:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-delete:hover:not(:disabled) {
      background: #dc2626;
    }

    .btn-edit:disabled,
    .btn-delete:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .no-data {
      text-align: center;
      color: #6b7280;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .no-data p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .form-buttons {
        flex-direction: column;
      }

      .action-buttons {
        flex-direction: column;
      }

      .crud-table th,
      .crud-table td {
        padding: 0.75rem 0.5rem;
      }

      .student-name,
      .email-badge,
      .carrera-badge {
        font-size: 0.8rem;
      }
    }
  `]
})
export class EstudiantesComponent implements OnInit, OnDestroy {
  estudiantes: Estudiante[] = [];
  carreras: Carrera[] = [];
  estudianteForm: FormGroup;
  editando = false;
  mostrarForm = false;
  errorMessage = '';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.estudianteForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      carreraId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.mostrarForm = false; // Estado inicial claro
    this.cargarCarreras().then(() => {
      this.cargar();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargar() {
    this.isLoading = true;
    this.http.get<Estudiante[]>('/api/estudiantes')
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.estudiantes = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError(err);
          this.cdr.detectChanges();
        }
      });
  }

  cargarCarreras(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<Carrera[]>('/api/carreras')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.carreras = data;
            resolve();
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.handleError(err);
            reject(err);
            this.cdr.markForCheck();
          }
        });
    });
  }

  toggleForm() {
    this.ngZone.run(() => {
      this.mostrarForm = !this.mostrarForm;
      if (!this.mostrarForm) {
        this.reset();
      }
      this.cdr.markForCheck();
    });
  }

  guardar() {
    if (this.estudianteForm.invalid) return;

    this.isLoading = true;
    const formValue = this.estudianteForm.value;
    
    const estudiante: Estudiante = {
      ...formValue,
      carreraId: Number(formValue.carreraId)
    };

    const request$: Observable<Estudiante> = this.editando
      ? this.http.put<Estudiante>(`/api/estudiantes/${estudiante.id}`, estudiante)
      : this.http.post<Estudiante>('/api/estudiantes', estudiante);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.cargar();
          this.reset();
          this.mostrarForm = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError(err);
          this.cdr.detectChanges();
        }
      });
  }

  editar(est: Estudiante) {
    this.ngZone.run(() => {
      this.estudianteForm.patchValue({
        id: est.id,
        nombre: est.nombre,
        email: est.email,
        carreraId: est.carreraId
      });
      this.editando = true;
      this.mostrarForm = true;
      this.cdr.markForCheck();
    });
  }

  eliminar(est: Estudiante) {
    if (!est.id) return;

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al estudiante "${est.nombre}"?`);
    if (!confirmacion) return;
    
    this.isLoading = true;
    this.http.delete(`/api/estudiantes/${est.id}`)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => this.cargar(),
        error: (err) => {
          this.handleError(err);
          this.cdr.detectChanges();
        }
      });
  }

  cancelar() {
    this.ngZone.run(() => {
      this.reset();
      this.mostrarForm = false;
      this.cdr.markForCheck();
    });
  }

  reset() {
    this.estudianteForm.reset();
    this.editando = false;
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  getCarreraNombre(id: number): string {
    const carrera = this.carreras.find(c => c.id === Number(id));
    return carrera?.nombre ?? 'Desconocida';
  }

  hasError(controlName: string): boolean {
    const control = this.estudianteForm.get(controlName);
    return !!control?.invalid && (control?.dirty || control?.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.estudianteForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return 'Mínimo 2 caracteres';
    return 'Error desconocido';
  }

  private handleError(err: any) {
    this.errorMessage = err.error?.errors?.map((e: any) => e.msg).join(' | ') ||
      err.error?.error ||
      'Error inesperado';
    this.cdr.markForCheck();
  }
}