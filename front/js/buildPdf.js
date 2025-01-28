document.getElementById("btnGenerarPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const element = document.getElementById("imprimible");

  // Función para crear una tabla de quincena
  function crearTablaQuincena(element, inicio, fin, mostrarNombres = true) {
    const tabla = document.createElement("table");
    tabla.style.width = "auto"; // Cambiar de 100% a auto para evitar redimensionado
    tabla.style.borderCollapse = "collapse";
    tabla.style.marginBottom = "20px";
  
    // Obtener el ancho original de las columnas desde la tabla principal
    const anchoColumnas = Array.from(
      element.querySelector("thead tr:first-child").cells,
    ).map((cell) => (cell.offsetWidth)-10);
  
    // Clonar las filas del encabezado
    const headerOriginal = element.querySelector("thead");
    const header = headerOriginal.cloneNode(true);
  
    // Ajustar el encabezado para mostrar solo los días de la quincena
    const filaDias = header.querySelector("tr:first-child");
    const filaFechas = header.querySelector("tr:nth-child(2)");
  
    Array.from(filaDias.cells).forEach((cell, index) => {
      if ((mostrarNombres && index === 0) || (index >= inicio && index <= fin)) {
        cell.style.width = `${anchoColumnas[index]}px`;
        cell.style.height = "15px";
        cell.style.fontSize = "10px";
        cell.style.border = "1px solid black";
        cell.style.backgroundColor = "lightgray";
      } else {
        cell.remove();
      }
    });
  
    Array.from(filaFechas.cells).forEach((cell, index) => {
      if ((mostrarNombres && index === 0) || (index >= inicio && index <= fin)) {
        cell.style.width = `${anchoColumnas[index]}px`;
        cell.style.height = "1px";
        cell.style.fontSize = "12px";
        cell.style.padding = "2px";
        cell.style.border = "1px solid white";
        cell.style.backgroundColor = "black";
        cell.style.color = "white";
      } else {
        cell.remove();
      }
    });
  
    tabla.appendChild(header);
  
    // Crear el cuerpo de la tabla
    const tbody = document.createElement("tbody");
    const filasOriginales = element.querySelectorAll("tbody tr");
  
    filasOriginales.forEach((filaOriginal) => {
      const fila = document.createElement("tr");
  
      // Clonar las celdas necesarias
      Array.from(filaOriginal.cells).forEach((cell, index) => {
        if ((mostrarNombres && index === 0) || (index >= inicio && index <= fin)) {
          const nuevaCelda = cell.cloneNode(true);
          nuevaCelda.style.width = `${anchoColumnas[index]}px`;
          nuevaCelda.style.height = "15px";
          nuevaCelda.style.fontSize = "15px";
          nuevaCelda.style.padding = "1px";
          nuevaCelda.style.border = "1px solid black";
          nuevaCelda.style.textAlign = "center";
  
          // Mantener solo el contenido del turno
          if (index > 0) {
            nuevaCelda.style.backgroundColor = "white";
            nuevaCelda.style.color = "black";
          }
  
          fila.appendChild(nuevaCelda);
        }
      });
  
      tbody.appendChild(fila);
    });
  
    tabla.appendChild(tbody);
    return tabla;
  }
  

  // Crear el contenedor para las dos tablas
  const contenedor = document.createElement('div');
  contenedor.style.margin = '0';
  contenedor.style.padding = '0';

  
  // Obtener el título del mes y año
  const mesAnio = document.getElementById('mes-anio').textContent;
  const titulo = document.createElement('h2');
  titulo.textContent = mesAnio;
  titulo.style.textAlign = 'center';
  titulo.style.marginBottom = '10px';
  titulo.style.fontSize = '20px';
  titulo.style.fontWeight = 'bold';
  contenedor.appendChild(titulo);

  // Crear las dos tablas (primera y segunda quincena)
  const primeraQuincena = crearTablaQuincena(element, 1, 15, true);
  const segundaQuincena = crearTablaQuincena(element, 16, 31, false);

  contenedor.appendChild(primeraQuincena);
  contenedor.appendChild(segundaQuincena);

  // Agregar el contenedor al documento temporalmente
  document.body.appendChild(contenedor);

  //Recorremos todo el contenedor para dejar con Negrita solo las celdas con valor "F"
  let celdas = contenedor.querySelectorAll('td');
  celdas.forEach(celda => {
    if (celda.textContent === 'F') {
      celda.style.fontWeight = 'bold';
    } else {
      celda.style.fontWeight = 'normal';
      celda.style.textDecoration = 'none';
      celda.style.fontStyle = 'normal';
    }
  });

  // Generar el PDF
  html2canvas(contenedor).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = 297; // A4 landscape
    const pageHeight = 210;
    const margin = -5;

    const printableWidth = pageWidth - margin;
    const printableHeight = pageHeight - margin;

    let imgWidth = printableWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > printableHeight) {
      imgHeight = printableHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Centrar la imagen en la página
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    doc.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);

    // Limpiar
    document.body.removeChild(contenedor);
  });
});