

let productos = []

class Carrito {
    constructor (id, nombre, cantidad, valorCompra){
       this.id = id,
       this.nombre = nombre,
       this.cantidad = cantidad,
       this.valorCompra = valorCompra
    }
 }

let carrito =[]
let reciboCant = 0
let contArt = 0
// nada -- es una variable para poder completar el condicional especial
// pongo -- es una variable donde pongo la cantidad cargada en lS  
let nada = 0
let pongo = 0
let pongoImg = ""
// selectores

const contenedorProductos = document.querySelector("#contenedor-productos")
const cant = document.querySelector("#cantidad")
const contadorCarrito = document.querySelector("#contadorCarrito")

//  decl. selectore modal carrito
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const botonAbrir = document.getElementById('boton-carrito')
const botonCerrar = document.getElementById('carritoCerrar')
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]
const carritoContenedor = document.querySelector('#carrito-contenedor')
const precioTotal = document.querySelector('#precioTotal')
const btnVaciar = document.getElementById('vaciarCarrito')
const confPedido = document.getElementById('confirmaPedido')
const descripcion = document.getElementById('descripcion')

// decl. selectores modal de Error

const contenedorModalE = document.getElementsByClassName('modal-contenedorE')[0]
const modalCarritoE = document.getElementsByClassName('modal-carritoE')[0]
const botonCerrarE = document.getElementById('carritoCerrarE')
const carritoContenedorE = document.querySelector('#carrito-contenedorE')

//  decl. selectores modal publicidad
const containerInterval = document.querySelector("#container-interval")
const modalInterval = document.querySelector("#modal-interval")


// decl. selector formulario pedido y saludo final
const formPedido = document.querySelector('#form-pedido')
const formContenedor = document.getElementsByClassName('form-contenedor')[0]

// decl. selector capturo la cantidad
const modalContenedorCantidad = document.getElementsByClassName('modal-contenedor-cantidad')[0]
const modalClaseCantidad = document.getElementsByClassName('modal-clase-cantidad')[0]
const modalCapturoCantidad = document.querySelector('#modal-capturo-cantidad')
const btnCapturoCerrar = document.getElementById('btn-capturo-cerrar')


// eventos
botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})
botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})
contenedorModal.addEventListener('click', ()=>{
    botonCerrar.click()
})
modalCarrito.addEventListener('click', (event)=>{
    event.stopPropagation()
})
botonCerrarE.addEventListener('click', ()=>{
    contenedorModalE.classList.toggle('modal-active')
})
btnCapturoCerrar.addEventListener('click', ()=>{
    modalContenedorCantidad.classList.toggle('modal-active')
})

//  recupero de localstorage 


// const carritoEnLS = JSON.parse(localStorage.getItem("carrito")) || []
const carritoEnLS = localStorage.getItem("carrito")
const carritoJS = JSON.parse(carritoEnLS)

const nombreLS = localStorage.getItem("nombre")
const direccionLS = localStorage.getItem("direccion")

//  MOSTRAR PRODUCTOS 
//  CAPTURAR CANTIDADES 
//  CARGAR CARRITO



fetch('./js/datos.json')
    .then ((resp) => resp.json())
    .then ((data) =>{
      
            productos = data

            muestroArt()

        })
 

//  FUNCIONES
function muestroArt(){
    productos.forEach((producto) => {
        const div = document.createElement("div")
        div.classList.add("contImg")

        div.innerHTML=`
                <img src=${producto.img} alt="fondo" class="imagen" />
                <p class="letraPrecio">${producto.nombre}</p>
                <p class="letraPrecio">Precio producto $${producto.precio}</p>
                <button type="button" class="btn btn-success" id="btn-comprar" onclick="tratarCompra(${producto.id})" >..COMPRAR..</button>
             `
        contenedorProductos.append(div)

     })
}

