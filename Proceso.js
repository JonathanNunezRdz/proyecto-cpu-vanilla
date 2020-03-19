class Proceso {
	constructor(nombre, tiempoLlegada, paginas, ejecucionTotal) {
		this.nombre = nombre;
		this.tiempoLlegada = tiempoLlegada;
		this.paginas = paginas;
		this.ejecucionTotal = ejecucionTotal;
	}

	toDiv() {
		const div = document.createElement('div');
		div.classList.add('my-2', 'border');
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
