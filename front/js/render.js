document.addEventListener("DOMContentLoaded", function () {
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
      diasDelMes.forEach((dia) => {
        const thDia = document.createElement("th");
        thDia.classList.add("border", "border-gray-500", "p-1");
        thDia.textContent = new Date(anio, mes, dia).toLocaleDateString("es-ES", {
          weekday: "short",
        });
        filaDias.appendChild(thDia);
  
        const thFecha = document.createElement("th");
        thFecha.classList.add("border", "border-gray-500", "p-1");
        thFecha.textContent = dia;
        filaFechas.appendChild(thFecha);
      });
  
      // Agregar los turnos de cada trabajador al cuerpo de la tabla
      for (let trabajador in cronograma[1]) {
        const fila = document.createElement("tr");
        const celdaTrabajador = document.createElement("td");
        celdaTrabajador.classList.add(
          "border-2",
          "border-black",
          "p-2",
          "sticky",
          "left-0",
          "text-xl",
          "text-bold"
        );
        celdaTrabajador.textContent = trabajador;
        fila.appendChild(celdaTrabajador);
  
        diasDelMes.forEach((dia) => {
          const celda = document.createElement("td");
          celda.classList.add(
            "border-2",
            "border-gray-900",
            "p-2",
            "text-center",
            "text-2xl"
          );
          celda.textContent = cronograma[dia][trabajador] || "-";
  
          // Aplicar estilos según el turno, manteniendo los originales y añadiendo resaltados para blanco y negro
          if (cronograma[dia][trabajador] === "T") {
            celda.classList.add("bg-white", "border", "border-black"); 
          } else if (cronograma[dia][trabajador] === "F") {
            celda.classList.add(
              "font-bold",
              "text-3xl",
              "border",
              "border-dashed",
              "border-black"
            ); 
          } else if (cronograma[dia][trabajador] === "M") {
            celda.classList.add(
              "bg-yellow-400",
              "border",
              "border-solid",
              "border-black",
              "underline"
            ); 
          } else if (cronograma[dia][trabajador] === "N") {
            celda.classList.add(
              "bg-slate-400",
              "text-lg",
              "italic",
              "border",
              "border-dotted",
              "border-black",
              "font-bold"
            ); 
          }
  
          fila.appendChild(celda);
        });
  
        cuerpoTabla.appendChild(fila);
      }
  
      // Actualizar el mes y año en el encabezado
      const mesAnioTexto = new Date(anio, mes).toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
      document.getElementById("mes-anio").textContent =
        mesAnioTexto.charAt(0).toUpperCase() + mesAnioTexto.slice(1);
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
  
   
  
    // Capturamos el botón "Ir" del formulario y añadimos la funcionalidad
    document.getElementById("ir").addEventListener("click", manejarCronograma);
  
    // Capturamos el evento 'keydown' en el formulario
    document
      .getElementById("form-date")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Evitamos el envío del formulario por defecto
          manejarCronograma(); // Llamamos a la función que maneja el cronograma
        }
      });
  
    // Función que maneja la actualización del cronograma
    function manejarCronograma() {
      // Obtenemos el valor seleccionado del mes y año desde los inputs del formulario
      const mesSeleccionado = parseInt(document.getElementById("mes").value) - 1; // Mes en 0 indexado
      const anioSeleccionado = parseInt(document.getElementById("anio").value);
  
      // Actualizamos los valores globales de mes y año
      mesActual = mesSeleccionado;
      anioActual = anioSeleccionado;
  
      // Generamos y renderizamos el cronograma actualizado
      const nuevoCronograma = generarCronogramaDinamico(mesActual, anioActual);
      renderizarTablaCronograma(nuevoCronograma, mesActual, anioActual);
    }
  });
  