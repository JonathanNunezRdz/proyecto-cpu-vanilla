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

function organizarProceso(nuevoProceso) {
	// sumarProcesos();
	if (document.getElementById('running-proceso').innerHTML.length <= 60) {
		addRunningProceso(nuevoProceso);
	} else {
		addReadyProceso(nuevoProceso);
	}
}

function addRunningProceso(nuevoProceso) {
	procesoRunning = nuevoProceso;
	document
		.getElementById('running-proceso')
		.appendChild(procesoRunning.toRunningDiv());
}

function addReadyProceso(nuevoProceso) {
	procesosReady.push(nuevoProceso);
	document.getElementById('ready-procesos').appendChild(nuevoProceso.toDiv());
}

function sumarProcesos() {
	numeroProcesos =
		Number(document.getElementById('nombre-proceso-form').value) + 1;

	document.getElementById('nombre-proceso-form').value = numeroProcesos;
}
