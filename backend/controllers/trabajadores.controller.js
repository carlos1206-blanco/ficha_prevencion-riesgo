const Trabajador = require('../models/Trabajador.model');

// GET /api/trabajadores?buscar=texto
// Lista todos los trabajadores, o filtra por texto en nombre/apellido/rut si viene ?buscar=
exports.listar = async (req, res) => {
  try {
    const { buscar } = req.query;
    let filtro = {};

    if (buscar && buscar.trim() !== '') {
      const regex = new RegExp(buscar.trim(), 'i');
      filtro = {
        $or: [
          { 'personal.nombres': regex },
          { 'personal.apellidos': regex },
          { 'personal.rut': regex },
          { 'laboral.cargo': regex },
          { 'laboral.departamento': regex }
        ]
      };
    }

    const trabajadores = await Trabajador.find(filtro).sort({ 'personal.apellidos': 1 });
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar trabajadores', error: error.message });
  }
};

// GET /api/trabajadores/:id
exports.obtenerPorId = async (req, res) => {
  try {
    const trabajador = await Trabajador.findById(req.params.id);
    if (!trabajador) {
      return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    }
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el trabajador', error: error.message });
  }
};

// POST /api/trabajadores
exports.crear = async (req, res) => {
  try {
    const nuevoTrabajador = new Trabajador(req.body);
    const guardado = await nuevoTrabajador.save();
    res.status(201).json(guardado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ mensaje: 'Ya existe un trabajador registrado con ese RUT' });
    }
    res.status(400).json({ mensaje: 'Error al crear el trabajador', error: error.message });
  }
};

// PUT /api/trabajadores/:id
exports.actualizar = async (req, res) => {
  try {
    const actualizado = await Trabajador.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el trabajador', error: error.message });
  }
};

// DELETE /api/trabajadores/:id
exports.eliminar = async (req, res) => {
  try {
    const eliminado = await Trabajador.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Trabajador no encontrado' });
    }
    res.json({ mensaje: 'Trabajador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el trabajador', error: error.message });
  }
};
