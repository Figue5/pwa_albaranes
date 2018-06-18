<template>
    <div class="top-bar">
        <div style="display: inline-block">
            {{ titulo }}
        </div>
        <div style="float: left">
            <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img alt="Menú" src="@/assets/baseline_menu_white_24dp.png"></img>
                        <!-- <i class="el-icon-menu"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-show="item_configuración" command="abrir_configuracion">Configuración</el-dropdown-item>
                        <el-dropdown-item command="actualizar_datos">
                            Actualizar datos
                            <span class="menu-mini-info">
                                {{ fecha_hora.fecha }} {{ fecha_hora.hora }}
                            </span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import conexion from "@/modules/conexion"

export default {
    data() {
        return {
            fecha_hora: {},
            item_configuración: true
        }
    },
    props: ['titulo'],
    methods: {
        ocultarConfiguracionMenu() {
            if (this.$route.path == '/configuracion') {
                this.item_configuración = false
            }
        },
        handleCommand(command) {
            switch(command){
                case 'abrir_configuracion':
                    return this.cargarPantallaConfiguracion()
                case 'actualizar_datos':
                    return this.cargarDatos()

            }
        },
        cargarPantallaConfiguracion() {
            // var obtener_conexion = conexion.obtenerDatosGuardados()

            // if (this.$route.path == '/productos') {

            // }

            this.$router.push({name: 'Configuracion'})
        },
        cargarDatos() {
            try {
                conexion.cargarActuaciones().then(response => {
                    var actuaciones_cargadas = response.data
                    window.localStorage.setItem('actuaciones_cargadas', JSON.stringify(actuaciones_cargadas))
                }).then(function(){
                    return conexion.cargarProductos().then(response => {
                        var productos_cargados = response.data
                        window.localStorage.setItem('productos_cargados', JSON.stringify(productos_cargados))
                    })
                }).then(function(){
                    return conexion.cargarAlmacenes().then(response => {
                        var almacenes_cargados = response.data
                        window.localStorage.setItem('almacenes_cargados', JSON.stringify(almacenes_cargados))
                    })
                }).then(function(){
                    this.fechaActualizacion()
                    this.$parent.$emit('datos-cargados')
                }.bind(this)).catch(function(err) {
                    if (!err.status) {
                        this.mensajeError("No hay conexion con la Api")
                    }
                }.bind(this))
            }catch(err) {
                this.mensajeError(err)
            }
        },
        fechaActualizacion() {
            var dt = new Date()

            var d = dt.getDate()
            var dia = (d < 10) ? '0' + d : d

            var m = dt.getMonth() + 1
            var mes = (m < 10) ? '0' + m : m

            var año = dt.getFullYear()
            var horas = dt.getHours()

            var min = dt.getMinutes()
            var minutos = (min < 10) ? '0' + min : min

            this.fecha_hora.fecha = dia + "/" + mes + "/" + año
            this.fecha_hora.hora = horas + ":" + minutos

            localStorage.setItem('fecha_hora', JSON.stringify(this.fecha_hora))

            this.cargarInfoUltimaActualizacion()
        },
        cargarInfoUltimaActualizacion() {
            var datos_actualizacion = localStorage.getItem('fecha_hora')
            if (datos_actualizacion) {
                this.fecha_hora = JSON.parse(datos_actualizacion)
            } else {
                this.fecha_hora.fecha = "No has hecho ninguna actualización."
            }
        },
        mensajeError(err){
            this.$message({
                type: 'error',
                message: err,
                center: true,
                duration: 1500
            })
        }
    },
    created() {
        try {
            this.ocultarConfiguracionMenu()
            this.cargarInfoUltimaActualizacion()
            conexion.configurar()
        }catch(err){
            this.mensajeError(err)
        }
    }
};
</script>