# App Albaranes

Esta es la app de albaranes, está desarrollada con
[Vue.js](https://vuejs.org/), [webpack](https://webpack.js.org/), [element-ui](https://github.com/ElemeFE/element) y la [plantilla PWA](https://github.com/vuejs-templates/pwa) de Vuejs.

Para el convertir la app en PWA lo que he hecho es
seguir lo indicado en:

https://github.com/vuejs-templates/pwa

# Instalación

Clonamos el repositorio y ejecutamos:

    cd nombre_proyecto
    npm install
    npm run dev

Con esto, se consigue hacer funcionar la app, pero no tiene la funcionalidad de una PWA, ya que no funciona el Service Worker ni el manifiesto.

Los pasos siguientes para hacer funcionar la aplicación como una PWA los miré de la [siguiente página](https://blog.sicara.com/a-progressive-web-application-with-vue-js-webpack-material-design-part-3-service-workers-offline-ed3184264fd1).

Para probarla al completo con la funcionalidad de las PWA, crea el modo de produccion de la aplicación:

    npm run build

Para servir archivos compilados, utilizo un emulador de un servidor HTTP, en mi caso, utilizo [serve tool](https://github.com/zeit/serve) (requiere node ≥ 6.9.0):

    npm install -g serve

Entonces ejecuta:

    serve dist/

Y en el navegador: http://localhost:5000

Y asi funcionaría la aplicación con todas sus funcionalidades PWA (modo offline, agregar a pantalla inicio, almacenar en caché la aplicación [App Shell](https://developers.google.com/web/fundamentals/architecture/app-shell)) al completo, gracias al manifiesto y el Service Worker.

# Instalación en el dispositivo

Para hacer pruebas de la aplicación desde un dispositivo móvil, utilizo [ngrok](https://ngrok.com/) para acceder a `localhost:5000`

Ngrok es un servicio que retransmite el entorno local en un DNS remoto.

Para instalarlo:

    npm install -g ngrok

Entonces ejecuta:

    ngrok http puerto (5000 en mi caso)

Desde el navegador del dispositivo móvil, introduce la url que empieza con `https://...` y debe cargarte la apliacación; con esto ya puedes estar utilizando la aplicación o puedes instalarla como si de una aplicación nativa se tratara.

La primera vez que entras a la aplicación desde Google Chrome, el navegador te preguntará si quieres añadirla a la pantalla de inicio; si entras desde Mozilla Firefox te saldrá arriba en la barra una casita a la que tienes que darle.

Si aceptas se te añadirá como una aplicación normal donde se instalan las demás aplicaciones del teléfono móvil.

Si rechazas, no volverá a preguntarte si quieres añadirla hasta pasado alrededor de unos 3 meses. Aunque puedes añadirla cuando quieras desde las opciones del navegador, dándole a añadir a la pantalla de inicio.

Al abrir la aplicación, como una aplicación cualquiera nativa, se te abrirá y saldrá de inicio una Splash Screen y luego la página inicial de la aplicación.

La primera vez al ser utilizada, se necesitará conexion a internet para poder comunicarse con los servicios web y descargar los datos necesarios.

Después de cargados los datos podrá ser usada sin tener ninguna conexión a internet o los servicios web; solo será necesario conectarse una vez quieras crear el albarán o volver a cargar datos.
