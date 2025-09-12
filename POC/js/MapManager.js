/**
 * MapManager - Maneja la inicialización y operaciones básicas del mapa
 */
class MapManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.defaultView = {
            center: [40.4168, -3.7038], // Madrid
            zoom: 10
        };

        this.initializeMap();
    }

    /**
     * Inicializa el mapa de Leaflet
     */
    initializeMap() {
        try {
            // Crear el mapa
            this.map = L.map(this.containerId).setView(
                this.defaultView.center,
                this.defaultView.zoom
            );

            // Agregar capa base minimalista (solo contornos)
            L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png', {
                attribution: '© Stadia Maps © Stamen Design © OpenMapTiles © OpenStreetMap contributors',
                maxZoom: 18,
                opacity: 0.3
            }).addTo(this.map);

            // Alternativamente, usar una capa completamente vacía para máximo minimalismo
            // Descomenta la siguiente línea si prefieres un fondo completamente blanco
            /*
            L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
            */

            console.log('✅ Mapa inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar el mapa:', error);
        }
    }

    /**
     * Centra la vista del mapa a la posición por defecto
     */
    resetView() {
        if (this.map) {
            this.map.setView(this.defaultView.center, this.defaultView.zoom);
        }
    }

    /**
     * Obtiene la instancia del mapa
     * @returns {L.Map} Instancia del mapa
     */
    getMap() {
        return this.map;
    }

    /**
     * Ajusta el tamaño del mapa
     */
    invalidateSize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }
}

// Hacer disponible globalmente
window.MapManager = MapManager;
