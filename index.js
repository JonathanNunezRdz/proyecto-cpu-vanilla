document
	.getElementById('agregar-proceso-form')
	.addEventListener('submit', e => agregarProceso(e));

let tiempoActual = 0;
let numeroProcesos = 0;
let quantumAsignado = 5;
let procesosReady = [];
let procesoRunning = null;
let procesosBlocked = [];
let procesosFinished = [];

function agregarProceso(form) {
	form.preventDefault();
	nuevoProceso = crearProceso(form);
	organizarProceso(nuevoProceso);
}

function ejecutarInstruccion() {
	tiempoActual = Number(document.getElementById('tiempo-actual').innerHTML) + 1;

	document.getElementById('tiempo-actual').innerHTML = tiempoActual;
}
