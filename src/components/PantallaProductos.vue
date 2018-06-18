<template>
    <div>
        <top-bar :titulo="descripcionActuacion"></top-bar>
        <div class="todo">
            <div>
                <el-select
                    v-model="almacen"
                    placeholder="Selecciona almacén"
                    filterable
                    :disabled="hayProductosAgregados"
                    style="width:100%">
                        <el-option
                            v-for="(item, id) in almacenes"
                            :key="id"
                            :label="item"
                            :value="id">
                        </el-option>
                </el-select>
            </div>
            <div>
                <el-input
                    ref="txtCodBarras"
                    v-model="codigo_barras"
                    autofocus="true"
                    placeholder="Introduce el código de barras"
                    @keyup.enter.native="buscarProducto" >
                    <el-button
                        slot="append"
                        type="primary"
                        @click="buscarProducto">Buscar
                    </el-button>
                </el-input>

            </div>
            <div>
                <label>Referencia</label>
                <el-input
                    v-model="producto_actual.referencia"
                    :readonly="true"
                    placeholder="Referencia del producto" />
            </div>
            <div>
                <label>Descripción</label>
                <el-input
                    v-model="producto_actual.descripcion"
                    :readonly="true"
                    placeholder="Descripción del producto" />
            </div>
            <div>
                <el-input-number
                    ref="txtCantidad"
                    controls-position="right"
                    :min="1"
                    v-model.number="cantidad"
                    @keyup.enter.native="agregarProducto" />
                <el-button
                    type="success"
                    icon="el-icon-plus"
                    circle
                    @click="agregarProducto"
                    :class="{disabled: !puedeAgregar}"
                    :disabled="!puedeAgregar" />
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Uds.</th>
                            <th>Ac.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in productosOrdenados">
                            <td>#{{ row.posicion }}</td>
                            <td style="text-align: left;">
                                {{ row.descripcion }}
                            </td>
                            <td>{{ row.cantidad }}</td>
                            <td>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    circle
                                    @click="eliminarProducto(row.id)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <el-button
                    type="danger"
                    @click="cancelarAlbaran">Cancelar
                </el-button>
                <el-button
                    type="success"
                    @click="crearAlbaran"
                    :class="{disabled: !puedeCrear}"
                    :disabled="!puedeCrear">Crear albarán
                </el-button>
            </div>

        </div>
    </div>
</template>

<script>

import TopBar from "@/components/TopBar.vue"
import conexion from "@/modules/conexion"


function productoVacio() {
    return {id: null, referencia: "",  descripcion: ""}
}

var cantidad_inicial = 1
var cod_barras_inicial = ''

