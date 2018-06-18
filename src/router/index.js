import Vue from 'vue'
import Router from 'vue-router'
import PantallaActuaciones from '@/components/PantallaActuaciones'
import PantallaProductos from '@/components/PantallaProductos'
import Configuracion from '@/components/Configuracion'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PantallaActuaciones',
      component: PantallaActuaciones
    },
    {
      path: '/productos',
      name: 'PantallaProductos',
      component: PantallaProductos
    },
    {
      path: '/configuracion',
      name: 'Configuracion',
      component: Configuracion
    }
  ],
   mode: "history"
})
