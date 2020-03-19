function crearProceso(form) {
	nuevoProceso = new Proceso(
		Number(form.target.elements[0].value),
		tiempoActual,
		tiempoActual,
		Number(form.target.elements[1].value),
		quantumAsignado,
		Number(form.target.elements[2].value)
	);
	return nuevoProceso;
}

function organizarProceso(nuevoProceso, estado) {
	sumarProcesos();
	if (!estado) {
		if (document.getElementById('running-proceso').innerHTML === '') {
			addRunningProceso(nuevoProceso);
		} else {
			addReadyProceso(nuevoProceso);
		}
	} else {
		if (estado === 1) addRunningProceso(nuevoProceso);
		if (estado === 2) addBlockedProceso(nuevoProceso);
		if (estado === 3) addReadyProceso(nuevoProceso);
	}
	sortProcesos();
	renderReadyProcesos();
}

function sortProcesos() {
	switch (algoritmoCPU) {
		case 'FIFO':
			{
				if (procesosReady.length > 1) {
					procesosReady.sort((a, b) => {
						if (a.tiempoLlegada > b.tiempoLlegada) {
							return 1;
						}
						if (a.tiempoLlegada < b.tiempoLlegada) {
							return -1;
						}
						return 0;
					});
				}
			}
			break;
		case 'Round Robin':
			{
			}
			break;
		case 'SRT':
			{
				if (procesosReady.length > 1) {
					procesosReady.sort((a, b) => {
						if (a.cpuRestante > b.cpuRestante) {
							return 1;
						}
						if (a.cpuRestante < b.cpuRestante) {
							return -1;
						}
						return 0;
					});
				}
			}
			break;
		case 'HRRN': {
			if (procesosReady.length > 1) {
				procesosReady.sort((a, b) => {
					if (a.prioridad > b.prioridad) {
						return -1;
					}
					if (a.prioridad < b.prioridad) {
						return 1;
					}
					return 0;
				});
			}
		}
	}
	console.log(procesosReady);
}

function changeBlockedToReady() {
	procesosReady.push(procesosBlocked.shift());

	sortProcesos();
	renderReadyProcesos();
	renderBlockedProcesos();
}

function changeRunningToReady() {
	procesosReady.push(procesoRunning);
	sortProcesos();
	removeRunningProceso();
	renderReadyProcesos();
	renderBlockedProcesos();
}

function changeReadyToRunning() {
	procesoRunning = procesosReady.shift();
	procesoRunning.quantumRestante = quantumAsignado;
	addRunningProceso(procesoRunning);
}

function removeRunningProceso() {
	procesoRunning = null;
	document.getElementById('running-proceso').innerHTML = '';
}

function addFinishedProceso(proceso) {
	procesosFinished.push(proceso);
	document.getElementById('finished-procesos').appendChild(proceso.toDiv());
}

function addRunningProceso(proceso) {
	procesoRunning = proceso;
	document
		.getElementById('running-proceso')
		.appendChild(proceso.toRunningDiv());
	renderRunningSummary();
}

function addReadyProceso(nuevoProceso) {
	procesosReady.push(nuevoProceso);
	document.getElementById('ready-procesos').appendChild(nuevoProceso.toDiv());
}

function addBlockedProceso(nuevoProceso) {
	ejecucionesParaDesbloquear = 5;
	procesosBlocked.push(nuevoProceso);
	document.getElementById('blocked-procesos').appendChild(nuevoProceso.toDiv());
}

function sumarProcesos() {
	numeroProcesos += 1;
	document.getElementById('nombre-proceso-form').value = numeroProcesos + 1;
}
