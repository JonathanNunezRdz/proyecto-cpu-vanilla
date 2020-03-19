document
	.getElementById('agregar-proceso-form')
	.addEventListener('submit', e => agregarProceso(e));
document
	.getElementById('ejecutar-interrupcion-form')
	.addEventListener('submit', e => ejecutarInterrupcion(e));

let algoritmoCPU = 'FIFO';
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

function ejecutarInstruccion() {
	//ejecutarInstruccion();
}

function cambiarAlgoritmoCPU() {
	algoritmoCPU = document.getElementById('algoritmo-cpu-form').value;
	sortProcesos();
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
	} else {
		addFinishedProceso(procesoRunning);
		removeRunningProceso();
		if (procesosReady.length > 0) {
			changeReadyToRunning();
			renderReadyProcesos();
		}
	}
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

			nuevoProceso = new Proceso(
				i + 1,
				Number(proceso.datosCpu.llegada),
				data.tiempoActual,
				Number(proceso.datosCpu.tiempoTotalEstimado),
				5,
				nPaginas
			);
			organizarProceso(nuevoProceso, Number(proceso.datosCpu.estado));
			data.procesos.push(proceso);
		}
	});
	reader.readAsText(file, 'UTF-8');
	console.log(procesosReady);
}
