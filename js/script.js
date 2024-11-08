let movieDataList = [];

// Cargar datos desde la API
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
  .then(response => response.json())
  .then(data => {
    movieDataList = data;
  })
  .catch(error => console.error('Error al cargar los datos:', error));

// Agregar evento al botón de búsqueda
document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);

function buscarPeliculas() {
  const searchText = document.getElementById('inputBuscar').value.trim().toLowerCase();
  
  const resultados = movieDataList.filter(pelicula => {
    const matchTitulo = pelicula.title.toLowerCase().includes(searchText);
    const matchGenero = pelicula.genres.some(genero => typeof genero === 'string' && genero.toLowerCase().includes(searchText));
    const matchTagline = pelicula.tagline.toLowerCase().includes(searchText);
    const matchResumen = pelicula.overview.toLowerCase().includes(searchText);

    return matchTitulo || matchGenero || matchTagline || matchResumen;
  });

  mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
  const listaResultados = document.getElementById('lista');
  listaResultados.innerHTML = '';

  if (resultados.length === 0) {
    listaResultados.innerHTML = '<li class="list-group-item text-muted">No se encontraron resultados.</li>';
    return;
  }

  resultados.forEach(pelicula => {
    const peliculaElemento = document.createElement('li');
    peliculaElemento.className = 'list-group-item d-flex justify-content-between align-items-start';
    peliculaElemento.innerHTML = `
      <div>
        <h5>${pelicula.title}</h5>
        <p>${pelicula.tagline}</p>
        <div>${renderizarEstrellas(pelicula.vote_average)}</div>
        <button class="btn btn-secondary" onclick="mostrarDetalles(${pelicula.id})">Ver Detalles</button>
      </div>
    `;
    listaResultados.appendChild(peliculaElemento);
  });
}

function renderizarEstrellas(promedioVotos) {
  const cantidadEstrellas = Math.round(promedioVotos / 2);
  let estrellasHtml = '';

  for (let i = 1; i <= 5; i++) {
    estrellasHtml += `<span class="fa fa-star${i <= cantidadEstrellas ? '' : '-o'}" style="color: orange;"></span>`;
  }

  return estrellasHtml;
}

function mostrarDetalles(idPelicula) {
  const pelicula = movieDataList.find(p => p.id === idPelicula);
  const detallesPelicula = document.getElementById('movieDetailsBody');

  detallesPelicula.innerHTML = `
    <h5>${pelicula.title}</h5>
    <p>${pelicula.overview}</p>
    <p><strong>Géneros:</strong> ${pelicula.genres.join(', ')}</p>
    <p><strong>Año:</strong> ${new Date(pelicula.release_date).getFullYear()}</p>
    <p><strong>Duración:</strong> ${pelicula.runtime} min</p>
    <p><strong>Presupuesto:</strong> $${pelicula.budget.toLocaleString()}</p>
    <p><strong>Ganancias:</strong> $${pelicula.revenue.toLocaleString()}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById('movieDetailModal'));
  modal.show();
}
