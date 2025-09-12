/**
 * main.js - Punto de entrada principal de la aplicación
 * Coordina todos los módulos y maneja la inicialización
 */

// Variables globales para los managers
let mapManager;
let layerManager;
let uiController;
let dataLoader;
let educationManager; // Nueva variable para el EducationManager

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

        // 4. Inicializar EducationManager a través del LayerManager
        layerManager.initializeEducationManager(dataLoader);
        educationManager = layerManager.educationManager;

        // 5. Inicializar UIController
        uiController = new UIController();
        window.uiController = uiController;

        // 6. Pre-cargar datos importantes
        await dataLoader.preloadData();

        // 7. Cargar capa inicial de municipios
        await layerManager.loadMunicipalitiesLayer();

        // 8. Mostrar la capa de municipios por defecto
        layerManager.switchLayer('municipalities');

        // 9. Actualizar el selector a "municipalities"
        const layerSelect = document.getElementById('layerSelect');
        if (layerSelect) {
            layerSelect.value = 'municipalities';
        }

        // 10. Actualizar estadísticas
        await updateStats();

        // 11. Configurar event listeners globales
        setupGlobalEventListeners();

        // 12. Agregar estilos CSS para los iconos de educación (migrado desde app.js)
        addCustomIconStyles();

        // 13. Mostrar notificación de bienvenida (migrada desde app.js)
        showWelcomeNotification();

        console.log('✅ Aplicación inicializada correctamente con capa de municipios activa');

    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        showErrorMessage('Error al cargar la aplicación. Por favor, recarga la página.');
    }
}

/**
 * Agrega estilos CSS personalizados (migrado desde app.js)
 */
function addCustomIconStyles() {
    const customIconStyles = `
        .custom-div-icon {
            background: none !important;
            border: none !important;
            text-align: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .custom-div-icon:hover {
            transform: scale(1.2);
            filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
        }

        .hospital-icon {
            filter: drop-shadow(0 2px 4px rgba(255,107,107,0.5));
        }

        .education-icon {
            filter: drop-shadow(0 2px 4px rgba(78,205,196,0.5));
        }

        .municipality-icon {
            filter: drop-shadow(0 2px 4px rgba(69,183,209,0.5));
        }

        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = customIconStyles;
    document.head.appendChild(styleSheet);
}

/**
 * Muestra notificación de bienvenida (migrada desde app.js)
 */
function showWelcomeNotification() {
    setTimeout(() => {
        console.log('✅ Mapa cargado correctamente');

        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 600;
                animation: slideDown 0.5s ease-out;
            ">
                🎉 ¡Mapa de Madrid cargado! Haz clic en cualquier municipio para cargar sus centros educativos.
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

    }, 1000);
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
