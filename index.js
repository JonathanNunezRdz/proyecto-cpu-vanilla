document
	.getElementById('agregar-proceso-form')
	.addEventListener('submit', e => agregarProceso(e));
document
	.getElementById('ejecutar-interrupcion-form')
	.addEventListener('submit', e => ejecutarInterrupcion(e));
document
	.getElementById('ejecutar-pagina-form')
	.addEventListener('submit', e => ejecutarPagina(e));

let algoritmoCPU = 'FIFO';
let algoritmoMemoria = 'FIFO';
let tiempoActual = 0;
let numeroProcesos = 0;
let quantumAsignado = 5;
let procesosReady = [];
let procesoRunning = null;
let procesosBlocked = [];
let procesosFinished = [];
let ejecucionesParaDesbloquear = 5;
let data = {
	numeroPaginas: 0,
	tiempoActual: 0,
	numeroDeProcesos: 0,
	procesos: []
};

function resetNURBits() {
	for (let i = 0; i < procesoRunning.memoria.paginas.length; i++) {
		procesoRunning.memoria.paginas[i][4] = 0;
		procesoRunning.memoria.paginas[i][5] = 0;
		procesoRunning.memoria.paginas[i][6] = 0;
	}
	ejecutarInstruccion();
	renderRunningMemoria();
}

function ejecutarPagina(form) {
	form.preventDefault();
	if (procesoRunning != null)
		actualizarPagina(Number(form.target.elements[0].value));
	ejecutarInterrupcion(null, 'SVC de solicitud de I/O');
}

function actualizarPagina(pagina) {
	const paginaActual = procesoRunning.memoria.paginas[pagina];
	const paginasCargadas = contarPaginas();
	if (paginaActual[0] == 1) {
		paginaActual[6]++;
		if (Number(paginaActual[6]) >= 5) {
			paginaActual[6] = 0;
			paginaActual[5] = 1;
		}
		paginaActual[2] = tiempoActual;
		paginaActual[3]++;
		paginaActual[4] = 1;
	} else if (paginasCargadas < 5) {
		paginaActual[0] = 1;
		paginaActual[1] = tiempoActual;
		paginaActual[2] = tiempoActual;
		paginaActual[3]++;
		paginaActual[4] = 1;
		paginaActual[6]++;
	} else {
		const paginaReemplazar = implentarAlgoritmoMemoria();
		reemplazarPagina(paginaReemplazar, pagina);
		console.log('nosepuede');
	}

	renderRunningMemoria();
}

function reemplazarPagina(paginaReemplazar, pagina) {
	procesoRunning.memoria.paginas[paginaReemplazar][0] = 0;
	procesoRunning.memoria.paginas[paginaReemplazar][4] = 0;
	procesoRunning.memoria.paginas[pagina][0] = 1;
	procesoRunning.memoria.paginas[pagina][1] = tiempoActual;
	procesoRunning.memoria.paginas[pagina][2] = tiempoActual;
	procesoRunning.memoria.paginas[pagina][3] = 1;
	procesoRunning.memoria.paginas[pagina][4] = 1;
	procesoRunning.memoria.paginas[pagina][5] = 0;
	procesoRunning.memoria.paginas[pagina][6]++;
}

