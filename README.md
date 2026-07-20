# Fichas de Trabajadores — Departamento de Prevención de Riesgos

Aplicación web para gestionar las fichas de los trabajadores del municipio, organizadas en tres tarjetas por trabajador: **Datos Personales**, **Datos Médicos** y **Datos Laborales** (incluye accidentes, licencias médicas, capacitaciones y entrega de EPP). Permite buscar, agregar, editar y eliminar fichas.

## Arquitectura

```
prevencion-riesgos/
├── backend/     → API REST (Node.js + Express + Mongoose) conectada a MongoDB Atlas
└── frontend/    → Aplicación Angular (standalone components)
```

**Importante:** Angular corre en el navegador del usuario, por lo que **no puede conectarse directamente a MongoDB Atlas** (sería inseguro, expondría tus credenciales). Por eso este proyecto incluye una API intermedia en `backend/` que es la única que habla con la base de datos. El frontend solo consume esa API.

> Nota: la antigua "Atlas Data API" de MongoDB (que permitía llamadas HTTP directas a la base de datos) fue **descontinuada por MongoDB el 30 de septiembre de 2025**, por eso este proyecto usa el enfoque recomendado actualmente: una API propia con Express.

---

## 1. Configurar MongoDB Atlas

1. Crea una cuenta gratuita en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) si no tienes una.
2. Crea un **Cluster** (el nivel gratuito M0 es suficiente para partir).
3. En **Database Access**, crea un usuario de base de datos con contraseña.
4. En **Network Access**, agrega tu IP (o `0.0.0.0/0` para permitir acceso desde cualquier lugar mientras desarrollas; restringe esto en producción).
5. En tu Cluster, haz clic en **Connect → Drivers**, elige Node.js y copia la cadena de conexión. Se ve así:
   ```
   mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Reemplaza `<password>` por la contraseña real y agrega el nombre de la base de datos antes del `?`, por ejemplo `.../prevencion_riesgos?retryWrites=true...`.

---

## 2. Ejecutar el backend (API)

```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` y pega tu cadena de conexión real en `MONGODB_URI`.

```bash
npm run dev
```

La API quedará disponible en `http://localhost:3000/api`. Puedes probar que funciona visitando `http://localhost:3000/api/salud`.

### Endpoints disponibles

| Método | Ruta                        | Descripción                                  |
|--------|-----------------------------|-----------------------------------------------|
| GET    | `/api/trabajadores`         | Lista todos (admite `?buscar=texto`)          |
| GET    | `/api/trabajadores/:id`     | Obtiene un trabajador por ID                  |
| POST   | `/api/trabajadores`         | Crea un nuevo trabajador                      |
| PUT    | `/api/trabajadores/:id`     | Actualiza un trabajador existente             |
| DELETE | `/api/trabajadores/:id`     | Elimina un trabajador                         |

---

## 3. Ejecutar el frontend (Angular)

En otra terminal:

```bash
cd frontend
npm install
npm start
```

Esto abre la app en `http://localhost:4200`, ya conectada a la API local (revisa `src/environments/environment.ts` si cambias el puerto del backend).

---

## 4. Publicar en GitHub

Desde la carpeta raíz del proyecto (`prevencion-riesgos/`):

```bash
git init
git add .
git commit -m "Primera versión: fichas de trabajadores - Prevención de Riesgos"
```

Luego, en GitHub, crea un repositorio nuevo (vacío, sin README) y sigue las instrucciones que te da para conectar tu repo local:

```bash
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
git branch -M main
git push -u origin main
```

Los archivos `.env` **no se subirán** porque están en `.gitignore` (contienen tu contraseña de MongoDB, así que eso es intencional). Cualquiera que clone el repo deberá crear su propio `.env` a partir de `.env.example`.

---

## 5. Poner la app en producción (opcional)

Cuando quieras que otros funcionarios accedan sin que tu computador esté prendido:

- **Backend:** despliega la carpeta `backend/` en un servicio como Render, Railway o Fly.io (todos tienen plan gratuito/económico). Ahí configuras la variable de entorno `MONGODB_URI` en el panel del servicio, no en un archivo.
- **Frontend:** despliega la carpeta `frontend/` (build de producción) en Vercel, Netlify o GitHub Pages. Antes de compilar, actualiza `src/environments/environment.prod.ts` con la URL real de tu backend ya desplegado, y compila con:
  ```bash
  npm run build -- --configuration production
  ```

---

## 6. Próximos pasos sugeridos

- **Autenticación**: hoy la app no tiene login. Cuando quieras restringir el acceso (importante por ser datos médicos, que son datos sensibles según la Ley 19.628), se puede agregar login con usuario/contraseña o con la cuenta institucional.
- **Roles**: por ejemplo, que solo Prevención de Riesgos vea la ficha médica completa, y otros funcionarios solo vean datos laborales.
- **Respaldos**: MongoDB Atlas permite configurar backups automáticos del cluster.
- **Exportar a PDF**: generar la ficha de un trabajador en PDF para adjuntar a memorándums u oficios.

---

## Stack técnico

- **Frontend:** Angular 18 (standalone components, Reactive Forms, Angular Router)
- **Backend:** Node.js + Express + Mongoose
- **Base de datos:** MongoDB Atlas (documentos JSON/BSON)
