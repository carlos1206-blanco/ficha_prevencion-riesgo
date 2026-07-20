import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-formulario-trabajador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-trabajador.component.html',
  styleUrl: './formulario-trabajador.component.css'
})
export class FormularioTrabajadorComponent implements OnInit {
  formulario!: FormGroup;
  idTrabajador: string | null = null;
  esEdicion = false;
  guardando = false;
  error = '';

  aptitudes = ['Pendiente de evaluación', 'Apto', 'Apto con restricciones', 'No apto'];
  tiposContrato = ['Planta', 'Contrata', 'Honorarios', 'Código del Trabajo', 'Otro'];
  tiposLicencia = ['Enfermedad común', 'Accidente laboral', 'Enfermedad profesional', 'Maternal', 'Otra'];
  tiposAccidente = ['Accidente de trabajo', 'Accidente de trayecto', 'Enfermedad profesional', 'Cuasi accidente'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trabajadorService: TrabajadorService
  ) {}

  ngOnInit(): void {
    this.construirFormulario();

    this.idTrabajador = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idTrabajador;

    if (this.esEdicion && this.idTrabajador) {
      this.trabajadorService.obtenerPorId(this.idTrabajador).subscribe({
        next: (t) => this.cargarDatosEnFormulario(t),
        error: () => (this.error = 'No se pudo cargar la ficha para editar.')
      });
    }
  }

  private construirFormulario(): void {
    this.formulario = this.fb.group({
      personal: this.fb.group({
        rut: ['', Validators.required],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        fechaNacimiento: [''],
        direccion: [''],
        comuna: [''],
        telefono: [''],
        correo: [''],
        contactoEmergenciaNombre: [''],
        contactoEmergenciaTelefono: [''],
        contactoEmergenciaRelacion: ['']
      }),
      medico: this.fb.group({
        grupoSanguineo: [''],
        aptitudLaboral: ['Pendiente de evaluación'],
        restricciones: [''],
        fechaUltimoExamen: [''],
        tipoUltimoExamen: [''],
        proximoExamen: [''],
        alergias: this.fb.array([]),
        enfermedadesCronicas: this.fb.array([]),
        licenciasMedicas: this.fb.array([])
      }),
      laboral: this.fb.group({
        cargo: [''],
        departamento: [''],
        jefeDirecto: [''],
        fechaIngreso: [''],
        tipoContrato: ['Contrata'],
        lugarTrabajo: [''],
        riesgosAsociados: this.fb.array([]),
        accidentes: this.fb.array([]),
        capacitaciones: this.fb.array([]),
        entregasEpp: this.fb.array([])
      })
    });
  }

  private cargarDatosEnFormulario(t: Trabajador): void {
    this.formulario.patchValue({
      personal: {
        ...t.personal,
        fechaNacimiento: this.aFechaInput(t.personal.fechaNacimiento)
      },
      medico: {
        grupoSanguineo: t.medico?.grupoSanguineo || '',
        aptitudLaboral: t.medico?.aptitudLaboral || 'Pendiente de evaluación',
        restricciones: t.medico?.restricciones || '',
        fechaUltimoExamen: this.aFechaInput(t.medico?.fechaUltimoExamen),
        tipoUltimoExamen: t.medico?.tipoUltimoExamen || '',
        proximoExamen: this.aFechaInput(t.medico?.proximoExamen)
      },
      laboral: {
        cargo: t.laboral?.cargo || '',
        departamento: t.laboral?.departamento || '',
        jefeDirecto: t.laboral?.jefeDirecto || '',
        fechaIngreso: this.aFechaInput(t.laboral?.fechaIngreso),
        tipoContrato: t.laboral?.tipoContrato || 'Contrata',
        lugarTrabajo: t.laboral?.lugarTrabajo || ''
      }
    });

    (t.medico?.alergias || []).forEach((a) => this.agregarTexto('medico.alergias', a));
    (t.medico?.enfermedadesCronicas || []).forEach((e) => this.agregarTexto('medico.enfermedadesCronicas', e));
    (t.medico?.licenciasMedicas || []).forEach((l) =>
      this.agregarLicencia({ ...l, fechaInicio: this.aFechaInput(l.fechaInicio), fechaTermino: this.aFechaInput(l.fechaTermino) })
    );

    (t.laboral?.riesgosAsociados || []).forEach((r) => this.agregarTexto('laboral.riesgosAsociados', r));
    (t.laboral?.accidentes || []).forEach((a) => this.agregarAccidente({ ...a, fecha: this.aFechaInput(a.fecha) }));
    (t.laboral?.capacitaciones || []).forEach((c) =>
      this.agregarCapacitacion({ ...c, fecha: this.aFechaInput(c.fecha), vigenciaHasta: this.aFechaInput(c.vigenciaHasta) })
    );
    (t.laboral?.entregasEpp || []).forEach((e) => this.agregarEpp({ ...e, fechaEntrega: this.aFechaInput(e.fechaEntrega) }));
  }

