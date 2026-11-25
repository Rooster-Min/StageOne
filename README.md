# StageOne 7.5 — Avatar & Offline Fix

Red social musical independiente, PWA estática. Esta versión es una prueba de interfaz con cuentas Firebase, no una red social multiusuario completa.

## Publicar en GitHub Pages
1. Descomprime el ZIP y sube **el contenido** de la carpeta, con `index.html` en la raíz del repositorio. Conserva `.nojekyll`.
2. Settings → Pages → Deploy from a branch → main / (root) → Save.
3. Abre la URL HTTPS que indique GitHub. En Firebase Authentication → Settings → Authorized domains, añade el dominio de Pages si es necesario (sin ruta).
4. Prueba registro, inicio y cierre de sesión, recuperación de contraseña, perfil, instalación PWA y navegación móvil. Prueba con dos cuentas distintas.

## Alcance y seguridad
- Firebase Authentication y Firestore (`usuarios/{uid}`) para nombre, biografía y rol. Conserva las reglas de acceso por propietario; no habilites acceso global.
- Las publicaciones públicas y sus medios pueden sincronizarse con Firebase. Fotos de perfil, mensajes, historias, playlists, seguidores, reportes y estadísticas siguen locales.
- No se incluyen publicaciones de ejemplo en cuentas nuevas. No se eliminan datos de cuentas existentes. Los datos locales de Live Server no se transfieren automáticamente a GitHub Pages.
- Cámara: HTTPS o localhost y permiso. La primera conexión requiere internet. No se incluyen credenciales administrativas.
- No publicar como servicio multiusuario completo hasta implementar almacenamiento remoto, reglas y moderación.

6.0.1: selector de privacidad de playlists e icono musical metálico.

6.0.2: iconos PWA oficiales, favicon y Apple touch icon.

7.0: selector de tipo de cuenta adaptado a Silver, Dark y Frutiger Aero.

## 7.4 — Caché primero
Service Worker con estrategia 2, cachés versionados, recursos relativos a GitHub Pages y límite de 50 imágenes dinámicas. SDK Firebase público versionado bajo demanda; persistencia Firestore habilitada cuando el navegador la admite. La primera visita requiere internet; audio remoto no se descarga automáticamente. La actualización se activa al cerrar todas las pestañas anteriores y volver a abrir. No se modifican reglas ni configuración del proyecto Firebase.

## 7.5
Avatar del menú y visor unificado; Firestore usa persistencia existente y pausa la red cuando el navegador informa offline. Las publicaciones públicas previamente consultadas pueden recuperarse del caché Firestore. Publicar, editar o eliminar publicaciones requiere conexión; no se promete cola de archivos offline. Reglas sin cambios: publicar las reglas incluidas en Firebase Console y verificar con dos cuentas. No probado en Firebase real.
