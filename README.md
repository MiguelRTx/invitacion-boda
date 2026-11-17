# Invitación · Miguel y Mariana

Página de boda hecha con HTML, CSS y JavaScript, sin dependencias ni compilación.

## Abrir

Abrí `index.html` con tu navegador. Para una vista previa por HTTP en esta carpeta:

```powershell
py -m http.server 5500 --bind 127.0.0.1
```

Después visitá http://127.0.0.1:5500.

## Datos

- Boda: 28 de septiembre de 2028.
- Confirmaciones: WhatsApp +591 69051720.
- Primera foto: `assets/img2.jpeg` (hotel).
- Segunda foto: `assets/img1.jpeg` (camisa azul y blusa blanca).
- GPS y YouTube: enlaces proporcionados por ustedes.
- El nombre del salón y los horarios quedan por confirmar.

Los enlaces, horarios, ubicación y teléfono se editan en `config.js`. Los textos y nombres visibles están en `index.html`. Los estilos están en `styles.css`.

## Confirmaciones

El formulario valida los datos y prepara una respuesta dirigida al WhatsApp indicado. El invitado revisa el mensaje, pulsa **Enviar por WhatsApp** y completa el envío en WhatsApp. No se envía automáticamente ni se guarda en una base de datos. Las respuestas llegan a la conversación de WhatsApp de los novios.

El correo electrónico es opcional. Si el invitado lo completa, se incluye en el mensaje junto con su asistencia, cantidad de personas y observaciones de alimentación.

## Compartir con los invitados

Subí `index.html`, `config.js`, `script.js`, `styles.css` y la carpeta `assets` a un alojamiento estático (por ejemplo, GitHub Pages, Netlify o Cloudflare Pages). Compartí la dirección HTTPS que te entregue el alojamiento. Una dirección `localhost` solo funciona en tu computadora.

Las tipografías se cargan desde Google Fonts; si no hay conexión, se usan las fuentes alternativas del equipo. Las fotos están incluidas en la carpeta.

El botón de calendario descarga un archivo `.ics` con el día completo de la boda, porque los horarios aún no están definidos. La cuenta regresiva usa el inicio del 28/09/2028 en la zona horaria de Bolivia.
