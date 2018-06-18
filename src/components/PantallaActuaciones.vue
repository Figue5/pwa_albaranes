<template>
    <div class="hello">

        <top-bar ref="topbar" titulo="Búsqueda de actuaciones"></top-bar>

        <div class="todo">
            <div><el-input
                v-model="texto"
                prefix-icon="el-icon-search"
                placeholder="Introduce la descripción de la actuación"/></div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>LISTADO DE ACTUACIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in actuacionesFiltradas()"
                        @click="mostrarActuacion(item.id, item.descripcion)">
                            <td>{{ item.id }} - {{ item.descripcion }}</td>
                        </tr>
                    </tbody>
                </table>
                <span> {{ datos }} </span>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue"
import conexion from "@/modules/conexion"

export default {
    name: 'PantallaActuaciones',
    components: {TopBar},
    data() {
        return {
            texto: "",
            datos: "",
            actuaciones_abiertas: [
                // {id: "1", nombre_actuacion: 'Act uno'},
                // {id: "2", nombre_actuacion: 'Actuación dos'},
                // {id: "3", nombre_actuacion: 'Nueva tres'},
                // {id: "4", nombre_actuacion: 'Act. cuatro'},
                // {id: "5", nombre_actuacion: 'Actuación cinco'}
            ],
            actuacion_seleccionada: {
                id: null, descripcion: ""
            }
        }
    },
    methods: {
        actuacionesFiltradas: function() {
            var filtro = this.texto
            return this.actuaciones_abiertas.filter(function(item) {
                if(!filtro) {
                    return true
                }
                return item.descripcion.toLowerCase().indexOf(filtro) > -1
            })
        },
        cargarListaActuaciones() {
            var lista_actuaciones = JSON.parse(localStorage.getItem('actuaciones_cargadas'))
            if (lista_actuaciones) {
                this.datos = ""
                this.actuaciones_abiertas = lista_actuaciones
            } else {
                this.actuaciones_abiertas = []
                this.datos = "No se encuentran datos de actuaciones cargados."
            }

        },
        mostrarActuacion(id, descripcion) {
            this.actuacion_seleccionada = {
                id: id,
                descripcion: descripcion
            }

            window.localStorage.setItem('actuacion', JSON.stringify(this.actuacion_seleccionada))

            this.$router.replace({name: 'PantallaProductos'})
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
        this.$nextTick(function(){
            try {
                conexion.configurar()
                if(window.localStorage.getItem('productos')){
                    this.$router.replace({name: 'PantallaProductos'})
                }
                this.cargarListaActuaciones()
            }catch(err) {
                this.mensajeError(err)
            }
        })

        // Montamos el evento datos-cargados de TopBar
        this.$on('datos-cargados', function(){
            this.cargarListaActuaciones()
        }.bind(this))
    }
};
</script>