function revisoLS(id){
    const veoSiExiste = carrito.find( ind => ind.id === id)
    veoSiExiste? pongo = veoSiExiste.cantidad:pongo=0
}
function tratarCompra(id){
    // const btnComprar = document.querySelector('#btn-comprar')
    modalContenedorCantidad.classList.toggle('modal-active')
 
    const buscoImg = productos.find( ind => ind.id === id)
    buscoImg? pongoImg = buscoImg.img:pongoImg="sin imagen"

    revisoLS(id)

    modalCapturoCantidad.innerHTML = ''

    descripcion.innerHTML=`<strong>Nombre del producto : </strong>${buscoImg.nombre}`

    const div = document.createElement("div")
    div.classList.add("contImg1")

    div.innerHTML=`
            <div class= "cantidad">
                    
               <img src=${pongoImg} alt="fondo" class="imagen1" /> 
               <div class = "row rowalineacion">
                    <button  class="menosmas" onclick="removerDelCarrito(${id})"><i style='font-size:24px' class='fas'>&#xf068;</i></button>
                    <p id="cant" >${pongo}</p>
                    <button  class="menosmas" onclick="agregoProductos(${id},1)"><i style='font-size:24px' class='fas'>&#xf067;</i> </button>
               </div>
                               
            </div>
         `
    modalCapturoCantidad.append(div)

}

function agregoProductos(item, cantP){
    const indice = Number(item)
    const registro = productos.find( el => el.id === indice)

    if (registro !== undefined){
        const veoSiExiste = carrito.find( ind => ind.id === registro.id)
        if (veoSiExiste){
  
                    veoSiExiste.cantidad ++
                    veoSiExiste.valorCompra = veoSiExiste.cantidad * registro.precio 
                    pongo = veoSiExiste.cantidad
                
                    muestroToast(registro.nombre)
                    muestroCarrito()
                    suboLS()
        }else{
       
                    let valor = cantP * registro.precio 
                    let cantN = Number(cantP)       
                    carrito.push(new Carrito(indice, registro.nombre, cantN, valor))
                    pongo = 1

                    muestroToast(registro.nombre)
                    muestroCarrito()
                    suboLS()
        }

    }else{
        mostrarError(1)
    }
    contarArticulos()
    limpiarCarrito()
    cantArtCompra(contArt) 

    const cantidad = document.getElementById('cant')

    cantidad.innerHTML=` <p id="cant" >${pongo}</p>`
}

function muestroToast(producto){
    Toastify({
        text: `Has subido al carrito el producto: ${producto}`,
        gravity: "bottom",
        position: "left",
        duration: 4000,
        className: "info",
        style: {
          background: "linear-gradient(to right, #D48AD4, #B85898)",
        }
    }).showToast();
}

function mostrarError(codError){
contenedorModalE.classList.toggle('modal-active')

codError === 1?  carritoContenedorE.innerHTML=`Error: no se encontró el índice`: codError === 2?   carritoContenedorE.innerHTML=`El carrito no tiene artículos agregados`: codError === 3?  carritoContenedorE.innerHTML=`Debe confirmar después de agregar artículos`: codError === 4?  carritoContenedorE.innerHTML=`Debe ingresar Nombre y Direccion` : nada = 0
}

function contarArticulos() {
    contArt = 0
    carrito.forEach((item) => {
        const convCant = Number(item.cantidad)
        contArt += convCant
     
    })
}
function limpiarCarrito(){
    // let i = 0
    carrito.forEach((i) =>{
         if (i.cantidad === 0){
            const reg = carrito.indexOf(i)
            if (reg !== -1){
                carrito.splice(reg,1)
         }}
    })
}
const cantArtCompra = (contArt) => {
    contadorCarrito.innerText = contArt
}

function muestroCarrito  ()  {
        carritoContenedor.innerHTML = ''
        carrito.forEach(({id, nombre, cantidad, valorCompra}) => {
        if (cantidad !== 0){
            const div = document.createElement('div')
            div.classList.add('productoEnCarrito')
            div.innerHTML = `
                    <p>${nombre}</p>
                    <p>Cantidad: ${cantidad}</p>
                    <p>Precio: $${valorCompra}</p>
                    <button onclick="removerDelCarrito(${id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                    `
            carritoContenedor.append(div)
        }    
        })
        cuentoTotal()
       
}

function cuentoTotal(){
    let totalPedido = 0
        carrito.forEach(({valorCompra}) =>{
            totalPedido += valorCompra
        })
            precioTotal.innerText = totalPedido
}



