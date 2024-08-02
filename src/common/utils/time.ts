export function isTimeRangeWithinAvailableRange(
  startTime: string,
  endTime: string,
  availableStartTime: string,
  availableEndTime: string,
) {
  // Función auxiliar para parsear una cadena de tiempo y devolver la cantidad total de segundos
  function parseTimeToSeconds(timeStr: string) {
    // Dividir el tiempo en horas, minutos y segundos
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Convertir los tiempos a segundos desde la medianoche
  const startInSeconds = parseTimeToSeconds(startTime);
  const endInSeconds = parseTimeToSeconds(endTime);
  const availableStartInSeconds = parseTimeToSeconds(availableStartTime);
  const availableEndInSeconds = parseTimeToSeconds(availableEndTime);

  // Verificar si el rango de tiempo está completamente dentro del intervalo disponible
  return (
    startInSeconds >= availableStartInSeconds &&
    endInSeconds <= availableEndInSeconds
  );
}

export function calculateEndTime(startTime: string, durationMinutes: number) {
  // Función auxiliar para parsear una cadena de tiempo y devolver la cantidad total de minutos
  function parseTimeToMinutes(timeStr: string) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Función auxiliar para formatear minutos totales a una cadena de tiempo "HH:mm"
  function formatMinutesToTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // Asegurar que los minutos siempre tengan dos dígitos
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Convertir el startTime a minutos desde la medianoche
  const startMinutes = parseTimeToMinutes(startTime);

  // Calcular los minutos totales del endTime
  const endMinutes = startMinutes + durationMinutes;

  // Convertir los minutos totales de vuelta a una cadena de tiempo
  return formatMinutesToTime(endMinutes);
}

export function isDateValidAndAvailable(
  dateObj: Date,
  availableDays: string[],
): boolean {
  // Obtener la fecha actual y establecer la hora a medianoche para comparación precisa
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verificar si la fecha es igual o mayor a hoy
  if (dateObj < today) {
    return false;
  }

  // Mapeo de los nombres de días en inglés a los valores de getDay()
  const dayMap: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Obtener el día de la semana del objeto Date dado
  const inputDay: string = dayMap[dateObj.getDay()];

  // Verificar si el día está en el array de días disponibles
  return availableDays.includes(inputDay);
}
