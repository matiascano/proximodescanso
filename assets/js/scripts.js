// Obtenemos el año actual
const year = new Date().getFullYear();

// Obtenemos la fecha actual en el formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Obtenemos los feriados del año
const obtenerFeriados = async () => {
    const url = 'https://api.argentinadatos.com/v1/feriados/' + year;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Mostramos el próximo feriado
const mostrarProximoFeriado = async () => {
    const feriados = await obtenerFeriados();
    const proximoFeriado = feriados.find(feriado => feriado.fecha >= today);
    // Formateamos la fecha
    const fecha = proximoFeriado.fecha;
    const dia = fecha.split('-')[2];
    const mes = fecha.split('-')[1];
    const anio = fecha.split('-')[0];
    // Obtenemos el dia de la semana
    const diaSemana = new Date(anio, mes - 1, dia).toLocaleDateString('es-AR', { weekday: 'long' });
    const fechaFormateada = `${diaSemana}, ${dia}-${mes}-${anio}`;
    // Calculamos cuanto falta
    const hoy = new Date();
    const fechaProximoFeriado = new Date(anio, mes - 1, dia);
    const tiempoFaltante = fechaProximoFeriado - hoy;
    const tiempoFaltanteDias = Math.ceil(tiempoFaltante / (1000 * 60 * 60 * 24));
    // definimos la frase de faltan N días
    if (tiempoFaltanteDias === 0) {
        faltan = 'hoy';
    } else if (tiempoFaltanteDias === 1) {
        faltan = 'Falta 1 día';
    } else {
        faltan = `Faltan ${tiempoFaltanteDias} días`;
    }

    // Mostramos el feriado
    document.getElementsByClassName('nombre')[0].innerHTML = proximoFeriado.nombre;
    document.getElementsByClassName('fecha')[0].innerHTML = fechaFormateada;
    document.getElementsByClassName('falta')[0].innerHTML = faltan;
    document.getElementsByClassName('tipo')[0].innerHTML = proximoFeriado.tipo;
}

// Mostramos los feriados siguientes
const mostrarFeriadosSiguientes = async () => {
    const feriados = await obtenerFeriados();
    const proximosFeriados = feriados.filter(feriado => feriado.fecha > today).slice(1);
    // Formateamos las fechas
    const proximosFeriadosHTML = proximosFeriados
        .map(feriado => {
            const fecha = feriado.fecha;
            const dia = fecha.split('-')[2];
            const mes = fecha.split('-')[1];
            const anio = fecha.split('-')[0];
            const diaSemana = new Date(anio, mes - 1, dia).toLocaleDateString('es-AR', { weekday: 'long' });
            const fechaFormateada = `${diaSemana}, ${dia}-${mes}-${anio}`;
            return `<li class="proximo">${fechaFormateada} - <strong>${feriado.nombre}</strong> - ${feriado.tipo}</li>`;
        })
        .join('');
    document.getElementById('siguientesFeriados').innerHTML = proximosFeriadosHTML;
}

// Llamamos a las funciones para mostrar los feriados
mostrarProximoFeriado();
mostrarFeriadosSiguientes();