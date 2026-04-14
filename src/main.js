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
    const url = `http://www.omdbapi.com/?s=${nombrePelicula}&apikey=71538a62`
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
                <div class="bg-gray-800 rounded-lg p-4">
                    <img src="${pelicula.Poster}" class="w-full h-auto rounded" alt="">
                    <h3 class="text-xl font-bold mt-2">${pelicula.Title}</h3>
                    <p class="text-cyan-400 capitalize">${pelicula.Type}</p>
                    <p class="text-cyan-400">${pelicula.Year}</p>
                </div>
            `;
        });
        } else {
            // 4. MANEJO DE RESULTADOS VACÍOS
            // si 'datos.Search' no existe, es porque la API no encontró coincidencias.
            contenedorPeliculas.innerHTML = '<p class="text-sky-400">No se encontraron resultados</p>';
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


