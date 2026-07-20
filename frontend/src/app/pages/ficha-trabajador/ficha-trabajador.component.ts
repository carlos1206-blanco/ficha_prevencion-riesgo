import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-ficha-trabajador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ficha-trabajador.component.html',
  styleUrl: './ficha-trabajador.component.css'
})
export class FichaTrabajadorComponent implements OnInit {
  trabajador: Trabajador | null = null;
  cargando = true;
  error = '';

  constructor(private route: ActivatedRoute, private trabajadorService: TrabajadorService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { return; }

    this.trabajadorService.obtenerPorId(id).subscribe({
      next: (datos) => { this.trabajador = datos; this.cargando = false; },
      error: () => { this.error = 'No se pudo cargar la ficha del trabajador.'; this.cargando = false; }
    });
  }

  nombreCompleto(): string {
    if (!this.trabajador) return '';
    return `${this.trabajador.personal.nombres} ${this.trabajador.personal.apellidos}`;
  }
}
