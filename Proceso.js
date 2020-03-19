class Proceso {
	constructor(
		nombre,
		tiempoLlegada,
		tiempoActual,
		ejecucionTotal,
		quantumRestante,
		paginas,
		memoria
	) {
		this.nombre = nombre;
		this.tiempoLlegada = tiempoLlegada;
		this.cpuAsignado = 0;
		this.envejecimiento = tiempoActual - tiempoLlegada - 0;
		this.cpuRestante = ejecucionTotal;
		this.quantumRestante = quantumRestante;
		this.paginas = paginas;
		this.ejecucionTotal = ejecucionTotal;
		this.prioridad = (this.envejecimiento + ejecucionTotal) / ejecucionTotal;
		this.memoria = memoria;
	}

	toMemoriaTable() {
		const table = document.createElement('table');
		table.classList.add('table', 'table-borderless', 'text-center');

		let header = document.createElement('thead');
		let row = document.createElement('tr');

		let cell = document.createElement('th');
		cell.innerHTML = 'pag';
		row.appendChild(cell);

		cell = document.createElement('th');
		cell.innerHTML = 'r';
		row.appendChild(cell);

		cell = document.createElement('th');
		cell.innerHTML = 'llegada';
		row.appendChild(cell);

		cell = document.createElement('th');
		cell.innerHTML = 'ult acceso';
		row.appendChild(cell);

		cell = document.createElement('th');
		cell.innerHTML = 'acceso';
		row.appendChild(cell);

		cell = document.createElement('th');
		cell.innerHTML = 'NUR';
		row.appendChild(cell);

		header.appendChild(row);
		table.appendChild(header);

		// document
		// 	.getElementById('memoria-proceso-tabla')
		// 	.insertAdjacentHTML(
		// 		'afterbegin',
		// 		`<table><thead><tr> <th>pag</th> <th>r</th> <th>llegada</th> <th>ult acceso</th> <th>accessos</th> <th>NUR</th> </tr></thead><table>`
		// 	);

		for (let i = 0; i < this.memoria.numeroDePaginas; i++) {
			row = table.insertRow(-1);
			cell = row.insertCell(-1);
			cell.innerHTML = i;
			for (let j = 0; j < this.memoria.paginas[i].length - 1; j++) {
				if (j >= 4) {
					cell = row.insertCell(-1);
					cell.innerHTML =
						this.memoria.paginas[i][j] + '' + this.memoria.paginas[i][j + 1];
				} else {
					cell = row.insertCell(-1);
					cell.innerHTML = this.memoria.paginas[i][j];
				}
			}
		}
		return table;
	}

	toDiv() {
		const div = document.createElement('div');
		div.classList.add('my-2', 'border');
		div.innerHTML = this.nombre;
		return div;
	}

	toRunningDiv() {
		const div = document.createElement('div');
		div.classList.add('my-2', 'border', 'bg-success');
		div.innerHTML = this.nombre;
		return div;
	}

	toSummaryDiv() {
		const div = document.createElement('div');

		const nombre = document.createElement('p');
		nombre.innerHTML = 'Nombre: ' + this.nombre;
		div.appendChild(nombre);

		const tiempoLlegada = document.createElement('p');
		tiempoLlegada.innerHTML = 'Tiempo Llegada: ' + this.tiempoLlegada;
		div.appendChild(tiempoLlegada);

		const cpuAsignado = document.createElement('p');
		cpuAsignado.innerHTML = 'CPU Asignado: ' + this.cpuAsignado;
		div.appendChild(cpuAsignado);

		const envejecimiento = document.createElement('p');
		envejecimiento.innerHTML = 'Envejecimiento: ' + this.envejecimiento;
		div.appendChild(envejecimiento);

		const cpuRestante = document.createElement('p');
		cpuRestante.innerHTML = 'CPU Restante: ' + this.cpuRestante;
		div.appendChild(cpuRestante);

		const quantumRestante = document.createElement('p');
		quantumRestante.innerHTML = 'Quantum Restante: ' + this.quantumRestante;
		div.appendChild(quantumRestante);

		return div;
	}

	toString() {
		return (
			'Nuevo Proceso: ' +
			this.nombre +
			'\nTiempo Llegada: ' +
			this.tiempoLlegada +
			'\nPaginas: ' +
			this.paginas +
			'\nEjecucion Total: ' +
			this.ejecucionTotal
		);
	}
}

class Memoria {
	constructor(numeroDePaginas, paginas) {
		this.numeroDePaginas = numeroDePaginas;
		this.paginas = paginas;
	}
}
