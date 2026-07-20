const express = require('express');
const router = express.Router();
const controlador = require('../controllers/trabajadores.controller');

router.get('/', controlador.listar);          // GET    /api/trabajadores  (soporta ?buscar=texto)
router.get('/:id', controlador.obtenerPorId);  // GET    /api/trabajadores/:id
router.post('/', controlador.crear);           // POST   /api/trabajadores
router.put('/:id', controlador.actualizar);    // PUT    /api/trabajadores/:id
router.delete('/:id', controlador.eliminar);   // DELETE /api/trabajadores/:id

module.exports = router;
