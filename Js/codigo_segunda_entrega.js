function obtenerInstanciaMailgun() {
    const mg = mailgun({
        apiKey: 'pubkey-a0ec3acbfb1f580dc2a43d65a8050976',
        domain: 'sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org',
    });

    return mg;
}



function cargarDatosDesdeJSON() {
    let data;

    return fetch('informacionBoletos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(responseData => {  
            data = responseData;  
            boletosDisponibles = data.informacionBoletos.boletosDisponibles;
            precios = data.informacionBoletos.precios;
            boletosComprados = data.informacionBoletos.boletosComprados;

            console.log('Boletos disponibles:', boletosDisponibles);
            console.log('Precios:', precios);
            console.log('Boletos comprados:', boletosComprados);

            mg = obtenerInstanciaMailgun();
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}


cargarDatosDesdeJSON();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formularioCompra').addEventListener('submit', function (event) {
        event.preventDefault(); 

        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);

        this.reset();
    });

    document.getElementById('botonEnviar').addEventListener('click', function() {
        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;

        enviarInformacion(nombre, email);
        document.getElementById('formularioCompra').submit();
    });
});

function esTipoBoletoValido(tipoBoleto) {
    return boletosDisponibles[tipoBoleto] !== undefined;
}

function mostrarMensajeError(mensaje) {
    alert(mensaje);
}

function comprarBoletos(tipoBoleto) {
    let cantidad = prompt(`¿Cuántos boletos ${tipoBoleto} deseas comprar?`);
    cantidad = parseInt(cantidad);

    if (esCantidadValida(cantidad)) {
        procesarCompra(tipoBoleto, cantidad);
    } else {
        mostrarMensajeError("Por favor, introduce una cantidad válida de boletos.");
    }
}

function obtenerCantidadBoletos(tipoBoleto) {
    let cantidad = prompt(`¿Cuántos boletos ${tipoBoleto} deseas comprar?`);
    return parseInt(cantidad);
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

        mostrarMensajeCompra(`Has comprado ${cantidad} boletos ${tipoBoleto}. Total a pagar= ${costoTotal}`);
        mostrarMensajeCompra(`Fecha de compra: ${obtenerFechaActual()}`);
    } else {
        mostrarMensajeError(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
    }
}

function mostrarMensajeEnHTML(mensaje) {
    const mensajeContainer = document.getElementById('mensajeContainer');
    mensajeContainer.innerHTML += `<p>${mensaje}</p>`;
}


function mostrarResumenCompra() {
    let mensaje = "Resumen de la compra:\n\n";

    for (let tipoBoleto in boletosComprados) {
        let cantidadComprada = boletosComprados[tipoBoleto];

        if (cantidadComprada > 0) {
            mensaje += `Boletos ${tipoBoleto}: ${cantidadComprada}\n`;
        }
    }
    
    return mensaje !== "Resumen de la compra:\n\n" ? mensaje : "No se ha realizado ninguna compra.";

}



document.getElementById('formularioCompra').addEventListener('submit', function (event) {
    event.preventDefault(); 
    
    let nombre = document.getElementById('nombre').value;
    let email = document.getElementById('email').value;

    enviarInformacion(nombre, email);

    this.reset();
});

function enviarCorreo() {
    const apiUrl = 'https://api.mailgun.net/v3/sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org/messages';
    const apiKey = '31faa32c55cbfa2b27bae7d04d5fd5ba-0a688b4a-888d2f30';
    const domain = 'sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org';

    const datos = {
        from: "Mailgun Sandbox <postmaster@sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org>",
        to: "lizethlobiu@gmail.com",
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`api:${apiKey}`)}`, // Codifica las credenciales a Base64
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(datos).toString(), // Codifica los datos como formulario URL-encoded
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar el correo');
        }
        return response.json();
    })
    .then(data => {
        console.log('Correo enviado con éxito:', data);
        // Puedes agregar más lógica aquí según la respuesta de la API
    })
    .catch(error => {
        console.error('Error al enviar el correo:', error);
    });
}


function enviarInformacion(nombre, email) {
    console.log(`Nombre: ${nombre}, Email: ${email}`);

    const cliente = {
        nombre: nombre,
        correo: email,
    };

    const informacionAEnviar = {
        cliente: {
            nombre: nombre,
            correo: email,
        },
        compra: {
            totalPago: mostrarResumenCompra(),
            fechaCompra: obtenerFechaActual(),
        },
        mensaje: "Gracias por tu compra. Esperamos que disfrutes del evento.",
    };
    

    const mensajeContainer = document.getElementById('mensajeContainer');
    mensajeContainer.innerHTML = `<p><strong>Resumen de la compra:</strong></p><p>${informacionAEnviar.compra.totalPago}</p><p>${informacionAEnviar.compra.fechaCompra}</p>`;

    if (mg) {
        mg.messages.create('sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org', {
            from: "Mailgun Sandbox <postmaster@sandboxd8d81ed30e7848f58295512c3bbb0bfc.mailgun.org>",
            to: ["lizethlobiu@gmail.com"],
            subject: "Información del Cliente",
            text: JSON.stringify(informacionAEnviar),
        })
        .then(msg => {
            console.log('Correo enviado con éxito:', msg);
        })
        .catch(err => {
            console.error('Error al enviar el correo:', err);
        });
    } else {
        console.error('La instancia de Mailgun no está definida. No se pudo enviar el correo.');
    }
}

