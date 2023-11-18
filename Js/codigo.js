var boletos = [
    { tipo: "VIP", precio: 1500, disponibilidad: 5 },
    { tipo: "Golden", precio: 1000, disponibilidad: 10 },
    { tipo: "platino", precio: 900, disponibilidad: 5 },
    { tipo: "discapacitado", precio: 400, disponibilidad: 4 },
];

let boletosComprados = {
    "vip": 0,
    "golden": 0,
    "platino": 0,
    "discapacitado": 0,
};


let continuarComprando = true;

var boletosDisponibles = boletos.filter(function(boleto) {
    return boleto.tipo === "VIP" && boleto.precio <= 100 && boleto.disponibilidad > 0;
});
console.log(boletosDisponibles);



while (continuarComprando) {
    let tipoBoleto = prompt("¿Qué tipo de boleto deseas comprar (VIP, Golden, Platino o Discapacitado)?");

    if (tipoBoleto === null) {
        continuarComprando = false;
    } else {
        tipoBoleto = tipoBoleto.toLowerCase();

        if (boletosDisponibles[tipoBoleto] === undefined) {
            alert("Tipo de boleto no válido. Por favor, elige entre VIP, Golden, Platino o Discapacitado.");
        } else if (boletosDisponibles[tipoBoleto] === 0) {
            alert(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
        } else {
            let cantidad = prompt(`¿Cuántos boletos ${tipoBoleto} deseas comprar?`);
            cantidad = parseInt(cantidad);

            if (!isNaN(cantidad) && cantidad > 0) {
                if (cantidad > boletosDisponibles[tipoBoleto]) {
                    alert(`Lo siento, no hay suficientes boletos en la zona ${tipoBoleto} disponibles.`);
                } else {
                    boletosDisponibles[tipoBoleto] -= cantidad;
                    boletosComprados[tipoBoleto] += cantidad;
                    let costoTotal = cantidad * precios[tipoBoleto];
                    alert(`Has comprado ${cantidad} boletos ${tipoBoleto}. Total a pagar= ${costoTotal}`);
                }
            } else {
                alert("Por favor, introduce una cantidad válida de boletos.");
            }
        }
    }
}

let boletosTotales = 0;
for (let tipo in boletosComprados) {
    boletosTotales += boletosComprados[tipo];
}

if (boletosTotales > 0) {
    alert(`Gracias por tu compra. Has comprado un total de ${boletosTotales} boletos.`);
} else {
    alert("No se ha realizado ninguna compra.");
}
