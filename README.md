# Actividad Grupo 8 - Artificial Intellingence (Crucigrama Web)

Juego interactivo de crucigrama sobre **Inteligencia Artificial** con temática cyberpunk/tecnológica, cronómetro en vivo y tabla de clasificación **Top 10** en tiempo real sincronizada con **Supabase** y desplegable en **Vercel**.

---

## 🚀 Paso 1: Configurar la Base de Datos en Supabase (Gratis)

1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión (con tu cuenta de GitHub o email).
2. Haz clic en **"New Project"** (Nuevo Proyecto):
   - Elige un nombre (ej. `crucigrama-ia`).
   - Define una contraseña para la base de datos.
   - Selecciona la región más cercana (ej. `South America (São Paulo)`).
   - Haz clic en **"Create new project"**.
3. En el panel lateral izquierdo, ve a **SQL Editor** (ícono `>_`).
4. Haz clic en **"New query"**, pega el contenido del archivo [`schema.sql`](schema.sql) y pulsa **Run** (Ejecutar).
   - *Esto creará la tabla `leaderboard`, las políticas de seguridad públicas y los récords iniciales de prueba.*
5. En el menú lateral izquierdo, ve a **Project Settings** (el engranaje ⚙️) &rarr; **API**:
   - Copia la **Project URL** (ej. `https://xyzabcdefg.supabase.co`).
   - Copia la **anon (public) Project API key** (un token largo que empieza con `eyJ...`).
6. Pega ambas claves en el archivo [`supabase-config.js`](supabase-config.js):
   ```javascript
   window.SUPABASE_CONFIG = {
     url: "https://TU-PROYECTO.supabase.co",
     anonKey: "TU-CLAVE-ANON-PUBLICA"
   };
   ```
   *(También puedes ingresarlas directamente desde la web en el botón **"☁️ Supabase Setup"**).*

---

## 🌐 Paso 2: Desplegar en Vercel (Gratis)

### Opción A: Mediante GitHub (Recomendada - Actualizaciones automáticas)
1. Crea un nuevo repositorio en [https://github.com/new](https://github.com/new) (ej. `crucigrama-ia`).
2. Sube los archivos a GitHub con la terminal:
   ```bash
   git add .
   git commit -m "Initial commit - Actividad Grupo 8 Crucigrama"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/crucigrama-ia.git
   git push -u origin main
   ```
3. Entra a [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
4. Haz clic en **"Add New..."** &rarr; **"Project"**.
5. Selecciona tu repositorio `crucigrama-ia` y haz clic en **"Deploy"**.
6. ¡Listo! En 10 segundos Vercel te dará una URL pública (ej. `https://crucigrama-ia.vercel.app`) para compartir con tus compañeros y profesores.

### Opción B: Subir directamente la carpeta a Vercel
1. Ingresa a [https://vercel.com](https://vercel.com).
2. Arrastra la carpeta del proyecto a la pantalla de Vercel o usa el botón de Importar.
3. Haz clic en **Deploy**.

---

## 🎮 Palabras del Crucigrama y Pistas
1. **ARTIFICIAL INTELLIGENCE** — A technology that allows computers to think or do things that previously only people could do.
2. **COMPUTERS** — Machines that process information and perform tasks.
3. **REPETITIVE** — Tasks that are repeated again and again.
4. **ERRORS** — Mistakes or problems in a computer program.
5. **COMMUNICATION** — The exchange of information between people.
6. **INFORMATION** — Facts or knowledge provided or received.
7. **ANALYSIS** — The process of examining something in detail.
8. **ECONOMICS** — The field related to money, production and resources.
9. **CAREERS** — A person's profession or area of work.
10. **TECHNOLOGY** — The use of scientific knowledge to solve problems.
