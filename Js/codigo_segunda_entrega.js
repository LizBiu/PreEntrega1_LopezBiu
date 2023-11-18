let boletosDisponibles = {
    "vip": 5,
    "golden": 5,
    "platino": 5,
    "discapacitado": 4,
};

const precios = {
    "vip": 1500,
    "golden": 1000,
    "platino": 900,
    "discapacitado": 400,
};

let boletosComprados = {
    "vip": 0,
    "golden": 0,
    "platino": 0,
    "discapacitado": 0,
};

let continuarComprando = true;

while (continuarComprando) {
    let tipoBoleto = obtenerTipoBoleto();

    if (tipoBoleto === null) {
        continuarComprando = false;
    } else {
        tipoBoleto = tipoBoleto.toLowerCase();

        if (!esTipoBoletoValido(tipoBoleto)) {
            mostrarMensajeError("Tipo de boleto no válido. Por favor, elige entre VIP, Golden, Platino o Discapacitado.");
        } else if (boletosDisponibles[tipoBoleto] === 0) {
            mostrarMensajeError(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
        } else {
            let cantidad = obtenerCantidadBoletos(tipoBoleto);
            if (esCantidadValida(cantidad)) {
                procesarCompra(tipoBoleto, cantidad);
            } else {
                mostrarMensajeError("Por favor, introduce una cantidad válida de boletos.");
            }
        }
    }
}

function obtenerTipoBoleto() {
    return prompt("¿Qué tipo de boleto deseas comprar (VIP, Golden, Platino o Discapacitado)?");
}

function esTipoBoletoValido(tipoBoleto) {
    return boletosDisponibles[tipoBoleto] !== undefined;
}

function mostrarMensajeError(mensaje) {
    alert(mensaje);
}

function obtenerCantidadBoletos(tipoBoleto) {
    let cantidad = prompt(`¿Cuántos boletos ${tipoBoleto} deseas comprar?`);
    return parseInt(cantidad);
}

function esCantidadValida(cantidad) {
    return !isNaN(cantidad) && cantidad > 0;
}

function retornar() {
    let mensaje = "¡Gracias por tu compra! Esperamos que disfrutes del evento.";
    console.log(mensaje);
    return mensaje;
}

function procesarCompra(tipoBoleto, cantidad) {
    let cantidadDisponible = boletosDisponibles[tipoBoleto];
    cantidad = Math.min(cantidad, cantidadDisponible);
    let fechaCompra = obtenerFechaActual();

    if (cantidad > 0) {
        boletosDisponibles[tipoBoleto] -= cantidad;
        boletosComprados[tipoBoleto] += cantidad;
        let costoTotal = aplicarDescuento(cantidad * precios[tipoBoleto]);
        mostrarMensajeCompra(`Has comprado ${cantidad} boletos ${tipoBoleto}. Total a pagar= ${costoTotal}`);
        mostrarMensajeCompra(`Fecha de compra: ${fechaCompra}`);
        let mensajeRetornado = retornar();
        console.log(mensajeRetornado);
    } else {
        mostrarMensajeError(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
    }
}

function obtenerFechaActual() {
    let fecha = new Date();
    return fecha.toLocaleString();
}

function aplicarDescuento(costo) {
    // Aplicar descuento del 10% por aniversario
    return costo * 0.9;
}

function mostrarMensajeCompra(mensaje) {
    alert(mensaje);
}

function mostrarResumenCompra() {
    let boletosTotales = calcularBoletosTotales();
    if (boletosTotales > 0) {
        mostrarMensajeCompra(`Gracias por tu compra. Has comprado un total de ${boletosTotales} boletos.`);
    } else {
        mostrarMensajeCompra("No se ha realizado ninguna compra.");
    }
}

function calcularBoletosTotales() {
    let boletosTotales = 0;
    for (let tipo in boletosComprados) {
        boletosTotales += boletosComprados[tipo];
    }
    return boletosTotales;
}

// Mostrar resumen de compra al finalizar
document.getElementById('mostrarResumen').addEventListener('click', mostrarResumenCompra);
document.querySelector('.mostrarResumen').addEventListener('click', mostrarResumenCompra);


function mostrarResumenCompra() {
    let mensajeElement = document.getElementById('mensaje');
    let boletosTotales = calcularBoletosTotales();

    if (boletosTotales > 0) {
        mensajeElement.innerText = `Gracias por tu compra. Has comprado un total de ${boletosTotales} boletos.`;
    } else {
        mensajeElement.innerText = "No se ha realizado ninguna compra.";
    }

    setTimeout(() => {
        mensajeElement.innerText = "";
    }, 3000);
}