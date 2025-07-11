import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // Importa las rutas que definiste

@NgModule({
  imports: [
    RouterModule.forRoot(routes) // Usa las rutas aquí
  ],
  exports: [RouterModule] // Exporta RouterModule para que funcione en toda la app
})
export class AppRoutingModule {}
