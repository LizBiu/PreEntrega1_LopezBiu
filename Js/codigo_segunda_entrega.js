let enPaginaAgradecimiento = false;

function cargarDatosDesdeJSON() {
    return fetch('informacionBoletos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            boletosDisponibles = data.informacionBoletos.boletosDisponibles;
            precios = data.informacionBoletos.precios;
            boletosComprados = data.informacionBoletos.boletosComprados;

            console.log('Boletos disponibles:', boletosDisponibles);
            console.log('Precios:', precios);
            console.log('Boletos comprados:', boletosComprados);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

function ocultarBotonesCompra() {
    const botonesCompra = document.querySelectorAll('button[id$="Btn"]');
    botonesCompra.forEach(boton => {
        boton.style.display = 'none';
    });
}

function desactivarFuncionesCompra() {
    window.comprarBoletos = function () {
        alert('Las compras están desactivadas en la página de agradecimiento.');
    };

    window.procesarCompra = function () {
        alert('El procesamiento de compras está desactivado en la página de agradecimiento.');
    };

    window.mostrarMensajeError = function (mensaje) {
        alert(mensaje);
    };
}

function esTipoBoletoValido(tipoBoleto) {
    return boletosDisponibles[tipoBoleto] !== undefined;
}

function seleccionarCantidad(tipoBoleto) {
    if (!enPaginaAgradecimiento) {
        const cantidad = document.getElementById(`${tipoBoleto}Cantidad`).value;
        if (esCantidadValida(cantidad)) {
            procesarCompra(tipoBoleto, parseInt(cantidad));
        } else {
            mostrarMensajeError("Por favor, introduce una cantidad válida de boletos.");
        }
    }
}

window.seleccionarCantidad = function (tipoBoleto) {
    console.log('Haciendo clic en el botón', tipoBoleto);
    if (!enPaginaAgradecimiento) {
        const cantidad = document.getElementById(`${tipoBoleto}Cantidad`).value;
        if (esCantidadValida(cantidad)) {
            procesarCompra(tipoBoleto, parseInt(cantidad));
        } else {
            mostrarMensajeError("Por favor, introduce una cantidad válida de boletos.");
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formularioCompra').addEventListener('submit', function (event) {
        event.preventDefault();

        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);

        this.reset();

        const camposCantidad = document.querySelectorAll('input[type="number"]');
        camposCantidad.forEach(campo => {
            campo.value = 0;
        });

        if (enPaginaAgradecimiento) {
            ocultarBotonesCompra();
            desactivarFuncionesCompra();
        }

        enPaginaAgradecimiento = true;
    });

    document.getElementById('botonEnviar').addEventListener('click', function () {
        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);
        document.getElementById('formularioCompra').submit();
    });

    if (enPaginaAgradecimiento) {
        ocultarBotonesCompra();
        desactivarFuncionesCompra();
    }

    enPaginaAgradecimiento = true;
});

function mostrarMensajeError(mensaje) {
    alert(mensaje);
}

function esCantidadValida(cantidad) {
    return !isNaN(cantidad) && cantidad > 0;
}


function obtenerFechaActual() {
    let fecha = new Date();
    return fecha.toLocaleString();
}


function aplicarDescuento(costo) {
    return costo * 0.9;
}

function procesarCompra(tipoBoleto, cantidad) {
    if (boletosDisponibles[tipoBoleto] >= cantidad) {
        boletosComprados[tipoBoleto] += cantidad;
        boletosDisponibles[tipoBoleto] -= cantidad;

        let costoTotal = aplicarDescuento(cantidad * precios[tipoBoleto]);

        mostrarResumenCompra(tipoBoleto, cantidad, costoTotal);
    } else {
        mostrarMensajeError(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
    }
}


function mostrarResumenCompra() {
    let mensaje = "Resumen de la compra:\n\n";

    for (let tipoBoleto in boletosComprados) {
        let cantidadComprada = boletosComprados[tipoBoleto];

        if (cantidadComprada > 0) {
            mensaje += `Has comprado ${cantidadComprada} boletos ${tipoBoleto}. Total a pagar: $${aplicarDescuento(cantidadComprada * precios[tipoBoleto]).toFixed(2)}\n`;
        }
    }

    if (mensaje === "Resumen de la compra:\n\n") {
        mensaje += "No se ha realizado ninguna compra.";
    }

    mostrarResumenEnHTML(mensaje);
}

function mostrarResumenEnHTML(mensaje) {
    const resumenContainer = document.getElementById('resumen-compra-container');
    const botonesContainer = document.getElementById('botonesContainer');

    if (mensaje !== "Resumen de la compra:\n\n") {
        botonesContainer.innerHTML = ''; // Limpiamos el contenido anterior
        botonesContainer.innerHTML = `<p class="centrado">${mensaje}</p>`;
        resumenContainer.style.display = 'block'; // Muestra la sección de resumen

        for (let tipoBoleto in boletosDisponibles) {
            botonesContainer.innerHTML += `<button onclick="seleccionarCantidad('${tipoBoleto}')">Comprar ${tipoBoleto}</button>`;
        }
    } else {
        resumenContainer.style.display = 'none';
    }
}



if (enPaginaAgradecimiento) {
    ocultarBotonesCompra();
    desactivarFuncionesCompra();
}
enPaginaAgradecimiento = true;





document.addEventListener('DOMContentLoaded', function () {
    cargarDatosDesdeJSON();

    document.getElementById('formularioCompra').addEventListener('submit', function (event) {
        event.preventDefault();

        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);

        this.reset();
    });

    document.getElementById('botonEnviar').addEventListener('click', function () {
        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);
        document.getElementById('formularioCompra').submit();
    });
});