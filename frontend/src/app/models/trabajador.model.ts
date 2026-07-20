export interface DatosPersonales {
  rut: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  direccion?: string;
  comuna?: string;
  telefono?: string;
  correo?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  contactoEmergenciaRelacion?: string;
}

export interface LicenciaMedica {
  _id?: string;
  fechaInicio: string;
  fechaTermino?: string;
  diagnostico?: string;
  diasAutorizados?: number;
  tipo?: 'Enfermedad común' | 'Accidente laboral' | 'Enfermedad profesional' | 'Maternal' | 'Otra';
  observaciones?: string;
}

export type AptitudLaboral = 'Apto' | 'Apto con restricciones' | 'No apto' | 'Pendiente de evaluación';

export interface DatosMedicos {
  grupoSanguineo?: string;
  alergias?: string[];
  enfermedadesCronicas?: string[];
  aptitudLaboral?: AptitudLaboral;
  restricciones?: string;
  fechaUltimoExamen?: string;
  tipoUltimoExamen?: string;
  proximoExamen?: string;
  licenciasMedicas?: LicenciaMedica[];
}

export interface Accidente {
  _id?: string;
  fecha: string;
  tipo?: 'Accidente de trabajo' | 'Accidente de trayecto' | 'Enfermedad profesional' | 'Cuasi accidente';
  descripcion?: string;
  parteCuerpoAfectada?: string;
  diasPerdidos?: number;
  organismoAdministrador?: string;
  numeroDenuncia?: string;
}

export interface Capacitacion {
  _id?: string;
  nombre: string;
  fecha: string;
  horas?: number;
  relator?: string;
  entidad?: string;
  vigenciaHasta?: string;
  aprobado?: boolean;
}

export interface EntregaEpp {
  _id?: string;
  elemento: string;
  fechaEntrega: string;
  cantidad?: number;
  vidaUtilMeses?: number;
  firmaRecepcion?: boolean;
}

export interface DatosLaborales {
  cargo?: string;
  departamento?: string;
  jefeDirecto?: string;
  fechaIngreso?: string;
  tipoContrato?: 'Planta' | 'Contrata' | 'Honorarios' | 'Código del Trabajo' | 'Otro';
  lugarTrabajo?: string;
  riesgosAsociados?: string[];
  accidentes?: Accidente[];
  capacitaciones?: Capacitacion[];
  entregasEpp?: EntregaEpp[];
}

export interface Trabajador {
  _id?: string;
  personal: DatosPersonales;
  medico?: DatosMedicos;
  laboral?: DatosLaborales;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
