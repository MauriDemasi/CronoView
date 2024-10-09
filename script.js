// script.js

// Definimos un patrón común para todos los trabajadores
const patronComun = ["T", "T", "T", "F", "M", "M", "M", "F", "N", "N", "N", "F"];

// Índices de inicio para cada empleado en el patrón
const indicesInicio = {
    "CLAUDIA": 0, // Comienza en el día 1
    "HERNAN": 9,  // Comienza en el día 10
    "MAURICIO": 6, // Comienza en el día 7
    "SANTIAGO": 3  // Comienza en el día 4
};

// Variables para el mes y año actuales
let mesActual = 9;  // Octubre (mes indexado en 0, 9 es Octubre)
let anioActual = 2024;

// Función para calcular el número total de días desde el 1 de octubre de 2024 hasta una fecha específica
function calcularDiasDesdeOctubre(mes, anio) {
    const fechaInicio = new Date(2024, 9, 1); // 1 de Octubre de 2024
    const fechaObjetivo = new Date(anio, mes, 1);
    const diferenciaEnMs = fechaObjetivo - fechaInicio;
    return Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));
  }
  

// Función para generar el cronograma mensual dinámico para cualquier mes
function generarCronogramaDinamico(mes, anio) {
    const diasDelMes = new Date(anio, mes + 1, 0).getDate(); // Calcula la cantidad de días del mes
    const cronograma = {};

    // Calcular el número total de días desde el 1 de octubre de 2024
    const diasDesdeOctubre = calcularDiasDesdeOctubre(mes, anio);

    // Para cada día del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {
        cronograma[dia] = {};

        // Para cada trabajador, asignar el turno correspondiente basado en su índice
        for (let trabajador in indicesInicio) {
            const indiceInicio = indicesInicio[trabajador]; // Índice inicial del trabajador
            const patronLength = patronComun.length; // Longitud del patrón

            // Calcular el índice del patrón para este día
            const indice = ((indiceInicio + diasDesdeOctubre + (dia - 1)) % patronLength + patronLength) % patronLength;

            cronograma[dia][trabajador] = patronComun[indice]; // Asignar el turno del día
        }
    }

    return cronograma;
}

// Función para renderizar la tabla en HTML
function renderizarTablaCronograma(cronograma, mes, anio) {
    const tabla = document.getElementById("tabla-cronograma");
    const cuerpoTabla = document.getElementById("cuerpo-tabla");
    const filaDias = tabla.querySelector("thead tr:first-child"); // Primera fila del encabezado (días)
    const filaFechas = tabla.querySelector("thead tr:nth-child(2)"); // Segunda fila del encabezado (fechas)

    // Limpiar la tabla antes de volver a llenarla
    cuerpoTabla.innerHTML = "";
    filaDias.innerHTML = `<th class="border-0"></th>`;
    filaFechas.innerHTML = `<th class="border-0"></th>`;

    // Generar los días del mes en la primera fila del encabezado
    const diasDelMes = Object.keys(cronograma);
    diasDelMes.forEach(dia => {
        const thDia = document.createElement("th");
        thDia.classList.add("border", "border-gray-500", "p-2");
        thDia.textContent = new Date(anio, mes, dia).toLocaleDateString("es-ES", { weekday: 'short' });
        filaDias.appendChild(thDia);

        const thFecha = document.createElement("th");
        thFecha.classList.add("border", "border-gray-500", "p-2");
        thFecha.textContent = dia;
        filaFechas.appendChild(thFecha);
    });

    // Agregar los turnos de cada trabajador al cuerpo de la tabla
    for (let trabajador in cronograma[1]) {
        const fila = document.createElement("tr");
        const celdaTrabajador = document.createElement("td");
        celdaTrabajador.classList.add("border-2", "border-black", "p-3", "sticky", "left-0", "bg-gray-200" , "text-xl");
        celdaTrabajador.textContent = trabajador;
        fila.appendChild(celdaTrabajador);

        diasDelMes.forEach(dia => {
          const celda = document.createElement("td");
          celda.classList.add(
            "border-2",
            "border-gray-900",
            "p-3",
            "text-center",
            "text-base"
          );
          celda.textContent = cronograma[dia][trabajador] || "-";

          // Aplicar estilos según el turno, manteniendo los originales y añadiendo resaltados para blanco y negro
          if (cronograma[dia][trabajador] === "T") {
            celda.classList.add("bg-white", "border", "border-black"); // Fondo blanco y borde negro
          } else if (cronograma[dia][trabajador] === "F") {
            celda.classList.add(
              "bg-gray-900",
              "font-bold",
              "text-3xl",
              "text-white",
              "border",
              "border-dashed",
              "border-black"
            ); // Negrita, grande, texto blanco y borde punteado negro
          } else if (cronograma[dia][trabajador] === "M") {
            celda.classList.add(
              "bg-yellow-400",
              "border",
              "border-solid",
              "border-black",
              "underline"
            ); // Fondo amarillo, borde sólido negro y subrayado
          } else if (cronograma[dia][trabajador] === "N") {
            celda.classList.add(
              "bg-slate-400",
              "text-lg",
              "italic",
              "border",
              "border-dotted",
              "border-black",
              "font-bold"
            ); // Fondo gris, texto grande, itálica, borde punteado negro
          }

          fila.appendChild(celda);
        });

        cuerpoTabla.appendChild(fila);
    }

    // Actualizar el mes y año en el encabezado
    const mesAnioTexto = new Date(anio, mes).toLocaleString("es-ES", { month: "long", year: "numeric" });
    document.getElementById("mes-anio").textContent = mesAnioTexto.charAt(0).toUpperCase() + mesAnioTexto.slice(1);
}


