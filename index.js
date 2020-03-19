let data = {
	numeroPaginas: 0,
	tiempoActual: 0,
	numeroDeProcesos: 0,
	procesos: []
}



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

function cargarTxt() {
	console.log('cargando txt');
	const file = document.getElementById('input-file').files[0]
	const reader = new FileReader
	reader.addEventListener('load', () => {
		txt = reader.result;
		txt = txt.split('\n');
		linea1 = txt[0].split(',');
		data.numeroPaginas = linea1[0];
		data.tiempoActual = linea1[1];
		data.numeroDeProcesos = txt[1];
		let lineaActual = 2;
		let proceso = {};
		for(var i=0; i<data.numeroDeProcesos; i++) { //crear un proceso
			let datosCpuTxt = txt[lineaActual].split(',');
			lineaActual++
			let nPaginas = txt[lineaActual];

			let objMemoria = {
				residencia: [],
				llegada: [],
				ultimoAcceso: [],
				numeroDeAccesos: [],
				NUR: []
			};

			for(var j=0; j<nPaginas; j++) {
				lineaActual++;
				linea = txt[lineaActual];
				linea = linea.split(',');
				objMemoria.residencia.push(linea[0]);
				objMemoria.llegada.push(linea[1]);
				objMemoria.ultimoAcceso.push(linea[2]);
				objMemoria.numeroDeAccesos.push(linea[3]);
				objMemoria.NUR.push(linea[4]+''+linea[5]);
			};
			lineaActual ++;

			proceso = {
				datosCpu: {
					llegada: datosCpuTxt[0],
					tiempoTotalEstimado: datosCpuTxt[1],
					estado: datosCpuTxt[2]
				},
				numeroPaginas: nPaginas,
				datosMemoria: objMemoria
			};
			data.procesos.push(proceso);
		};
	});
	reader.readAsText(file, 'UTF-8')
	console.log(data);
}