const removerDelCarrito = (id) => {
    const item = carrito.find((producto) => producto.id === id)
    const itemP = productos.find((ele) => ele.id === id)

    if (item !== undefined){
        if (item.cantidad > 0){
            item.cantidad -= 1
            item.valorCompra = item.cantidad * itemP.precio
            Toastify({
                text: `Se eliminó 1 unidad de ${item.nombre}`,
                position: 'right',
                gravity: 'bottom',
                duration: 5000,
                style: {
                    background: "linear-gradient(to right, #D48AD4, #B85898)",
                }
            }).showToast()

            suboLS()
            muestroCarrito()
            contarArticulos()
            cantArtCompra(contArt) 
            pongo = item.cantidad
            const cantidad = document.getElementById('cant')
    
            cantidad.innerHTML=` <p id="cant" >${pongo}</p>`
        }

        if (item.cantidad === 0){
            const indice = carrito.indexOf(item)
            carrito.splice(indice, 1)
        }
}
}
function vaciarCarrito () {
    if (carrito.length === 0){
        contenedorModal.classList.toggle('modal-active')
        mostrarError(2)
    }else{
    Swal.fire({
        title: 'Realmente deseas vaciar el carrito?',
        text: "Acción irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo vaciarlo!',
        cancelButtonText: 'Cancelar acción!'
      }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0
            contArt = 0
            contadorCarrito.innerText = contArt
            muestroCarrito()
            eliminoDeLS()
             contenedorModal.classList.toggle('modal-active')

          Swal.fire({
            title: 'Vaciado!',
            text: 'El carrito ha sido eliminado.',
            icon:'success',
            confirmButtonColor: "#B85898",
            iconColor: "#B85898"
        })
        }
      })

}}
function confirmaPedido(){
    if (carrito.length === 0){
        contenedorModal.classList.toggle('modal-active')
        mostrarError(3)
    }else{


    contenedorModal.classList.toggle('modal-active')
    formContenedor.classList.toggle('modal-active')
    modalCarrito.classList.toggle('modal-active')
    formPedido.innerHTML= ""
    
    const form = document.createElement("form")


    form.innerHTML=`
        <form class="row g-3" >
            <div class="col-12">
                <label for="inputNombre" class="form-label">Nombre</label>
                <input type="text" class="form-control my-2" id="inputNombre" placeholder="Ingrese su Nombre" >
            </div>
            <div class="col-12">
                <label for="inputDireccion" class="form-label">Direccion </label>
                <input type="text" class="form-control my-2" id="inputDireccion" placeholder="Ingrese su direccion">
            </div>
            <div class="col-12">
                <button type="button" class="btn btn-success" id="btn-confirma" onclick="asentarConfirmacion()" >CONFIRMA SU PEDIDO</button>
            </div>
        </form>    
    `
    formPedido.append(form)

}}
function asentarConfirmacion(){
    formContenedor.classList.toggle('modal-active')
    let nombre = document.querySelector('#inputNombre')
    const direccion = document.querySelector('#inputDireccion')
    // const btnConfirma = document.querySelector('#btn-confirma')

    if (nombre.value !== "" && direccion.value !== "" ){
          fun();
          localStorage.setItem("nombre", nombre.value);
          localStorage.setItem("direccion", direccion.value);
          // Conrado me sugirió que limpie del carrito después de confirmar el pedido
          // entonces no tiene sentido que guarde nombre y dirección porque eso lo hago
          // cuando confirmo el pedido y si lo limpio nunca se guardaría
          // Por lo tanto dejo que se guarde el nombre pero al momento se elimina, lo dejo
          // como ejemplo pero no es funcional
          suboLS()
          carrito.length = 0
          contArt = 0
          contadorCarrito.innerText = contArt
          muestroCarrito()
          eliminoDeLS()
    }else{
          mostrarError(4)
    }
}
function fun(){
    Swal.fire({
        icon: 'success',
        title: 'Gracias por tu compra!!!',
        text: 'LLegarán los productos en el transcurso de las próximas 72 horas',
        iconColor: "#B85898",
        confirmButtonColor: "#B85898"
})
}
//  subo a localstorage
function suboLS(){
    const carritoJS = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoJS)

}

if (carritoJS){
    carrito = carritoJS
    muestroCarrito()
    contarArticulos()
    cantArtCompra(contArt) 
}else{
    carrito = []
}
function eliminoDeLS(){
    localStorage.clear(carrito)
}

///   mostrar pulicidad
setInterval(saludar, 6000);

function saludar() {
Toastify({
    text: `
              P R O X I M A M E N T E
                 Cursos de Manicuría   `,
    position: 'center',
    gravity: 'top',
    duration: 3000,
    className: "info",
    style: {
    background: "linear-gradient(to right, #3604445, #090D0B)",
    height: '15%',
    width: '70%',
    }
}).showToast()}


