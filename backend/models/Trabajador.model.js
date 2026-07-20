const mongoose = require('mongoose');

/**
 * Sub-esquema: Datos Personales
 */
const DatosPersonalesSchema = new mongoose.Schema(
  {
    rut: { type: String, required: true, unique: true, trim: true },
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date },
    direccion: { type: String, trim: true },
    comuna: { type: String, trim: true },
    telefono: { type: String, trim: true },
    correo: { type: String, trim: true },
    contactoEmergenciaNombre: { type: String, trim: true },
    contactoEmergenciaTelefono: { type: String, trim: true },
    contactoEmergenciaRelacion: { type: String, trim: true }
  },
  { _id: false }
);

/**
 * Sub-esquema: Licencias médicas
 */
const LicenciaMedicaSchema = new mongoose.Schema(
  {
    fechaInicio: { type: Date, required: true },
    fechaTermino: { type: Date },
    diagnostico: { type: String, trim: true },
    diasAutorizados: { type: Number },
    tipo: {
      type: String,
      enum: ['Enfermedad común', 'Accidente laboral', 'Enfermedad profesional', 'Maternal', 'Otra'],
      default: 'Enfermedad común'
    },
    observaciones: { type: String, trim: true }
  },
  { timestamps: true }
);

/**
 * Sub-esquema: Datos Médicos
 */
const DatosMedicosSchema = new mongoose.Schema(
  {
    grupoSanguineo: { type: String, trim: true },
    alergias: [{ type: String, trim: true }],
    enfermedadesCronicas: [{ type: String, trim: true }],
    aptitudLaboral: {
      type: String,
      enum: ['Apto', 'Apto con restricciones', 'No apto', 'Pendiente de evaluación'],
      default: 'Pendiente de evaluación'
    },
    restricciones: { type: String, trim: true },
    fechaUltimoExamen: { type: Date },
    tipoUltimoExamen: { type: String, trim: true },
    proximoExamen: { type: Date },
    licenciasMedicas: [LicenciaMedicaSchema]
  },
  { _id: false }
);

/**
 * Sub-esquema: Accidentes laborales
 */
const AccidenteSchema = new mongoose.Schema(
  {
    fecha: { type: Date, required: true },
    tipo: {
      type: String,
      enum: ['Accidente de trabajo', 'Accidente de trayecto', 'Enfermedad profesional', 'Cuasi accidente'],
      default: 'Accidente de trabajo'
    },
    descripcion: { type: String, trim: true },
    parteCuerpoAfectada: { type: String, trim: true },
    diasPerdidos: { type: Number, default: 0 },
    organismoAdministrador: { type: String, trim: true },
    numeroDenuncia: { type: String, trim: true }
  },
  { timestamps: true }
);

/**
 * Sub-esquema: Capacitaciones
 */
const CapacitacionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    fecha: { type: Date, required: true },
    horas: { type: Number },
    relator: { type: String, trim: true },
    entidad: { type: String, trim: true },
    vigenciaHasta: { type: Date },
    aprobado: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/**
 * Sub-esquema: Entrega de EPP (Elementos de Protección Personal)
 */
const EppSchema = new mongoose.Schema(
  {
    elemento: { type: String, required: true, trim: true },
    fechaEntrega: { type: Date, required: true },
    cantidad: { type: Number, default: 1 },
    vidaUtilMeses: { type: Number },
    firmaRecepcion: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/**
 * Sub-esquema: Datos Laborales
 */
const DatosLaboralesSchema = new mongoose.Schema(
  {
    cargo: { type: String, trim: true },
    departamento: { type: String, trim: true },
    jefeDirecto: { type: String, trim: true },
    fechaIngreso: { type: Date },
    tipoContrato: {
      type: String,
      enum: ['Planta', 'Contrata', 'Honorarios', 'Código del Trabajo', 'Otro'],
      default: 'Contrata'
    },
    lugarTrabajo: { type: String, trim: true },
    riesgosAsociados: [{ type: String, trim: true }],
    accidentes: [AccidenteSchema],
    capacitaciones: [CapacitacionSchema],
    entregasEpp: [EppSchema]
  },
  { _id: false }
);

/**
 * Esquema principal: Trabajador
 */
const TrabajadorSchema = new mongoose.Schema(
  {
    personal: { type: DatosPersonalesSchema, required: true },
    medico: { type: DatosMedicosSchema, default: () => ({}) },
    laboral: { type: DatosLaboralesSchema, default: () => ({}) },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Índices para búsqueda rápida
TrabajadorSchema.index({ 'personal.nombres': 'text', 'personal.apellidos': 'text', 'personal.rut': 'text' });

module.exports = mongoose.model('Trabajador', TrabajadorSchema);