export default {
    name: 'PantallaProductos',
    components: {TopBar},
    data() {
        return {
            codigo_barras: cod_barras_inicial,
            cantidad: cantidad_inicial,
            producto_actual: productoVacio(),
            productos_disponibles: [],
            productos: {},
            almacen: '',
            almacenes: [
            "No se encuentran datos de almacenes cargados"
            ]
        }
    },
    methods: {
        buscarProducto() {

            if (this.cargarListaProductos()) {

                if(!this.codigo_barras){
                    this.producto_actual = productoVacio()
                    this.$refs.txtCodBarras.focus()
                    this.mensajeError("Introduce el código de barras")
                    return
                }

                var producto_encontrado = this.encontrarProductoPorCodigoBarras(this.codigo_barras)

                if(producto_encontrado){
                    this.producto_actual = producto_encontrado
                    this.$refs.txtCantidad.focus()
                }else{
                    this.mensajeError("No existen productos con este código de barras")
                    this.$refs.txtCodBarras.focus()
                }
            }

            // conexion.cargarProducto(this.codigo_barras).then(response => {
            //     this.producto_actual = response.data
            // }).catch(function(err){
            //         this.mensajeError("No se ha podido conectar")
            //     }.bind(this))
            // .then(response => {
            //     var existe_producto = (this.producto_actual = response.data)
            //     if(existe_producto) {
            //         return existe_producto
            //     }else{
            //         this.mensajeError()
            //     }
            // })
            // .catch(e => {
            //     this.errors.push(e)
            // })

            /*if(this.codigo_barras == "a"){
                this.producto_actual = {
                    id: "1",
                    referencia: "Referencia Producto 1",
                    descripcion: "Descripción Producto 1"
                }
            }else if(this.codigo_barras == "b"){
                this.producto_actual = {
                    id: "2",
                    referencia: "Referencia Producto 2",
                    descripcion: "Descripción Producto 2"
                }
            }else if(this.codigo_barras == "c"){
                this.producto_actual = {
                    id: "3",
                    referencia: "Referencia Producto 3",
                    descripcion: "Descripción Producto 3"
                }
            }*/
        },
        nombreAlmacen: function(almacen_id){
            return this.almacenes[almacen_id]
        },
        encontrarProductoPorCodigoBarras: function(codigo_barras) {
            var filtro = codigo_barras.toLowerCase()

            return this.productos_disponibles.find(function(item) {
                return item.codigo_barras.toLowerCase() == filtro
            })
        },
        cargarListaProductos(){
            var lista_productos = JSON.parse(localStorage.getItem('productos_cargados'))
            if (lista_productos) {
                this.productos_disponibles = lista_productos
                return true
            } else {
                this.mensajeError("No se encuentran datos de productos cargados")
            }
        },
        agregarProducto(event) {
            if (this.almacen != "") {
                if (this.productos.hasOwnProperty(this.producto_actual.id)) {
                    this.productos[this.producto_actual.id].cantidad += this.cantidad
                } else {
                    this.$set(this.productos, this.producto_actual.id, {
                        id: this.producto_actual.id,
                        descripcion: this.producto_actual.descripcion,
                        cantidad: this.cantidad,
                        posicion: this.ultimaPosicionDisponible + 1,
                    })
                }
                this.codigo_barras = ""
                this.cantidad = 1
                this.producto_actual = productoVacio()
                this.$refs.txtCodBarras.focus()
                this.guardarProductosYAlmacen()
            } else {
                this.mensajeError("Añade un almacén")
            }
        },
        eliminarProducto(id) {
            this.$delete(this.productos, id)
            this.guardarProductosYAlmacen()
        },
        cancelarAlbaran() {

            if(!this.hayProductos()){
                this.volverPantallaActuaciones()
                return
            }

            this.$confirm('¿Quieres cancelar este albarán?', 'Advertencia', {
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                type: 'warning',
                center: true
            }).then(this.volverPantallaActuaciones.bind(this)).catch(err => {
                console.log(err)
            })

        },
        volverPantallaActuaciones() {
            this.productos = {}
            window.localStorage.removeItem('actuacion')
            this.guardarProductosYAlmacen()
            this.$router.replace({name: 'PantallaActuaciones'})
        },
        cargarAlmacenes() {
            var almacenes_cargados = JSON.parse(localStorage.getItem('almacenes_cargados'))
            if (almacenes_cargados) {
                this.almacenes = almacenes_cargados
            }
        },
        crearAlbaran() {

            var actuacion_id = this.actuacionElegida().id
            var almacen_id = this.almacen

            var productos_a_enviar = Object.values(this.productos).map(function(item){
                return {
                    producto_id: item.id,
                    cantidad: item.cantidad
                }
            })

            try {
                conexion.guardarAlbaran(actuacion_id, almacen_id, productos_a_enviar)
                    .then(function(){
                        this.productos = {}
                        this.volverPantallaActuaciones()
                        this.$message({
                            type: 'success',
                            message: 'Se ha creado el albarán'
                        })
                    }.bind(this))
                    .catch(function(err) {
                        this.mensajeError("Hay algún error, comprueba la conexión")
                    }.bind(this))
            }catch(err) {
                this.mensajeError(err)
            }
        },
        cargarAlmacenYProductosGuardados(){
            var productos_guardados = localStorage.getItem('productos')
            var almacen_guardado = localStorage.getItem('almacen')
            if(productos_guardados && almacen_guardado){
                this.productos = JSON.parse(productos_guardados)
                this.almacen = almacen_guardado
            }
        },
        guardarProductosYAlmacen() {
            if(this.hayProductos()){
                window.localStorage.setItem('productos', JSON.stringify(this.productos))
                window.localStorage.setItem('almacen', this.almacen)
            }else{
                window.localStorage.removeItem('productos')
                window.localStorage.removeItem('almacen')
                this.almacen = ""
            }
        },
        hayProductos() {
            return Object.values(this.productos).length > 0
        },
        mensajeError(err) {
            return this.$message({
                type: 'error',
                message: err,
                center: true,
                duration: 1500
            })
        },
        actuacionElegida(){
            return JSON.parse(localStorage.getItem('actuacion'))
        }
    },
    computed: {
        descripcionActuacion() {
            return this.actuacionElegida().descripcion
        },
        productosOrdenados() {
            return Object.values(this.productos).sort((a, b) => b.posicion - a.posicion )
        },
        hayProductosAgregados() {
            return Object.keys(this.productos).length > 0
        },
        ultimaPosicionDisponible() {
            var ordenes = Object.values(this.productos).map(p => p.posicion)
            if(ordenes.length > 0){
                return Math.max(...ordenes)
            }else{
                return 0
            }
        },
        puedeAgregar() {
            return this.producto_actual.id != null && this.almacen
        },
        puedeCrear() {
            return this.hayProductos()
        }
    },
    created() {
        this.$nextTick(function(){
            try {
                conexion.configurar()
                this.cargarAlmacenYProductosGuardados()
                this.cargarListaProductos()
                this.cargarAlmacenes()
            }catch(err) {
                this.mensajeError(err)
            }
        })

        // Montamos el evento datos-cargados de TopBar
        this.$on('datos-cargados', function(){
            this.cargarAlmacenes()
        }.bind(this))
    }

};
</script>