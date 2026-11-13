// Módulo de Simulación de Financiación y Ficha de Vehículo
export function initFinanciacionModal() {
    // Crear el contenedor del modal si no existe
    if (document.getElementById('vehicle-modal')) return;

    const modalHTML = `
        <div id="vehicle-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300">
            <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform scale-95 transition-transform duration-300" id="modal-content-box">
                <!-- Botón Cerrar -->
                <button id="modal-close" class="absolute top-4 right-4 z-10 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>

                <div id="modal-body" class="p-6 sm:p-8 space-y-6">
                    <!-- Contenido dinámico inyectado al abrir -->
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('vehicle-modal');
    const closeBtn = document.getElementById('modal-close');
    const modalBox = document.getElementById('modal-content-box');

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modalBox.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

export function openFinancingModal(auto) {
    initFinanciacionModal();

    const modal = document.getElementById('vehicle-modal');
    const modalBox = document.getElementById('modal-content-box');
    const modalBody = document.getElementById('modal-body');

    const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    modalBody.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div class="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img src="${auto.imagen}" alt="${auto.marca} ${auto.modelo}" class="w-full h-full object-cover">
                <div class="absolute top-4 left-4 bg-amber-500 text-zinc-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    ${auto.marca}
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <span class="text-amber-500 text-xs font-bold uppercase tracking-widest">Año ${auto.anio}</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">${auto.modelo}</h2>
                    <div class="text-3xl font-black text-amber-400 mt-2">${formatUSD(auto.precioUSD)} USD</div>
                </div>

                <div class="grid grid-cols-2 gap-3 py-3 border-t border-b border-zinc-800 text-sm text-zinc-300">
                    <span class="flex items-center gap-2"><i class="fa-solid fa-gauge-high text-amber-500"></i> ${auto.kilometraje.toLocaleString()} km</span>
                    <span class="flex items-center gap-2"><i class="fa-solid fa-gear text-amber-500"></i> ${auto.transmision}</span>
                    <span class="flex items-center gap-2 col-span-2"><i class="fa-solid fa-gas-pump text-amber-500"></i> ${auto.combustible}</span>
                </div>
            </div>
        </div>

        <!-- Simulador de Financiación -->
        <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-6 mt-6">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <i class="fa-solid fa-calculator text-lg"></i>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">Simulador de Financiación</h3>
                    <p class="text-xs text-zinc-400">Calculá tus cuotas en tiempo real con tasa preferencial.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Anticipo % -->
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <label for="anticipo-range" class="text-zinc-300 font-medium">Anticipo:</label>
                        <span id="anticipo-val" class="text-amber-400 font-bold">30%</span>
                    </div>
                    <input type="range" id="anticipo-range" min="20" max="70" step="5" value="30" 
                           class="w-full accent-amber-500 bg-zinc-800 cursor-pointer">
                    <div class="flex justify-between text-xs text-zinc-500">
                        <span>20%</span>
                        <span>70%</span>
                    </div>
                </div>

                <!-- Cuotas -->
                <div class="space-y-2">
                    <label for="cuotas-select" class="block text-sm text-zinc-300 font-medium">Cantidad de Cuotas:</label>
                    <select id="cuotas-select" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors">
                        <option value="12">12 Cuotas Fijas</option>
                        <option value="24" selected>24 Cuotas Fijas</option>
                        <option value="36">36 Cuotas Fijas</option>
                        <option value="48">48 Cuotas Fijas</option>
                    </select>
                </div>
            </div>

            <!-- Resultados del cálculo -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80 text-center">
                <div class="bg-zinc-900 border border-zinc-800/60 p-4 rounded-xl">
                    <div class="text-xs text-zinc-400 mb-1">Monto Anticipo</div>
                    <div id="monto-anticipo" class="text-lg font-bold text-white">$0</div>
                </div>
                <div class="bg-zinc-900 border border-zinc-800/60 p-4 rounded-xl">
                    <div class="text-xs text-zinc-400 mb-1">Monto a Financiar</div>
                    <div id="monto-financiar" class="text-lg font-bold text-white">$0</div>
                </div>
                <div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                    <div class="text-xs text-amber-400 mb-1 font-semibold">Cuota Mensual Est.</div>
                    <div id="cuota-mensual" class="text-xl font-black text-amber-400">$0</div>
                </div>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="index.html#contacto" class="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center">
                Solicitar Financiación
            </a>
            <button id="modal-cerrar-btn" class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3.5 rounded-xl transition-colors text-center">
                Cerrar Ficha
            </button>
        </div>
    `;

    // Lógica del simulador interactivo
    const anticipoRange = document.getElementById('anticipo-range');
    const anticipoValLabel = document.getElementById('anticipo-val');
    const cuotasSelect = document.getElementById('cuotas-select');
    const montoAnticipoEl = document.getElementById('monto-anticipo');
    const montoFinanciarEl = document.getElementById('monto-financiar');
    const cuotaMensualEl = document.getElementById('cuota-mensual');
    const modalCerrarBtn = document.getElementById('modal-cerrar-btn');

    modalCerrarBtn.addEventListener('click', closeModal);

    const calcularFinanciacion = () => {
        const pjeAnticipo = parseInt(anticipoRange.value);
        const numCuotas = parseInt(cuotasSelect.value);

        anticipoValLabel.textContent = `${pjeAnticipo}%`;

        const montoAnticipo = (auto.precioUSD * pjeAnticipo) / 100;
        const montoFinanciar = auto.precioUSD - montoAnticipo;

        // Tasa de interés anual aproximada de financiación (ej. 12% anual -> 1% mensual con interés simple o compuesto)
        // O fórmula de cuota con interés del 1.5% mensual sobre saldo
        const tasaMensual = 0.012; // 1.2% mensual
        const cuotaMensual = (montoFinanciar * tasaMensual * Math.pow(1 + tasaMensual, numCuotas)) / (Math.pow(1 + tasaMensual, numCuotas) - 1);

        montoAnticipoEl.textContent = formatUSD(montoAnticipo);
        montoFinanciarEl.textContent = formatUSD(montoFinanciar);
        cuotaMensualEl.textContent = `${formatUSD(cuotaMensual)} /mes`;
    };

    anticipoRange.addEventListener('input', calcularFinanciacion);
    cuotasSelect.addEventListener('change', calcularFinanciacion);

    // Calcular valores iniciales
    calcularFinanciacion();

    // Mostrar modal con animación
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalBox.classList.remove('scale-95');
    }, 10);
}
