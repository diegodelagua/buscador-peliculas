// 1. SELECCION DE ELEMENTOS DEL DOM
const busquedaPelicula = document.getElementById("input-busqueda")
const botonBusqueda = document.getElementById("btn-buscar")
const contenedorPeliculas = document.getElementById('contenedor-peliculas')

// 2. FUNCION PRINCIPAL DE BUSQUEDA (ASINCROMA)
// se usa 'async' ya que vamos a esperar una respuesta de un servidor externo (API)
botonBusqueda.addEventListener('click', async ()=>{
    // limpiamos el contenedor cada vez se realice una busqueda nueva
    contenedorPeliculas.innerHTML = '';
    // se obtiene el texto que el usuario escribio
    const nombrePelicula = busquedaPelicula.value;
    // construimos la URL de la API de OMDb insertando el nombre de la película y nuestra API Key
    const url = `https://www.omdbapi.com/?s=${nombrePelicula}&apikey=71538a62`
    try{
        // realizamos la petición a la API y esperamos la respuesta (fetch)
        const respuesta = await fetch(url)
        // convertimos la respuesta de formato crudo a un objeto JSON de JavaScript.
        const datos = await respuesta.json()
        // util para debuguear y ver que nos devuelve la API
        console.log(datos)
        // 3. RENDERIZADO DE RESULTADOS
        // laa API devuelve un objeto con una propiedad 'Search' que es un array si encontró algo.
        if (datos.Search) { // 1. ¿Hay películas?
            // recorremos el array de películas una por una.
            datos.Search.forEach(pelicula => { 
            // creamos dinámicamente el HTML para cada tarjeta usando Template Literals (``).
            // usamos las propiedades Poster, Title, Type y Year que vienen de la API.
            contenedorPeliculas.innerHTML += `
                    <div class="bg-gray-800 rounded-lg p-4 flex flex-col h-full shadow-lg">
                        <img src="${pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=Sin+Imagen'}"class="w-full h-auto rounded-md object-cover" alt="${pelicula.Title}">
                        <div class="mt-4 flex-grow">
                            <h3 class="text-xl font-bold text-white leading-tight">${pelicula.Title}</h3>
                            <p class="text-cyan-400 capitalize text-sm font-medium mt-1">${pelicula.Type} • ${pelicula.Year}</p>
                        </div>
                        <button 
                            data-id="${pelicula.imdbID}" 
                            class="boton-detalle mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                            Ver más
                        </button>
                    </div>
                    `;
        });
        } else {
            // 4. MANEJO DE RESULTADOS VACÍOS
            // si 'datos.Search' no existe, es porque la API no encontró coincidencias.
            contenedorPeliculas.innerHTML = `
                                <div class="col-span-full flex flex-col items-center justify-center py-20 w-full">
                                    <p class="text-sky-400 text-xl font-medium text-center">No se encontraron resultados</p>
                                    <p class="text-gray-500 text-sm mt-2">Intentá con otro nombre o verificá la ortografía.</p>
                                </div>
            `;
        }
    } catch (error){
        // manejo de errores de conexion o de red.
        console.error("Hubo un error al consultar la API:", error)
    };

});

// 5. MEJORA DE EXPERIENCIA DE USUARIO (UX)
// escuchamos cuando el usuario presiona una tecla dentro del input
busquedaPelicula.addEventListener('keypress', (e) => {
    // si la tecla presionada es "Enter", simulamos un clic en el botón de busqueda.
    if (e.key === 'Enter') botonBusqueda.click();
});

// Escuchamos el clic en todo el contenedor de películas
contenedorPeliculas.addEventListener('click', (e) => {
    // Verificamos si lo que se tocó tiene la clase 'boton-detalle'
    if (e.target.classList.contains('boton-detalle')) {
        const idPelicula = e.target.getAttribute('data-id');
        console.log("Buscando detalles para el ID:", idPelicula);
        obtenerDetallesPelicula(idPelicula);
    }
});

async function obtenerDetallesPelicula(id) {
    try {
        const respuesta = await fetch(`https://www.omdbapi.com/?apikey=71538a62&i=${id}`);
        const datos = await respuesta.json();
        
        if (datos.Response === "True") {
            mostrarModal(datos);
        }
    } catch (error) {
        console.error("Error al obtener detalles:", error);
    }
}

function mostrarModal(pelicula) {
    // creamos un div para el modal
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300";
    
    modal.innerHTML = `
        <div class="bg-gray-900 border border-gray-700 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
            <div class="flex gap-4">
                <img src="${pelicula.Poster}" class="w-32 rounded-lg shadow-md" alt="">
                <div>
                    <h2 class="text-2xl font-bold text-cyan-400">${pelicula.Title}</h2>
                    <p class="text-gray-400 text-sm">${pelicula.Released} • ${pelicula.Runtime}</p>
                    <p class="text-yellow-400 font-bold mt-1">⭐ ${pelicula.imdbRating}</p>
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="text-cyan-400 font-bold uppercase text-xs tracking-widest">Sinopsis</h4>
                <p class="text-gray-300 mt-2 leading-relaxed">${pelicula.Plot}</p>
            </div>

            <div class="mt-4">
                 <h4 class="text-cyan-400 font-bold uppercase text-xs tracking-widest">Reparto</h4>
                 <p class="text-gray-400 mt-1">${pelicula.Actors}</p>
            </div>
            <p class="text-red-600 font-bold">"Información extraída de OMDb (Disponible solo en inglés)"</p>

            <button id="cerrar-modal" class="mt-8 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors">
                Cerrar
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // logica para cerrar el modal
    document.getElementById('cerrar-modal').onclick = () => {
        modal.remove();
        
    };
    // cerrar con tecla Escape
        const cerrarEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', cerrarEsc);
            }
        };
        document.addEventListener('keydown', cerrarEsc);

    // cerrar clickeando afuera del modal
    modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
};
}


