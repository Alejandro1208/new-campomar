
document.addEventListener("DOMContentLoaded", function () {
    // Mover esto justo antes del cierre del DOMContentLoade

    const facturasDiv = document.getElementById("facturas");
    const agregarFacturaBtn = document.getElementById("agregarFactura");
    const formasPagoDiv = document.getElementById("formasPago");
    const agregarFormaPagoBtn = document.getElementById("agregarFormaPago");
    const fechaPagoTransferenciaInput = document.getElementById(
        "fechaPagoTransferencia"
    );
    const calcularDescuentoBtn = document.getElementById("calcularDescuento");
    const resultadosDiv = document.getElementById("resultados");
    
    // Elementos para mostrar resultados
    const promedioDiasDesc1Span = document
        .getElementById("promedioDiasDesc1")
        .querySelector("span");
    const promedioDiasDesc2Span = document
        .getElementById("promedioDiasDesc2")
        .querySelector("span");
    const porcentajeDescuento1Span = document
        .getElementById("porcentajeDescuento1")
        .querySelector("span");
    const porcentajeDescuento2Span = document
        .getElementById("porcentajeDescuento2")
        .querySelector("span");
    const porcentajeDescuentoTotalSpan = document
        .getElementById("porcentajeDescuentoTotal")
        .querySelector("span");
    const importeTotalSinDescuentoSpan = document
        .getElementById("importeTotalSinDescuento")
        .querySelector("span");
    const importeTotalConDescuentoSpan = document
        .getElementById("importeTotalConDescuento")
        .querySelector("span");
    
    // Inicializar los valores en cero
    promedioDiasDesc1Span.textContent = "0.00";
    promedioDiasDesc2Span.textContent = "0.00";
    porcentajeDescuento1Span.textContent = "0.00%";
    porcentajeDescuento2Span.textContent = "0.00%";
    porcentajeDescuentoTotalSpan.textContent = "0.00%";
    importeTotalSinDescuentoSpan.textContent = "0.00";
    importeTotalConDescuentoSpan.textContent = "0.00";
    
    let contadorFacturas = 0;
    let contadorFormasPago = 0;

    document.getElementById('reiniciarCalculadora').addEventListener('click', function (e) {
        e.preventDefault();
        
        // Limpiar fecha de pago
        fechaPagoTransferenciaInput.value = '';
        
        // Eliminar facturas individualmente
        const facturas = facturasDiv.querySelectorAll('.factura');
        facturas.forEach(factura => factura.remove());
        
        // Eliminar formas de pago individualmente
        const formasPago = formasPagoDiv.querySelectorAll('.formaPago');
        formasPago.forEach(formaPago => formaPago.remove());
        
        // Reiniciar contadores
        contadorFacturas = 0;
        contadorFormasPago = 0;
        
        // Reiniciar valores de resultados
        promedioDiasDesc1Span.textContent = "0.00";
        promedioDiasDesc2Span.textContent = "0.00";
        porcentajeDescuento1Span.textContent = "0.00%";
        porcentajeDescuento2Span.textContent = "0.00%";
        porcentajeDescuentoTotalSpan.textContent = "0.00%";
        importeTotalSinDescuentoSpan.textContent = "0.00";
        importeTotalConDescuentoSpan.textContent = "0.00";
        
        // Scroll suave al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    
    // Función para animar valores desde 0 hasta el valor final
    function animateValue(element, start, end, duration) {
        const isPercent = typeof end === "string" && end.includes("%");
        const endValue = isPercent ? parseFloat(end) : parseFloat(end);
    
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1
            );
            const currentValue = progress * endValue;
    
            if (isPercent) {
                element.textContent = currentValue.toFixed(2) + "%";
            } else {
                // Format numbers with dots for thousands and comma for decimals
                const parts = currentValue.toFixed(2).split('.');
                const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                element.textContent = integerPart + ',' + parts[1];
            }
    
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Agregar Comprobantes / Facturas
    agregarFacturaBtn.addEventListener("click", function () {
        contadorFacturas++;
    
        const facturaDiv = document.createElement("div");
        facturaDiv.classList.add("factura");
        facturaDiv.style.opacity = "0"; // Inicialmente oculto
        // In the facturaDiv.innerHTML template:
        facturaDiv.innerHTML = `
            <div class="factura-header">
                <h3>Comprobante / Factura #${contadorFacturas}</h3>
                <button class="eliminar-factura" data-id="${contadorFacturas}">×</button>
            </div>
            <div class="input-wrapper">
                <label for="fechaFactura${contadorFacturas}">Fecha:</label>
                <p class="aclaracion">Ingrese la fecha de emisión de la factura.</p>
                <input type="date" id="fechaFactura${contadorFacturas}" class="fechaFactura" placeholder="Seleccione la fecha">
            </div>
            <div class="input-wrapper">
                <label for="importeFactura${contadorFacturas}">Importe:</label>
                <input type="text" id="importeFactura${contadorFacturas}" class="importeFactura" placeholder="Ingrese el importe">
            </div>
        `;
    
        facturasDiv.appendChild(facturaDiv);
    
        // Forzar reflow para asegurar la animación
        facturaDiv.offsetHeight;
        facturaDiv.style.opacity = "1";
    
        // Agregar evento para el botón de eliminar
        const eliminarBtn = facturaDiv.querySelector(".eliminar-factura");
        eliminarBtn.addEventListener("click", function () {
            facturaDiv.remove();
        });
    });
    
    // Agregar Formas de Pago
    agregarFormaPagoBtn.addEventListener("click", function () {
        contadorFormasPago++;
    
        const formaPagoDiv = document.createElement("div");
        formaPagoDiv.classList.add("formaPago");
        formaPagoDiv.style.opacity = "0"; // Inicialmente oculto
        // In the formaPagoDiv.innerHTML template:
        formaPagoDiv.innerHTML = `
            <div class="factura-header">
                <h3>Forma de Pago #${contadorFormasPago}</h3>
                <button class="eliminar-factura" data-id="${contadorFormasPago}">×</button>
            </div>
            <div class="input-wrapper">
                <label for="formaPago${contadorFormasPago}">Forma de Pago:</label>
                <select id="formaPago${contadorFormasPago}" class="formaPagoSelect">
                    <option value="" disabled selected>Seleccione una forma de pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="cheque">Cheque (Físico o Electrónico)</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="anticipo">Anticipo</option>
                </select>
            </div>
            <div class="input-wrapper">
                <label for="fechaPago${contadorFormasPago}">Fecha:</label>
                <a href="#instruccionesFechas" class="instrucciones-link" onclick="document.getElementById('instruccionesFechas').open = true">
                    <i class="fas fa-info-circle"></i>
                    Ver instrucciones
                </a>
                <input type="date" id="fechaPago${contadorFormasPago}" class="fechaPago" placeholder="Seleccione la fecha">
            </div>
            <div class="input-wrapper">
                <label for="importePago${contadorFormasPago}">Importe:</label>
                <input type="text" id="importePago${contadorFormasPago}" class="importePago" placeholder="Ingrese el importe">
            </div>
        `;
    
        formasPagoDiv.appendChild(formaPagoDiv);
    
        // Forzar reflow para asegurar la animación
        formaPagoDiv.offsetHeight;
        formaPagoDiv.style.opacity = "1";
    
        // Agregar evento para el botón de eliminar
        const eliminarBtn = formaPagoDiv.querySelector(".eliminar-factura");
        eliminarBtn.addEventListener("click", function () {
            formaPagoDiv.remove();
        });
    });
    
    // Calcular Descuento
    calcularDescuentoBtn.addEventListener("click", function () {
        if (!fechaPagoTransferenciaInput.value) {
            alert("Por favor, ingrese la fecha de recibo físico");
            return;
        }
    
        const fechaReciboFisico = moment(
            fechaPagoTransferenciaInput.value,
            "YYYY-MM-DD"
        );
        console.log(
            "Valor del input fechaPagoTransferenciaInput:",
            fechaPagoTransferenciaInput.value
        );
        console.log("Fecha de Recibo Físico:", fechaReciboFisico.format('YYYY-MM-DD'));
    
        // Variables para Descuento 1 (basado en facturas)
        let totalDiasPonderadosDesc1 = 0;
        let totalImporteFacturas = 0;
    
        // Obtener todas las facturas
        const facturas = facturasDiv.querySelectorAll(".factura");
        const facturasData = [];
    
        if (facturas.length === 0) {
            alert("Debe agregar al menos una factura");
            return;
        }
    
        let facturaValida = false;
    
        // Recopilar datos de facturas para usarlos en ambos cálculos
        facturas.forEach((factura) => {
            const fechaFacturaInput = factura.querySelector(".fechaFactura");
            const importeFacturaInput = factura.querySelector(".importeFactura");
    
            if (!fechaFacturaInput.value || !importeFacturaInput.value) return;
    
            const fechaFactura = moment(fechaFacturaInput.value, "YYYY-MM-DD");
            const importeFactura = Math.floor(parseFloat(
                importeFacturaInput.value.replace(/\./g, "").replace(/,/g, ".")
            ));
    
            if (isNaN(importeFactura)) {
                return;
            }
    
            facturaValida = true;
            totalImporteFacturas += importeFactura;
            const diasFactura = calcularDias360(fechaFactura, fechaReciboFisico);
            totalDiasPonderadosDesc1 += diasFactura * importeFactura;
    
            facturasData.push({
                fecha: fechaFactura,
                dias: diasFactura,
                importe: importeFactura,
            });
        });
    
        if (!facturaValida) {
            alert(
                "Por favor, ingrese al menos una factura válida con fecha e importe"
            );
            return;
        }
    
        // Promedio ponderado para Descuento 1
        const promedioDiasDesc1 = totalImporteFacturas > 0
            ? Math.round((totalDiasPonderadosDesc1 / totalImporteFacturas) * 100) / 100
            : 0;
        console.log("Total Importe Facturas:", totalImporteFacturas);
        console.log("Total Días Ponderados Desc1:", totalDiasPonderadosDesc1);
        console.log("Promedio Días Desc1:", promedioDiasDesc1);
    
        // Obtener todas las formas de pago
        const formasPago = formasPagoDiv.querySelectorAll(".formaPago");
        const pagoData = [];
    
        if (formasPago.length === 0) {
            alert("Debe agregar al menos una forma de pago");
            return;
        }
    
        let formaPagoValida = false;
        let totalImportePagos = 0;
    
        // Recolectar información sobre formas de pago
        formasPago.forEach((formaPago) => {
            const formaPagoSelect = formaPago.querySelector(".formaPagoSelect");
            const fechaPagoInput = formaPago.querySelector(".fechaPago");
            const importePagoInput = formaPago.querySelector(".importePago");
    
            if (!fechaPagoInput.value || !importePagoInput.value) return;
    
            const tipoPago = formaPagoSelect.value;
            const fechaPago = moment(fechaPagoInput.value, "YYYY-MM-DD");
            console.log(
                "Valor del input fechaPagoInput:",
                fechaPagoInput.value
            );
            console.log("Fecha Pago:", fechaPago.format('YYYY-MM-DD'));
            const importePago = Math.floor(parseFloat(
                importePagoInput.value.replace(/\./g, "").replace(/,/g, ".")
            ));
    
            if (isNaN(importePago)) {
                return;
            }
    
            formaPagoValida = true;
            totalImportePagos += importePago;
    
            pagoData.push({
                tipo: tipoPago,
                fecha: fechaPago,
                importe: importePago,
            });
        });
    
        if (!formaPagoValida) {
            alert(
                "Por favor, ingrese al menos una forma de pago válida con fecha e importe"
            );
            return;
        }
    
        // CORRECCIÓN PARA EL SEGUNDO PROMEDIO
        // Calcular el promedio de las fechas de los comprobantes
        let sumaMilisegundos = 0;
        facturasData.forEach(factura => {
            sumaMilisegundos += factura.fecha.valueOf();
        });
        const fechaPromedioComprobantes = moment(sumaMilisegundos / facturasData.length);
        console.log("Fecha promedio de comprobantes:", fechaPromedioComprobantes.format('YYYY-MM-DD'));
    
        // Calcular los días entre la fecha promedio y cada fecha de forma de pago
        let totalDiasPonderadosDesc2 = 0;
        pagoData.forEach(pago => {
            const diasPago = calcularDias360(fechaPromedioComprobantes, pago.fecha);
            totalDiasPonderadosDesc2 += diasPago * Math.floor(pago.importe);
        });
    
        // Promedio ponderado para Descuento 2
        const promedioDiasDesc2 = totalImportePagos > 0 
        ? Math.round((totalDiasPonderadosDesc2 / totalImportePagos) * 100) / 100
        : 0;
        console.log("Total Importe Pagos:", totalImportePagos);
        console.log("Total Días Ponderados Desc2:", totalDiasPonderadosDesc2);
        console.log("Promedio Días Desc2:", promedioDiasDesc2);
    
        // Nuevo cálculo de descuentos
        const descuentos = calcularDescuentoCombinado(
            promedioDiasDesc1,
            promedioDiasDesc2
        );
        let porcentajeDesc1 = descuentos.desc1;
        let porcentajeDesc2 = descuentos.desc2;
    
        // Aplicar los descuentos al importe total (aplicación en cascada)
        const importeDespuesDescuento1 =
            totalImporteFacturas * (1 - porcentajeDesc1);
        const descuento1Total = totalImporteFacturas - importeDespuesDescuento1;
        const descuento2Total = importeDespuesDescuento1 * porcentajeDesc2;
        const descuentoTotal = descuento1Total + descuento2Total;
    
        // Calcular importes finales
        const importeTotalSinDescuento = totalImporteFacturas;
        const importeTotalConDescuento =
            importeTotalSinDescuento - descuentoTotal;
    
        // Calcular porcentaje total de descuento efectivo
        const porcentajeDescuentoTotal =
            (descuentoTotal / importeTotalSinDescuento) * 100;
        const porcDesc1 = (porcentajeDesc1 * 100).toFixed(2);
        const porcDesc2 = (porcentajeDesc2 * 100).toFixed(2);
        const porcDescTotal = porcentajeDescuentoTotal.toFixed(2);
    
        // Animar los valores (desde 0 hasta el valor calculado)
        animateValue(
            promedioDiasDesc1Span,
            0,
            promedioDiasDesc1.toFixed(2),
            1000
        );
        animateValue(
            promedioDiasDesc2Span,
            0,
            promedioDiasDesc2.toFixed(2),
            1000
        );
        setTimeout(() => {
            document.getElementById('resultados').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        }, 100);
        animateValue(porcentajeDescuento1Span, 0, porcDesc1 + "%", 1000);
        animateValue(porcentajeDescuento2Span, 0, porcDesc2 + "%", 1000);
        animateValue(
            porcentajeDescuentoTotalSpan,
            0,
            porcDescTotal + "%",
            1000
        );
        animateValue(
            importeTotalSinDescuentoSpan,
            0,
            importeTotalSinDescuento.toFixed(2),
            1000
        );
        animateValue(
            importeTotalConDescuentoSpan,
            0,
            importeTotalConDescuento.toFixed(2),
            1000
        );
    });
    
    
    // Función revisada para calcular el descuento combinado según ambos promedios
    function calcularDescuentoCombinado(promedioDias1, promedioDias2) {
        let desc1 = 0;
        let desc2 = 0;

        // Determinar descuento 1 según el primer promedio
        if (promedioDias1 <= 30) {
            desc1 = 0.1; // 10%
        } else if (promedioDias1 <= 45) {
            desc1 = 0.0;
        } else {
            return { desc1: 0, desc2: 0 };
        }

        // Determinar descuento 2 según ambos promedios
        if (promedioDias1 <= 30) {
            // Si el primer promedio es <= 30, aplicamos la primera fila de descuentos
            if (promedioDias2 <= 10) {
                desc2 = 0.2; // 20%
            } else if (promedioDias2 <= 30) {
                desc2 = 0.17; // 17%
            } else if (promedioDias2 <= 60) {
                desc2 = 0.15; // 15%
            } else if (promedioDias2 <= 70) {
                desc2 = 0.1; // 10%
            }
        } else if (promedioDias1 <= 45) {
            // Si el primer promedio es > 30 y <= 45, aplicamos la segunda fila
            if (promedioDias2 <= 60) {
                desc2 = 0.15; // 15%
            } else if (promedioDias2 <= 70) {
                desc2 = 0.1; // 10%
            }
        }

        return { desc1, desc2 };
    }
    
    // Función DIAS360 ajustada para replicar exactamente Excel
    function calcularDias360(fecha1, fecha2) {
        // Convertir las fechas a objetos Date de JavaScript
        const jsFecha1 = fecha1.toDate();
        const jsFecha2 = fecha2.toDate();
    
        // Extraer día, mes y año de la fecha1
        let d1 = jsFecha1.getDate();
        let m1 = jsFecha1.getMonth() + 1;
        let y1 = jsFecha1.getFullYear();
    
        // Extraer día, mes y año de la fecha2
        let d2 = jsFecha2.getDate();
        let m2 = jsFecha2.getMonth() + 1;
        let y2 = jsFecha2.getFullYear();
    
        // Implementación estándar de DIAS360 (método US/NASD)
        if (d1 === 31) d1 = 30;
        if (d2 === 31) {
            if (d1 >= 30) {
                d2 = 30;
            }
        }
    
        return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
    }



    // Move this inside DOMContentLoaded, before the closing bracket
    document.addEventListener("input", function (e) {
        if (e.target.matches(".importeFactura, .importePago")) {
            // Get cursor position
            const cursorPos = e.target.selectionStart;
            
            // Remove any character that's not a number, dot, or comma
            let value = e.target.value.replace(/[^\d.,]/g, '');
            
            // Replace all dots with nothing (we'll add them back for thousands)
            value = value.replace(/\./g, '');
            
            // Ensure only one comma
            const parts = value.split(',');
            if (parts.length > 2) {
                value = parts[0] + ',' + parts[1];
            }
            
            // Handle the integer part (add dots for thousands)
            const integerPart = parts[0];
            let formattedInteger = '';
            for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
                if (j > 0 && j % 3 === 0) {
                    formattedInteger = '.' + formattedInteger;
                }
                formattedInteger = integerPart[i] + formattedInteger;
            }
            
            // Add decimal part if it exists
            let formattedValue = formattedInteger;
            if (parts.length > 1) {
                // Limit to 2 decimal places
                formattedValue += ',' + parts[1].slice(0, 2);
            }
            
            e.target.value = formattedValue;
            
            // Store raw value for calculations
            e.target.dataset.rawValue = parseFloat(value.replace(',', '.')) || 0;
            
            // Restore cursor position with adjustment for added dots
            const dotsBeforeCursor = formattedValue
                .slice(0, cursorPos)
                .split('.')
                .length - 1;
            const newCursorPos = cursorPos + dotsBeforeCursor;
            e.target.setSelectionRange(newCursorPos, newCursorPos);
        }
    });
    });