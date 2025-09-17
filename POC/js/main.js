/**
 * main.js - Punto de entrada principal de la aplicación
 * Coordina todos los módulos y maneja la inicialización
 */

// Variables globales para los managers
let mapManager;
let layerManager;
let uiController;
let dataLoader;
let educationManager;
let hospitalManager;

/**
 * Inicializa toda la aplicación
 */
async function initializeApp() {
    try {
        console.log('🚀 Iniciando aplicación...');

        // Verificar que el DOM esté listo
        if (document.readyState === 'loading') {
            console.log('⏳ Esperando que el DOM esté listo...');
            return;
        }

        // 1. Inicializar DataLoader
        console.log('📦 Inicializando DataLoader...');
        dataLoader = new DataLoader();
        window.dataLoader = dataLoader;

        // 2. Inicializar MapManager
        console.log('🗺️ Inicializando MapManager...');
        mapManager = new MapManager('map');
        window.mapManager = mapManager;

        // 3. Inicializar LayerManager
        console.log('📋 Inicializando LayerManager...');
        layerManager = new LayerManager(mapManager);
        window.layerManager = layerManager;

        // 4. Inicializar EducationManager y HospitalManager a través del LayerManager
        console.log('🎓 Inicializando EducationManager y HospitalManager...');
        layerManager.initializeEducationManager(dataLoader);
        educationManager = layerManager.educationManager;
        hospitalManager = layerManager.hospitalManager;

        // 5. Inicializar UIController
        console.log('🎮 Inicializando UIController...');
        uiController = new UIController();
        window.uiController = uiController;

        // 6. Pre-cargar datos importantes
        console.log('📥 Pre-cargando datos...');
        await dataLoader.preloadData();

        // 7. Cargar capa inicial de municipios
        console.log('🏛️ Cargando capa de municipios...');
        await layerManager.loadMunicipalitiesLayer();

        // 8. Mostrar capa de municipios en el mapa
        if (layerManager.layers.municipalities) {
            layerManager.layers.municipalities.addTo(mapManager.getMap());
            console.log('✅ Capa de municipios añadida al mapa');
        }

        // 9. Centrar el mapa en la Comunidad de Madrid
        mapManager.resetView();

        // 10. Obtener estadísticas iniciales
        const stats = await dataLoader.getStats();
        if (uiController && uiController.updateStats) {
            uiController.updateStats(stats);
        }

        console.log('✅ Aplicación inicializada correctamente');
        console.log('🔍 Buscador de municipios listo para usar');

        // Verificar que todos los componentes estén disponibles
        verifyComponents();

    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        showError('Error inicializando la aplicación. Por favor, recarga la página.');
    }
}

/**
 * Verifica que todos los componentes estén correctamente inicializados
 */
function verifyComponents() {
    const components = {
        'DataLoader': window.dataLoader,
        'MapManager': window.mapManager,
        'LayerManager': window.layerManager,
        'UIController': window.uiController,
        'EducationManager': window.educationManager,
        'HospitalManager': window.hospitalManager
    };

    console.log('🔍 Verificando componentes:');
    for (const [name, component] of Object.entries(components)) {
        if (component) {
            console.log(`✅ ${name} inicializado correctamente`);
        } else {
            console.warn(`❌ ${name} no está inicializado`);
        }
    }

    // Verificar elementos del DOM del buscador
    const searchElements = {
        'Search Input': document.getElementById('municipalitySearch'),
        'Search Results': document.getElementById('searchResults'),
        'Clear Button': document.getElementById('clearSearch')
    };

    console.log('🔍 Verificando elementos del buscador:');
    for (const [name, element] of Object.entries(searchElements)) {
        if (element) {
            console.log(`✅ ${name} encontrado en DOM`);
        } else {
            console.warn(`❌ ${name} no encontrado en DOM`);
        }
    }
}

/**
 * Muestra un error al usuario
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc2626;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // Remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

/**
 * Función para debuggear el buscador
 */
function debugSearcher() {
    console.log('🔍 Debug del buscador:');

    const searchInput = document.getElementById('municipalitySearch');
    if (searchInput) {
        console.log('✅ Input de búsqueda encontrado');
        console.log('Valor actual:', searchInput.value);
        console.log('Event listeners:', searchInput.cloneNode(true));
    } else {
        console.error('❌ Input de búsqueda no encontrado');
    }

    if (window.uiController) {
        console.log('✅ UIController disponible');
        if (typeof window.uiController.handleSearchInput === 'function') {
            console.log('✅ Función handleSearchInput disponible');
        } else {
            console.error('❌ Función handleSearchInput no disponible');
        }
    } else {
        console.error('❌ UIController no disponible');
    }

    if (window.dataLoader) {
        console.log('✅ DataLoader disponible');
        if (typeof window.dataLoader.searchMunicipalities === 'function') {
            console.log('✅ Función searchMunicipalities disponible');
        } else {
            console.error('❌ Función searchMunicipalities no disponible');
        }
    } else {
        console.error('❌ DataLoader no disponible');
    }
}

/**
 * Función para probar el buscador manualmente
 */
async function testSearcher(searchTerm = 'Madrid') {
    console.log(`🧪 Probando buscador con término: "${searchTerm}"`);

    if (!window.dataLoader || !window.dataLoader.searchMunicipalities) {
        console.error('❌ DataLoader o searchMunicipalities no disponible');
        return;
    }

    try {
        const results = await window.dataLoader.searchMunicipalities(searchTerm);
        console.log('✅ Resultados de búsqueda:', results);
        return results;
    } catch (error) {
        console.error('❌ Error en búsqueda de prueba:', error);
        return [];
    }
}

// Hacer funciones disponibles globalmente para debugging
window.debugSearcher = debugSearcher;
window.testSearcher = testSearcher;

/**
 * Event listener para cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado completamente');
    initializeApp();
});

/**
 * Fallback si el DOM ya está cargado
 */
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📄 DOM ya estaba listo');
    initializeApp();
}

/**
 * Event listener para errores globales
 */
window.addEventListener('error', function(event) {
    console.error('❌ Error global capturado:', event.error);
});

/**
 * Event listener para errores de promesas no capturadas
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Promise rejection no manejada:', event.reason);
});

console.log('📜 main.js cargado');