function implentarAlgoritmoMemoria() {
	switch (algoritmoMemoria) {
		case 'FIFO':
			{
				let tiempoMayor = [0, 0];

				for (let i = 0; i < procesoRunning.memoria.numeroDePaginas; i++) {
					if (procesoRunning.memoria.paginas[i][0] == 1) {
						if (
							tiempoMayor[1] <
							procesoRunning.memoria.paginas[i][2] -
								procesoRunning.memoria.paginas[i][1]
						) {
							tiempoMayor[0] = i;
							tiempoMayor[1] =
								procesoRunning.memoria.paginas[i][2] -
								procesoRunning.memoria.paginas[i][1];
						}
					}
				}
				return tiempoMayor[0];
			}
			break;
		case 'LRU':
			{
				let accesoUltimoMenor = [0, 10000];

				for (let i = 0; i < procesoRunning.memoria.numeroDePaginas; i++) {
					if (procesoRunning.memoria.paginas[i][0] == 1) {
						if (
							Number(procesoRunning.memoria.paginas[i][2]) <
							accesoUltimoMenor[1]
						) {
							accesoUltimoMenor[0] = i;
							accesoUltimoMenor[1] = procesoRunning.memoria.paginas[i][2];
						}
					}
				}
				return accesoUltimoMenor[0];
			}
			break;
		case 'LFU':
			{
				let accesoMenor = [0, 10000];

				for (let i = 0; i < procesoRunning.memoria.numeroDePaginas; i++) {
					if (procesoRunning.memoria.paginas[i][0] == 1) {
						if (Number(procesoRunning.memoria.paginas[i][3]) < accesoMenor[1]) {
							accesoMenor[0] = i;
							accesoMenor[1] = procesoRunning.memoria.paginas[i][3];
						}
					}
				}
				return accesoMenor[0];
			}
			break;
		case 'NUR':
			{
				let paginaReemplazar = [0, 5];
				let prioridad = null;
				for (let i = 0; i < procesoRunning.memoria.numeroDePaginas; i++) {
					if (procesoRunning.memoria.paginas[i][0] == 1) {
						if (
							procesoRunning.memoria.paginas[i][4] == 0 &&
							procesoRunning.memoria.paginas[i][5] == 0
						)
							prioridad = 1;
						if (
							procesoRunning.memoria.paginas[i][4] == 0 &&
							procesoRunning.memoria.paginas[i][5] == 1
						)
							prioridad = 3;
						if (
							procesoRunning.memoria.paginas[i][4] == 1 &&
							procesoRunning.memoria.paginas[i][5] == 0
						)
							prioridad = 2;
						if (
							procesoRunning.memoria.paginas[i][4] == 1 &&
							procesoRunning.memoria.paginas[i][5] == 1
						)
							prioridad = 4;

						if (prioridad < paginaReemplazar[1]) {
							paginaReemplazar[0] = i;
							paginaReemplazar[1] = prioridad;
						}
					}
				}
				return paginaReemplazar[0];
			}
			break;
	}
}

function contarPaginas() {
	let paginasCargadas = 0;
	for (let i = 0; i < procesoRunning.memoria.paginas.length; i++) {
		if (procesoRunning.memoria.paginas[i][0] == 1) paginasCargadas++;
	}
	return paginasCargadas;
}

function ejecutarInterrupcion(e, interrupcion) {
	let caso;
	if (e != null) {
		caso = e.target.elements[0].value;
		e.preventDefault();
	} else {
		caso = interrupcion;
	}
	if (procesoRunning == null) {
		if (caso != 'Dispositivo de I/O') alert('no hay proceso en running');
		else if (procesosBlocked.length === 0) alert('no hay procesos en blocked');
		return;
	}
	ejecutarInstruccion();
	switch (caso) {
		case 'SVC de solicitud de I/O':
			{
				if (procesoRunning != null) {
					changeRunningToBlocked();
				}
			}
			break;
		case 'SVC de terminación normal':
			{
				if (procesoRunning != null) {
					addFinishedProceso(procesoRunning);
					removeRunningProceso();
					if (procesosReady.length > 0) {
						changeReadyToRunning();
						renderReadyProcesos();
					}
				}
			}
			break;
		case 'SVC de solitud de fecha':
			{
				{
					if (procesoRunning != null) {
						changeRunningToBlocked();
					}
				}
			}
			break;
		case 'Error de programa':
			{
				if (procesoRunning != null) {
					addFinishedProceso(procesoRunning);
					removeRunningProceso();
					if (procesosReady.length > 0) {
						changeReadyToRunning();
						renderReadyProcesos();
					}
				}
			}
			break;
		case 'Externa de quantum expirado':
			{
				if (procesoRunning != null) {
					changeRunningToReady();
					changeReadyToRunning();
					renderReadyProcesos();
				}
			}
			break;
		case 'Dispositivo de I/O': {
			if (procesosBlocked.length > 0) {
				handleDispositivoIO();
			}
		}
	}
}

function cambiarAlgoritmoCPU() {
	algoritmoCPU = document.getElementById('algoritmo-cpu-form').value;
	sortProcesos();
}

function cambiarAlgoritmoMemoria() {
	algoritmoMemoria = document.getElementById('algoritmo-memoria-form').value;
	console.log(algoritmoMemoria);
}

function agregarProceso(form) {
	form.preventDefault();
	nuevoProceso = crearProceso(form);
	organizarProceso(nuevoProceso);
}

function ejecutarInstruccion() {
	tiempoActual++;
	ejecucionesParaDesbloquear--;
	if (ejecucionesParaDesbloquear === 0) {
		ejecucionesParaDesbloquear = 5;
		if (procesosBlocked.length > 0) changeBlockedToReady();
	}
	document.getElementById('tiempo-actual').innerHTML = tiempoActual;
	procesoRunning != null ? actualizarRunningProceso() : null;
	procesosReady.length > 0 ? actulizarReadyProcesos() : null;
}

