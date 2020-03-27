function crearProceso(form) {
	const paginas = [];
	for (let i = 0; i < Number(form.target.elements[1].value); i++) {
		paginas.push([0, tiempoActual, 0, 0, 0, 0, 0]);
	}
	nuevaMemoria = new Memoria(Number(form.target.elements[1].value), paginas);
	nuevoProceso = new Proceso(
		Number(form.target.elements[0].value),
		tiempoActual,
		tiempoActual,
		Number(form.target.elements[2].value),
		quantumAsignado,
		Number(form.target.elements[1].value),
		nuevaMemoria
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

function handleDispositivoIO() {
	if (procesoRunning != null) {
		procesosReady.push(procesoRunning);
		procesoRunning = null;
		document.getElementById('running-proceso').innerHTML = '';
	}
	procesosReady.push(procesosBlocked.shift());
	sortProcesos();
	addRunningProceso(procesosReady.shift());
	renderReadyProcesos();
	renderBlockedProcesos();
}

function changeBlockedToReady() {
	if (procesoRunning === null) {
		procesoRunning = procesosBlocked.shift();
		addRunningProceso(procesoRunning);
	} else {
		procesosReady.push(procesosBlocked.shift());
		sortProcesos();
		renderReadyProcesos();
	}
	renderBlockedProcesos();
}

function changeRunningToBlocked() {
	procesosBlocked.push(procesoRunning);
	removeRunningProceso();
	if (procesosReady.length > 0) {
		changeReadyToRunning();
	}
	renderBlockedProcesos();
	renderReadyProcesos();
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
	document.getElementById('running-proceso-summary').innerHTML = '';
	document.getElementById('memoria-proceso-tabla').innerHTML = '';
	document.getElementById('pagina-form').innerHTML = '';
}

function addRunningProceso(proceso) {
	procesoRunning = proceso;
	document
		.getElementById('running-proceso')
		.appendChild(proceso.toRunningDiv());
	renderRunningSummary();
	renderRunningMemoria();
	renderRunningMemoriaDropdown();
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
