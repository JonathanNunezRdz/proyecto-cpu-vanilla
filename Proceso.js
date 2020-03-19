class Proceso {
	constructor(
		nombre,
		tiempoLlegada,
		tiempoActual,
		ejecucionTotal,
		quantumRestante,
		paginas
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
