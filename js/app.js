import { openFinancingModal } from './financiacion.js';
import { initComparador, handleCheckboxChange } from './comparador.js';

document.addEventListener('DOMContentLoaded', () => {
    const catalogGrid = document.getElementById('catalog-grid');
    const buscador = document.getElementById('buscador');
    const transmisionFilter = document.getElementById('transmision-filter');
    const combustibleFilter = document.getElementById('combustible-filter');
    const sortFilter = document.getElementById('sort-filter');
    const vehiculosCount = document.getElementById('vehiculos-count');

    let autos = [];

    // Función para formatear el precio en USD
    const formatUSD = (precio) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(precio);
    };

    // Función para renderizar las tarjetas de vehículos
    const renderAutos = (autosArray) => {
        if (!catalogGrid) return;

        catalogGrid.innerHTML = '';

        if (autosArray.length === 0) {
            catalogGrid.innerHTML = `
                <div class="col-span-full text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <i class="fa-solid fa-car-burst text-4xl text-amber-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-white">No se encontraron vehículos</h3>
                    <p class="text-zinc-400 mt-2">Intenta ajustando los filtros o términos de búsqueda.</p>
                </div>
            `;
            if (vehiculosCount) vehiculosCount.textContent = '0 vehículos encontrados';
            return;
        }

        if (vehiculosCount) {
            vehiculosCount.textContent = `${autosArray.length} ${autosArray.length === 1 ? 'vehículo disponible' : 'vehículos disponibles'}`;
        }

        autosArray.forEach(auto => {
            const card = document.createElement('div');
            card.className = 'bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col group';
            
            // Enlace de WhatsApp prearmado
            const mensajeWp = encodeURIComponent(`Hola, estoy interesado en el vehículo ${auto.marca} ${auto.modelo} (${auto.anio}) publicado a ${formatUSD(auto.precioUSD)} USD en Autos del Sur.`);
            const whatsappUrl = `https://wa.me/5491100000000?text=${mensajeWp}`;

            card.innerHTML = `
                <div class="relative h-60 overflow-hidden bg-zinc-950">
                    <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                        ${auto.anio}
                    </div>
                    <!-- Checkbox de Comparación -->
                    <div class="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <input type="checkbox" id="compare-${auto.id}" data-id="${auto.id}" class="compare-checkbox accent-amber-500 w-4 h-4 cursor-pointer">
                        <label for="compare-${auto.id}" class="text-xs font-semibold text-zinc-300 cursor-pointer">Comparar</label>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">${auto.marca}</div>
                    <h3 class="text-xl font-bold text-white mb-2">${auto.modelo}</h3>
                    <div class="text-2xl font-black text-amber-400 mb-4">${formatUSD(auto.precioUSD)} USD</div>
                    
                    <div class="grid grid-cols-2 gap-3 py-3 border-t border-b border-zinc-800 text-sm text-zinc-400 mb-6">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-gauge-high text-amber-500"></i> ${auto.kilometraje.toLocaleString()} km</span>
                        <span class="flex items-center gap-2"><i class="fa-solid fa-gear text-amber-500"></i> ${auto.transmision}</span>
                        <span class="flex items-center gap-2 col-span-2"><i class="fa-solid fa-gas-pump text-amber-500"></i> ${auto.combustible}</span>
                    </div>

                    <div class="mt-auto space-y-3">
                        <button class="ficha-btn w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-2">
                            <i class="fa-solid fa-calculator"></i> Ver Ficha y Cuotas
                        </button>
                        
                        <a href="${whatsappUrl}" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-center flex items-center justify-center gap-2 text-sm">
                            <i class="fa-brands fa-whatsapp text-lg"></i> Consultar por WhatsApp
                        </a>
                    </div>
                </div>
            `;

            // Evento botón Ficha y Cuotas
            const fichaBtn = card.querySelector('.ficha-btn');
            fichaBtn.addEventListener('click', () => {
                openFinancingModal(auto);
            });

            // Evento checkbox Comparar
            const compareCheckbox = card.querySelector('.compare-checkbox');
            compareCheckbox.addEventListener('change', (e) => {
                handleCheckboxChange(auto.id, e.target, autos);
            });

            catalogGrid.appendChild(card);
        });
    };

    // Lógica combinada de filtrado y ordenamiento en tiempo real
    const filterAndSortAutos = () => {
        const query = buscador ? buscador.value.toLowerCase().trim() : '';
        const transmisionVal = transmisionFilter ? transmisionFilter.value : 'Todas';
        const combustibleVal = combustibleFilter ? combustibleFilter.value : 'Todos';
        const sortVal = sortFilter ? sortFilter.value : 'destacados';

        // 1. Filtrar
        let result = autos.filter(auto => {
            const matchesQuery = auto.marca.toLowerCase().includes(query) ||
                                 auto.modelo.toLowerCase().includes(query) ||
                                 auto.anio.toString().includes(query) ||
                                 auto.combustible.toLowerCase().includes(query) ||
                                 auto.transmision.toLowerCase().includes(query);

            const matchesTransmision = transmisionVal === 'Todas' || auto.transmision === transmisionVal;
            const matchesCombustible = combustibleVal === 'Todos' || auto.combustible === combustibleVal;

            return matchesQuery && matchesTransmision && matchesCombustible;
        });

        // 2. Ordenar
        if (sortVal === 'menor-precio') {
            result.sort((a, b) => a.precioUSD - b.precioUSD);
        } else if (sortVal === 'mayor-precio') {
            result.sort((a, b) => b.precioUSD - a.precioUSD);
        } else if (sortVal === 'mas-nuevos') {
            result.sort((a, b) => b.anio - a.anio);
        } else {
            // Destacados (orden original por ID)
            result.sort((a, b) => a.id - b.id);
        }

        renderAutos(result);
    };

    // Función asíncrona para cargar data/autos.json
    const fetchAutos = async () => {
        try {
            const response = await fetch('data/autos.json');
            if (!response.ok) {
                throw new Error('Error al cargar la base de datos de vehículos.');
            }
            autos = await response.json();
            
            // Inicializar el comparador
            initComparador(autos);

            filterAndSortAutos();
        } catch (error) {
            console.error('Error:', error);
            if (catalogGrid) {
                catalogGrid.innerHTML = `
                    <div class="col-span-full text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl text-red-400">
                        <i class="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
                        <h3 class="text-xl font-bold text-white">Error al cargar el catálogo</h3>
                        <p class="text-zinc-400 mt-2">No se pudo conectar con el servidor de datos (data/autos.json).</p>
                    </div>
                `;
            }
            if (vehiculosCount) vehiculosCount.textContent = 'Error de carga';
        }
    };

    // Event listeners para los filtros y buscador
    if (buscador) buscador.addEventListener('input', filterAndSortAutos);
    if (transmisionFilter) transmisionFilter.addEventListener('change', filterAndSortAutos);
    if (combustibleFilter) combustibleFilter.addEventListener('change', filterAndSortAutos);
    if (sortFilter) sortFilter.addEventListener('change', filterAndSortAutos);

    // Inicializar carga de datos
    fetchAutos();
});
