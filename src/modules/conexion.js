import api from './api'

const CONFIG_CONEXION = "conexion"

export default {
    comprobarHayDatosConexion() {
        var json_data = localStorage.getItem(CONFIG_CONEXION)

        if(!json_data){
            throw "No hay datos de conexión"
        }
    },
    obtenerDatosGuardados(){
        this.comprobarHayDatosConexion()

        return JSON.parse(localStorage.getItem(CONFIG_CONEXION))
    },
    guardar(api_url, api_key, api_code) {

        if(!api_url){
            throw "Debe indicar la URL"
        }

        if(!api_key){
            throw "Debe indicar la api key"
        }

        if(!api_code){
            throw "Debe indicar el api code"
        }

        localStorage.setItem(CONFIG_CONEXION, JSON.stringify({
            api_url: api_url,
            api_key: api_key,
            api_code: api_code,
        }))
    },
    configurar(){
        var datos = this.obtenerDatosGuardados()
        api.configurarConexion(datos.api_url, datos.api_key, datos.api_code)
    },
    comprobar(){
        return api.get("/check")
    },
	cargarActuaciones(){
        this.comprobarHayDatosConexion()
		return api.get('/mcv/AlbaranesMaterial/obtenerActuacionesAbiertas')
	},
    cargarProductos() {
        this.comprobarHayDatosConexion()
        return api.get('/mcv/AlbaranesMaterial/obtenerArticulos')
    },
    cargarAlmacenes() {
        this.comprobarHayDatosConexion()
        return api.get('/mcv/AlbaranesMaterial/obtenerAlmacenes')
    },
    guardarAlbaran(actuacion_id, almacen_id, productos){
        this.comprobarHayDatosConexion()
        return api.post('/mcv/AlbaranesMaterial/crearAlbaranMaterial', {
            actuacion_id: actuacion_id,
            almacen_id: almacen_id,
            lineas: productos
        })
    }
}
