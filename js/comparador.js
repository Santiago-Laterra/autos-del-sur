// Módulo de Comparación de Vehículos y WhatsApp
let selectedCars = [];

export function initComparador(allAutos) {
    // Crear barra flotante y modal de comparación si no existen
    if (!document.getElementById('comparison-bar')) {
        const barHTML = `
            <div id="comparison-bar" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-zinc-900/95 border border-amber-500/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 hidden transition-all duration-300">
                <div class="flex items-center gap-2 text-sm text-zinc-300">
                    <i class="fa-solid fa-scale-balanced text-amber-500 text-lg"></i>
                    <span>Comparando: <strong id="selected-count" class="text-amber-400">0</strong>/3 autos</span>
                </div>
                <button id="compare-btn" class="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm flex items-center gap-2">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i> Comparar seleccionados
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', barHTML);
    }

    if (!document.getElementById('comparison-modal')) {
        const modalHTML = `
            <div id="comparison-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md hidden opacity-0 transition-opacity duration-300">
                <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 transform scale-95 transition-transform duration-300" id="comparison-modal-box">
                    <button id="comparison-close" class="absolute top-4 right-4 z-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <div class="text-center mb-8">
                        <span class="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">Análisis Comparativo</span>
                        <h2 class="text-3xl font-extrabold text-white mt-3">Tabla Comparativa</h2>
                    </div>
                    <div id="comparison-table-container" class="overflow-x-auto">
                        <!-- Tabla generada dinámicamente -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupComparisonEvents(allAutos);
}

export function handleCheckboxChange(autoId, checkboxEl, allAutos) {
    const auto = allAutos.find(a => a.id === autoId);
    if (!auto) return;

    if (checkboxEl.checked) {
        if (selectedCars.length >= 3) {
            alert('Solo puedes comparar un máximo de 3 vehículos simultáneamente.');
            checkboxEl.checked = false;
            return;
        }
        if (!selectedCars.some(a => a.id === autoId)) {
            selectedCars.push(auto);
        }
    } else {
        selectedCars = selectedCars.filter(a => a.id !== autoId);
    }

    updateComparisonBar();
}

function updateComparisonBar() {
    const bar = document.getElementById('comparison-bar');
    const countEl = document.getElementById('selected-count');
    if (!bar || !countEl) return;

    countEl.textContent = selectedCars.length;

    if (selectedCars.length >= 2) {
        bar.classList.remove('hidden');
    } else {
        bar.classList.add('hidden');
    }
}

function setupComparisonEvents(allAutos) {
    const compareBtn = document.getElementById('compare-btn');
    const comparisonModal = document.getElementById('comparison-modal');
    const comparisonBox = document.getElementById('comparison-modal-box');
    const comparisonClose = document.getElementById('comparison-close');
    const tableContainer = document.getElementById('comparison-table-container');

    const closeComparisonModal = () => {
        comparisonModal.classList.add('opacity-0');
        comparisonBox.classList.add('scale-95');
        setTimeout(() => comparisonModal.classList.add('hidden'), 300);
    };

    if (comparisonClose) comparisonClose.addEventListener('click', closeComparisonModal);
    if (comparisonModal) {
        comparisonModal.addEventListener('click', (e) => {
            if (e.target === comparisonModal) closeComparisonModal();
        });
    }

    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            if (selectedCars.length < 2) return;

            // Encontrar el mejor precio (menor precio) y menor kilometraje
            const minPrecio = Math.min(...selectedCars.map(c => c.precioUSD));
            const minKm = Math.min(...selectedCars.map(c => c.kilometraje));

            const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

            let tableHTML = `
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-zinc-800">
                            <th class="py-4 px-4 text-zinc-400 font-semibold text-sm">Característica</th>
                            ${selectedCars.map(car => `
                                <th class="py-4 px-4 text-white font-bold text-center">
                                    <img src="${car.imagen}" class="w-28 h-20 object-cover rounded-xl mx-auto mb-2 border border-zinc-700">
                                    ${car.marca} ${car.modelo}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-800/60 text-sm">
                        <tr>
                            <td class="py-4 px-4 font-medium text-zinc-400">Precio USD</td>
                            ${selectedCars.map(car => {
                                const isBest = car.precioUSD === minPrecio;
                                return `<td class="py-4 px-4 text-center font-extrabold ${isBest ? 'text-amber-400 bg-amber-500/10 rounded-xl' : 'text-white'}">
                                    ${formatUSD(car.precioUSD)} ${isBest ? '<span class="block text-xs text-amber-500 font-semibold">Mejor Precio</span>' : ''}
                                </td>`;
                            }).join('')}
                        </tr>
                        <tr>
                            <td class="py-4 px-4 font-medium text-zinc-400">Año</td>
                            ${selectedCars.map(car => `<td class="py-4 px-4 text-center text-white">${car.anio}</td>`).join('')}
                        </tr>
                        <tr>
                            <td class="py-4 px-4 font-medium text-zinc-400">Kilometraje</td>
                            ${selectedCars.map(car => {
                                const isBest = car.kilometraje === minKm;
                                return `<td class="py-4 px-4 text-center font-extrabold ${isBest ? 'text-amber-400 bg-amber-500/10 rounded-xl' : 'text-white'}">
                                    ${car.kilometraje.toLocaleString()} km ${isBest ? '<span class="block text-xs text-amber-500 font-semibold">Menor Kilometraje</span>' : ''}
                                </td>`;
                            }).join('')}
                        </tr>
                        <tr>
                            <td class="py-4 px-4 font-medium text-zinc-400">Transmisión</td>
                            ${selectedCars.map(car => `<td class="py-4 px-4 text-center text-white">${car.transmision}</td>`).join('')}
                        </tr>
                        <tr>
                            <td class="py-4 px-4 font-medium text-zinc-400">Combustible</td>
                            ${selectedCars.map(car => `<td class="py-4 px-4 text-center text-white">${car.combustible}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            `;

            tableContainer.innerHTML = tableHTML;
            comparisonModal.classList.remove('hidden');
            setTimeout(() => {
                comparisonModal.classList.remove('opacity-0');
                comparisonBox.classList.remove('scale-95');
            }, 10);
        });
    }
}
