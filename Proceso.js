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