  private aFechaInput(fecha?: string): string {
    if (!fecha) return '';
    return fecha.substring(0, 10);
  }

  // ---------- Accesores a FormArrays ----------
  arreglo(ruta: string): FormArray {
    return this.formulario.get(ruta) as FormArray;
  }

  // ---------- Listas simples de texto (alergias, enfermedades, riesgos) ----------
  agregarTexto(ruta: string, valor = ''): void {
    this.arreglo(ruta).push(this.fb.control(valor, Validators.required));
  }
  quitarTexto(ruta: string, indice: number): void {
    this.arreglo(ruta).removeAt(indice);
  }

  // ---------- Licencias médicas ----------
  agregarLicencia(valores?: Partial<{ fechaInicio: string; fechaTermino: string; diagnostico: string; diasAutorizados: number; tipo: string; observaciones: string }>): void {
    this.arreglo('medico.licenciasMedicas').push(
      this.fb.group({
        fechaInicio: [valores?.fechaInicio || '', Validators.required],
        fechaTermino: [valores?.fechaTermino || ''],
        diagnostico: [valores?.diagnostico || ''],
        diasAutorizados: [valores?.diasAutorizados ?? null],
        tipo: [valores?.tipo || 'Enfermedad común'],
        observaciones: [valores?.observaciones || '']
      })
    );
  }
  quitarLicencia(i: number): void { this.arreglo('medico.licenciasMedicas').removeAt(i); }

  // ---------- Accidentes ----------
  agregarAccidente(valores?: Partial<{ fecha: string; tipo: string; descripcion: string; parteCuerpoAfectada: string; diasPerdidos: number; organismoAdministrador: string; numeroDenuncia: string }>): void {
    this.arreglo('laboral.accidentes').push(
      this.fb.group({
        fecha: [valores?.fecha || '', Validators.required],
        tipo: [valores?.tipo || 'Accidente de trabajo'],
        descripcion: [valores?.descripcion || ''],
        parteCuerpoAfectada: [valores?.parteCuerpoAfectada || ''],
        diasPerdidos: [valores?.diasPerdidos ?? 0],
        organismoAdministrador: [valores?.organismoAdministrador || ''],
        numeroDenuncia: [valores?.numeroDenuncia || '']
      })
    );
  }
  quitarAccidente(i: number): void { this.arreglo('laboral.accidentes').removeAt(i); }

  // ---------- Capacitaciones ----------
  agregarCapacitacion(valores?: Partial<{ nombre: string; fecha: string; horas: number; relator: string; entidad: string; vigenciaHasta: string; aprobado: boolean }>): void {
    this.arreglo('laboral.capacitaciones').push(
      this.fb.group({
        nombre: [valores?.nombre || '', Validators.required],
        fecha: [valores?.fecha || '', Validators.required],
        horas: [valores?.horas ?? null],
        relator: [valores?.relator || ''],
        entidad: [valores?.entidad || ''],
        vigenciaHasta: [valores?.vigenciaHasta || ''],
        aprobado: [valores?.aprobado ?? true]
      })
    );
  }
  quitarCapacitacion(i: number): void { this.arreglo('laboral.capacitaciones').removeAt(i); }

  // ---------- Entregas de EPP ----------
  agregarEpp(valores?: Partial<{ elemento: string; fechaEntrega: string; cantidad: number; vidaUtilMeses: number; firmaRecepcion: boolean }>): void {
    this.arreglo('laboral.entregasEpp').push(
      this.fb.group({
        elemento: [valores?.elemento || '', Validators.required],
        fechaEntrega: [valores?.fechaEntrega || '', Validators.required],
        cantidad: [valores?.cantidad ?? 1],
        vidaUtilMeses: [valores?.vidaUtilMeses ?? null],
        firmaRecepcion: [valores?.firmaRecepcion ?? false]
      })
    );
  }
  quitarEpp(i: number): void { this.arreglo('laboral.entregasEpp').removeAt(i); }

  // ---------- Guardar ----------
  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error = 'Revisa los campos obligatorios marcados en rojo.';
      return;
    }

    this.guardando = true;
    this.error = '';
    const datos: Trabajador = this.formulario.value;

    const solicitud$ = this.esEdicion && this.idTrabajador
      ? this.trabajadorService.actualizar(this.idTrabajador, datos)
      : this.trabajadorService.crear(datos);

    solicitud$.subscribe({
      next: (guardado) => this.router.navigate(['/trabajador', guardado._id]),
      error: (err) => {
        this.guardando = false;
        this.error = err?.error?.mensaje || 'Ocurrió un error al guardar la ficha.';
      }
    });
  }

  cancelar(): void {
    if (this.esEdicion && this.idTrabajador) {
      this.router.navigate(['/trabajador', this.idTrabajador]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
