<template>
    <div>
        <top-bar titulo="Configuración"></top-bar>

        <div class="todo">

            <div>
                <label>URL Servidor</label>
                <el-input
                    v-model="api_url"
                    placeholder="URL SERVIDOR" />
            </div>
            <div>
                <label>User-Api-Key</label>
                <el-input
                    v-model="api_key"
                    placeholder="USER-API-KEY" />
            </div>
            <div>
                <label>Código de instancia</label>
                <el-input
                    v-model="api_code"
                    placeholder="CÓDIGO INSTANCIA" />
            </div>
            <div>
                <el-button
                    type="danger"
                    :disabled="!puedeCancelar"
                    @click="cancelar">
                    Cancelar
                </el-button>
                <el-button
                    type="success"
                    :disabled="!puedeGuardar"
                    @click="guardarDatos">
                    Guardar y probar
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import conexion from "@/modules/conexion"

export default {
    name: 'Configuracion',
    components: {TopBar},
    data() {
        return {
            api_url: "",
            api_key: "",
            api_code: "",
        }
    },
    methods: {
        mostrarMensajeError(err){
            this.$message({
                type: 'error',
                message: err,
                center: true,
                duration: 1500
            })
        },
        guardarDatos() {
            try {
                conexion.guardar(this.api_url, this.api_key, this.api_code)
                conexion.configurar()
                conexion.comprobar() // es asincrono
                    .then(function(){
                        if(window.history.length > 1){
                            this.$router.go(-1)
                        }else{
                            this.$router.push({name: 'PantallaActuaciones'})
                        }
                    }.bind(this)).catch(function(err){
                        this.mostrarMensajeError("No se ha podido conectar, comprueba los datos o la conexión")
                    }.bind(this))
            }catch(err) {
                this.mostrarMensajeError(err)
            }
        },
        cancelar(){
            this.$router.go(-1)
        }
    },
    computed: {
        puedeGuardar() {
            return this.api_url && this.api_key && this.api_code
        },
        puedeCancelar() {
            return window.history.length > 1
        }
    },
    created() {
        try {
            var datos = conexion.obtenerDatosGuardados()
            if(datos){
                this.api_url = datos.api_url
                this.api_key = datos.api_key
                this.api_code = datos.api_code
                // this.guardarDatos()
            }
        }catch(err) {
            this.mostrarMensajeError(err)
        }
    }
};
</script>