function actulizarReadyProcesos() {
	//actulizar envejecimiento
	procesosReady.forEach(proceso => proceso.envejecimiento++);
	sortProcesos();
}

function actualizarRunningProceso() {
	if (procesoRunning.cpuRestante > 1) {
		procesoRunning.cpuRestante -= 1;
		procesoRunning.cpuAsignado += 1;
		if (algoritmoCPU === 'Round Robin') {
			procesoRunning.quantumRestante--;
			if (procesoRunning.quantumRestante === 0) {
				changeRunningToReady();
				changeReadyToRunning();
				renderReadyProcesos();
			}
		}
		renderRunningSummary();
		renderRunningMemoria();
	} else {
		addFinishedProceso(procesoRunning);
		removeRunningProceso();
		if (procesosReady.length > 0) {
			changeReadyToRunning();
			renderReadyProcesos();
		}
	}
}

function renderRunningMemoriaDropdown() {
	document.getElementById('pagina-form').innerHTML = '';
	document
		.getElementById('pagina-form')
		.appendChild(procesoRunning.toDropdownDiv());
}

function renderReadyProcesos() {
	document.getElementById('ready-procesos').innerHTML = '';
	if (procesosReady.length > 0) {
		for (let i = 0; i < procesosReady.length; i++) {
			document
				.getElementById('ready-procesos')
				.appendChild(procesosReady[i].toDiv());
		}
	}
}

function renderBlockedProcesos() {
	document.getElementById('blocked-procesos').innerHTML = '';
	if (procesosBlocked.length > 0) {
		for (let i = 0; i < procesosBlocked.length; i++) {
			document
				.getElementById('blocked-procesos')
				.appendChild(procesosBlocked[i].toDiv());
		}
	}
}

function renderRunningSummary() {
	document.getElementById('running-proceso-summary').innerHTML = '';
	document
		.getElementById('running-proceso-summary')
		.appendChild(procesoRunning.toSummaryDiv());
}

function renderRunningMemoria() {
	document.getElementById('memoria-proceso-tabla').innerHTML = '';
	document
		.getElementById('memoria-proceso-tabla')
		.appendChild(procesoRunning.toMemoriaTable());
}

function cargarTxt() {
	console.log('cargando txt');
	const file = document.getElementById('input-file').files[0];
	const reader = new FileReader();
	reader.addEventListener('load', () => {
		txt = reader.result;
		txt = txt.split('\n');
		linea1 = txt[0].split(',');
		data.numeroPaginas = linea1[0];
		data.tiempoActual = linea1[1];
		tiempoActual = Number(data.tiempoActual);
		document.getElementById('tiempo-actual').innerHTML = tiempoActual;
		data.numeroDeProcesos = txt[1];
		let lineaActual = 2;
		let proceso = {};
		for (var i = 0; i < data.numeroDeProcesos; i++) {
			//crear un proceso
			let datosCpuTxt = txt[lineaActual].split(',');
			lineaActual++;
			let nPaginas = txt[lineaActual];

			let paginas = [];

			for (var j = 0; j < nPaginas; j++) {
				lineaActual++;
				linea = txt[lineaActual];
				linea = linea.split(',');
				// objMemoria.residencia.push(linea[0]);
				// objMemoria.llegada.push(linea[1]);
				// objMemoria.ultimoAcceso.push(linea[2]);
				// objMemoria.numeroDeAccesos.push(linea[3]);
				// objMemoria.NUR.push(linea[4] + '' + linea[5]);
				linea.push(0);
				paginas.push(linea);
			}
			lineaActual++;

			proceso = {
				datosCpu: {
					llegada: datosCpuTxt[0],
					tiempoTotalEstimado: datosCpuTxt[1],
					estado: datosCpuTxt[2]
				},
				datosMemoria: paginas
			};

			nuevaMemoria = new Memoria(nPaginas, paginas);

			nuevoProceso = new Proceso(
				i + 1,
				Number(proceso.datosCpu.llegada),
				data.tiempoActual,
				Number(proceso.datosCpu.tiempoTotalEstimado),
				5,
				nPaginas,
				nuevaMemoria
			);
			organizarProceso(nuevoProceso, Number(proceso.datosCpu.estado));

			data.procesos.push(proceso);
		}
	});
	reader.readAsText(file, 'UTF-8');
}
