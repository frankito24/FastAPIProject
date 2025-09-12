/**
 * main.js - Punto de entrada principal de la aplicación
 * Coordina todos los módulos y maneja la inicialización
 */

// Variables globales para los managers
let mapManager;
let layerManager;
let uiController;
let dataLoader;

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
        dataLoader = new DataLoader();
        window.dataLoader = dataLoader;

        // 2. Inicializar MapManager
        mapManager = new MapManager('map');
        window.mapManager = mapManager;

        // 3. Inicializar LayerManager
        layerManager = new LayerManager(mapManager);
        window.layerManager = layerManager;

        // 4. Inicializar UIController
        uiController = new UIController();
        window.uiController = uiController;

        // 5. Pre-cargar datos importantes
        await dataLoader.preloadData();

        // 6. Cargar capa inicial de municipios
        await layerManager.loadMunicipalitiesLayer();

        // 7. Mostrar la capa de municipios por defecto
        layerManager.switchLayer('municipalities');

        // 8. Actualizar el selector a "municipalities"
        const layerSelect = document.getElementById('layerSelect');
        if (layerSelect) {
            layerSelect.value = 'municipalities';
        }

        // 9. Actualizar estadísticas
        await updateStats();

        // 10. Configurar event listeners globales
        setupGlobalEventListeners();

        console.log('✅ Aplicación inicializada correctamente con capa de municipios activa');

    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        showErrorMessage('Error al cargar la aplicación. Por favor, recarga la página.');
    }
}

/**
 * Actualiza las estadísticas de la aplicación
 */
async function updateStats() {
    try {
        const stats = await dataLoader.getStats();
        uiController.updateStats(stats);
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

/**
 * Configura event listeners globales
 */
function setupGlobalEventListeners() {
    // Manejar cambio de tamaño de ventana
    window.addEventListener('resize', () => {
        if (mapManager) {
            setTimeout(() => {
                mapManager.invalidateSize();
            }, 100);
        }
    });

    // Manejar errores globales
    window.addEventListener('error', (event) => {
        console.error('Error global:', event.error);
    });

    // Manejar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesa rechazada:', event.reason);
    });
}

/**
 * Muestra un mensaje de error
 */
function showErrorMessage(message) {
    console.error('❌', message);
    // Aquí podrías mostrar una notificación visual si fuera necesario
}

/**
 * Funciones de utilidad globales
 */

// Función para resetear la aplicación
window.resetApp = function() {
    console.log('🔄 Reseteando aplicación...');

    if (mapManager) {
        mapManager.resetView();
    }

    if (uiController) {
        uiController.resetInfoPanel();
    }

    if (layerManager) {
        layerManager.switchLayer('base');
    }

    console.log('✅ Aplicación reseteada');
};

// Función para obtener información de debug
window.getAppInfo = function() {
    const info = {
        mapInitialized: !!mapManager,
        layersLoaded: !!layerManager,
        uiReady: !!uiController,
        dataLoaderReady: !!dataLoader,
        currentLayer: layerManager ? layerManager.getCurrentLayer() : 'unknown',
        cacheInfo: dataLoader ? dataLoader.getCacheInfo() : null
    };

    console.table(info);
    return info;
};

// Función para limpiar recursos
window.cleanupApp = function() {
    console.log('🧹 Limpiando recursos...');

    if (dataLoader) {
        dataLoader.clearCache();
    }

    console.log('✅ Recursos limpiados');
};

/**
 * Inicialización de la aplicación
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
