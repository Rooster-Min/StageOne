# StageOne 7.0 — Public Beta

Red social musical independiente, PWA estática. Esta versión es una prueba de interfaz con cuentas Firebase, no una red social multiusuario completa.

## Publicar en GitHub Pages
1. Descomprime el ZIP y sube **el contenido** de la carpeta, con `index.html` en la raíz del repositorio. Conserva `.nojekyll`.
2. Settings → Pages → Deploy from a branch → main / (root) → Save.
3. Abre la URL HTTPS que indique GitHub. En Firebase Authentication → Settings → Authorized domains, añade el dominio de Pages si es necesario (sin ruta).
4. Prueba registro, inicio y cierre de sesión, recuperación de contraseña, perfil, instalación PWA y navegación móvil. Prueba con dos cuentas distintas.

## Alcance y seguridad
- Firebase Authentication y Firestore (`usuarios/{uid}`) para nombre, biografía y rol. Conserva las reglas de acceso por propietario; no habilites acceso global.
- Fotos, audio, publicaciones, mensajes, historias, playlists, seguidores, reportes y estadísticas siguen siendo locales por cuenta y origen. No hay envío remoto, moderación remota ni sincronización de medios.
- No se incluyen publicaciones de ejemplo en cuentas nuevas. No se eliminan datos de cuentas existentes. Los datos locales de Live Server no se transfieren automáticamente a GitHub Pages.
- Cámara: HTTPS o localhost y permiso. La primera conexión requiere internet. No se incluyen credenciales administrativas.
- No publicar como servicio multiusuario completo hasta implementar almacenamiento remoto, reglas y moderación.

6.0.1: selector de privacidad de playlists e icono musical metálico.

6.0.2: iconos PWA oficiales, favicon y Apple touch icon.

7.0: selector de tipo de cuenta adaptado a Silver, Dark y Frutiger Aero.
