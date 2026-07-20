import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-lista-trabajadores',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-trabajadores.component.html',
  styleUrl: './lista-trabajadores.component.css'
})
export class ListaTrabajadoresComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  cargando = true;
  error = '';
  textoBusqueda = '';
  idPendienteEliminar: string | null = null;

  private busqueda$ = new Subject<string>();

  constructor(private trabajadorService: TrabajadorService) {}

  ngOnInit(): void {
    this.busqueda$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((texto) => this.trabajadorService.listar(texto))
      )
      .subscribe({
        next: (datos) => { this.trabajadores = datos; this.cargando = false; },
        error: () => { this.error = 'No se pudo conectar con la API.'; this.cargando = false; }
      });

    this.cargarLista();
  }

  cargarLista(): void {
    this.cargando = true;
    this.busqueda$.next(this.textoBusqueda);
  }

  onBusquedaCambia(): void {
    this.cargando = true;
    this.busqueda$.next(this.textoBusqueda);
  }

  confirmarEliminar(id: string): void {
    this.idPendienteEliminar = id;
  }

  cancelarEliminar(): void {
    this.idPendienteEliminar = null;
  }

  eliminar(id: string): void {
    this.trabajadorService.eliminar(id).subscribe({
      next: () => {
        this.trabajadores = this.trabajadores.filter((t) => t._id !== id);
        this.idPendienteEliminar = null;
      },
      error: () => {
        this.error = 'No se pudo eliminar el trabajador.';
        this.idPendienteEliminar = null;
      }
    });
  }

  nombreCompleto(t: Trabajador): string {
    return `${t.personal?.nombres ?? ''} ${t.personal?.apellidos ?? ''}`.trim();
  }
}