// Renderizar el cronograma inicial
const cronogramaInicial = generarCronogramaDinamico(mesActual, anioActual);
renderizarTablaCronograma(cronogramaInicial, mesActual, anioActual);

// Botones para cambiar de mes
document.getElementById("btnAnterior")?.addEventListener("click", () => {
    mesActual = mesActual === 0 ? 11 : mesActual - 1;
    if (mesActual === 11) anioActual--;
    const nuevoCronograma = generarCronogramaDinamico(mesActual, anioActual);
    renderizarTablaCronograma(nuevoCronograma, mesActual, anioActual);
});

document.getElementById("btnSiguiente")?.addEventListener("click", () => {
    mesActual = mesActual === 11 ? 0 : mesActual + 1;
    if (mesActual === 0) anioActual++;
    const nuevoCronograma = generarCronogramaDinamico(mesActual, anioActual);
    renderizarTablaCronograma(nuevoCronograma, mesActual, anioActual);
});

// Action para generar un PDF
document.getElementById("btnGenerarPDF").addEventListener("click", () => {
    // Acceder a jsPDF de la manera correcta
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("imprimible");
    
    // Clonar el elemento
    const clonedElement = element.cloneNode(true); // Clonamos el elemento original

    // Opcional: puedes ocultar el clon o realizar ajustes en él si es necesario
    // clonedElement.style.display = 'none'; // Por ejemplo, ocultarlo

    // Añadir el clon al DOM para que pueda ser capturado por html2canvas
    document.body.appendChild(clonedElement);

    html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Dimensiones de A4 en posición horizontal (landscape)
        const pageWidth = 297; // Ancho en mm
        const pageHeight = 210; // Alto en mm

        // Definir márgenes (en mm)
        const marginLeft = 10;
        const marginRight = 10;
        const marginTop = 10;
        const marginBottom = 10;

        // Calcular el área imprimible
        const printableWidth = pageWidth - marginLeft - marginRight;
        const printableHeight = pageHeight - marginTop - marginBottom;

        // Calcular las dimensiones de la imagen manteniendo la proporción
        let imgWidth = printableWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Si la altura calculada es mayor que el área imprimible, ajustar
        if (imgHeight > printableHeight) {
            imgHeight = printableHeight;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        // Crear un nuevo documento PDF en orientación horizontal
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Añadir la imagen original al PDF
        doc.addImage(imgData, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);

        // Capturar el clon del elemento para añadirlo al PDF
        html2canvas(clonedElement).then((additionalCanvas) => {
            const additionalImgData = additionalCanvas.toDataURL('image/png');
            const additionalImgHeight = (additionalCanvas.height * imgWidth) / additionalCanvas.width;

            // Calcular la posición Y para el clon
            const yOffset = marginTop + imgHeight + 20; // Offset de 10 mm entre las dos imágenes
            doc.addImage(additionalImgData, 'PNG', marginLeft, yOffset, imgWidth, additionalImgHeight);

            // Guardar el PDF
            doc.save('cronograma.pdf');

            // Limpiar el DOM, eliminando el clon después de que se haya generado el PDF
            document.body.removeChild(clonedElement);
        });
    });
});

