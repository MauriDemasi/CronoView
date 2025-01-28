// Definimos un patrón común para todos los trabajadores
const patronComun = [
    "T",
    "T",
    "T",
    "F",
    "M",
    "M",
    "M",
    "F",
    "N",
    "N",
    "N",
    "F",
  ];
  
  // Índices de inicio para cada empleado en el patrón
  const indicesInicio = {
    CLAUDIA: 0, // Comienza en el día 1
    HERNAN: 9, // Comienza en el día 10
    MAURICIO: 6, // Comienza en el día 7
    SANTIAGO: 3, // Comienza en el día 4
  };
  
  
  // Función para calcular el número total de días desde el 1 de octubre de 2024 hasta una fecha específica
  function calcularDiasDesdeOrigen(mes, anio) {
      const fechaInicio = new Date(2024, 9, 1); // 1 de Octubre de 2024
      const fechaObjetivo = new Date(anio, mes, 1);
      const diferenciaEnMs = fechaObjetivo - fechaInicio;
      return Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));
  }
  
  // Variables para el mes y año actuales 
  
  const fechaActual = new Date();
  
  let mesActual = fechaActual.getMonth()+1;
  let anioActual = fechaActual.getFullYear();
  
  
  // Función para generar el cronograma mensual dinámico para cualquier mes
  function generarCronogramaDinamico(mes, anio) {
    const diasDelMes = new Date(anio, mes + 1, 0).getDate(); // Calcula la cantidad de días del mes
    const cronograma = {};
  
    // Calcular el número total de días desde el 1 de octubre de 2024
    const diasDesdeOctubre = calcularDiasDesdeOrigen(mes, anio);
  
    // Para cada día del mes
    for (let dia = 1; dia <= diasDelMes; dia++) {
      cronograma[dia] = {};
  
      // Para cada trabajador, asignar el turno correspondiente basado en su índice
      for (let trabajador in indicesInicio) {
        const indiceInicio = indicesInicio[trabajador]; // Índice inicial del trabajador
        const patronLength = patronComun.length; // Longitud del patrón
  
        // Calcular el índice del patrón para este día
        const indice =
          (((indiceInicio + diasDesdeOctubre + (dia - 1)) % patronLength) +
            patronLength) %
          patronLength;
  
        cronograma[dia][trabajador] = patronComun[indice]; // Asignar el turno del día
      }
    }
  
    return cronograma;
  }
  
  