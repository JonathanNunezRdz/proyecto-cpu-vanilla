document
	.getElementById('agregar-proceso-form')
	.addEventListener('submit', e => getProcessProperties(e));

function ejecutarInstruccion() {
	const tiempoActual =
		Number(document.getElementById('tiempo-actual').innerHTML) + 1;

	document.getElementById('tiempo-actual').innerHTML = tiempoActual;
}

function getProcessProperties(e) {
	e.preventDefault();
	nuevoProceso = new Proceso(
		e.target.elements[0].value,
		document.getElementById('tiempo-actual').innerHTML,
		e.target.elements[1].value,
		e.target.elements[2].value
	);
	displayProcess(nuevoProceso);
}

function displayProcess(nuevoProceso) {
	ejecutarInstruccion();
	// let readyProcesos = document.getElementById('ready-procesos').children;
	// let addReadyProcesos = [];

	// if (readyProcesos.length > 0) {
	// 	for (let i = 0; i < readyProcesos.length; i++)
	// 		addReadyProcesos.push(readyProcesos[i]);
	// }

	// addReadyProcesos.push(nuevoProceso.toDiv());

	// readyProcesos = document.getElementById('ready-procesos');
	// for (let i = 0; i < addReadyProcesos; i++) {
	// 	readyProcesos.appendChild(addReadyProcesos[i]);
	// }

	let readyProcesos = document
		.getElementById('ready-procesos')
		.appendChild(nuevoProceso.toDiv());

	console.log(document.getElementById('ready-procesos'));
}
