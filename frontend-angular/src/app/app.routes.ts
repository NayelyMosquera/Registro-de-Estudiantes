import { Routes } from '@angular/router';
import { EstudiantesComponent } from './estudiantes.component';
import { CarrerasComponent } from './carreras.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'carreras', component: CarrerasComponent },
  { path: '**', redirectTo: '' }
];
