/**
 * LayerManager - Maneja las diferentes capas de datos del mapa
 */
class LayerManager {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.map = mapManager.getMap();
        this.layers = {
            municipalities: null,
            hospitals: null,
            education: null
        };
        this.currentLayer = 'base';
    }

    /**
     * Carga y muestra la capa de municipios
     */
    async loadMunicipalitiesLayer() {
        try {
            const response = await fetch('madrid_municipalities.geojson');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de municipios');
            }

            const geojsonData = await response.json();

            // Crear capa de municipios con estilo minimalista original
            this.layers.municipalities = L.geoJSON(geojsonData, {
                style: {
                    fillColor: 'transparent',
                    weight: 2,
                    opacity: 1,
                    color: '#666',
                    fillOpacity: 0
                },
                onEachFeature: (feature, layer) => {
                    this.bindMunicipalityEvents(feature, layer);
                }
            });

            console.log('✅ Capa de municipios cargada');
        } catch (error) {
            console.error('❌ Error al cargar municipios:', error);
        }
    }

    /**
     * Vincula eventos a cada municipio
     */
    bindMunicipalityEvents(feature, layer) {
        // Usar las propiedades correctas del GeoJSON
        const municipalityName = feature.properties.DESCR || feature.properties.ETIQUETA || 'Municipio desconocido';

        layer.bindPopup(`
            <div style="text-align: center;">
                <h4>${municipalityName}</h4>
                <p><strong>Código:</strong> ${feature.properties.CMUN || feature.properties.CMUN4 || 'N/A'}</p>
            </div>
        `);

        layer.on({
            mouseover: (e) => this.highlightFeature(e),
            mouseout: (e) => this.resetHighlight(e),
            click: (e) => this.selectFeature(e)
        });
    }

    /**
     * Resalta un feature al hacer hover
     */
    highlightFeature(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#e74c3c', // Rojo vibrante para hover
            dashArray: '',
            fillOpacity: 0.2,
            fillColor: '#e74c3c'
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    /**
     * Resetea el highlight del feature
     */
    resetHighlight(e) {
        const layer = e.target;
        if (this.layers.municipalities && !layer._selected) {
            this.layers.municipalities.resetStyle(layer);
        }
    }

    /**
     * Maneja la selección de un feature
     */
    selectFeature(e) {
        const layer = e.target;
        const feature = layer.feature;

        // Resetear selección anterior
        if (this.selectedLayer && this.selectedLayer !== layer) {
            this.selectedLayer._selected = false;
            this.layers.municipalities.resetStyle(this.selectedLayer);
        }

        // Aplicar estilo de selección
        layer.setStyle({
            weight: 4,
            color: '#27ae60', // Verde destacado para selección
            dashArray: '',
            fillOpacity: 0.3,
            fillColor: '#2ecc71' // Verde más claro para el relleno
        });

        // Marcar como seleccionado
        layer._selected = true;
        this.selectedLayer = layer;

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        if (window.uiController) {
            window.uiController.updateInfoPanel(feature);
        }
    }

    /**
     * Cambia la capa visible
     */
    switchLayer(layerType) {
        // Remover capa actual
        this.removeCurrentLayer();

        switch (layerType) {
            case 'municipalities':
                if (this.layers.municipalities) {
                    this.layers.municipalities.addTo(this.map);
                }
                break;
            case 'hospitals':
                this.loadHospitalsLayer();
                break;
            case 'education':
                this.loadEducationLayer();
                break;
            case 'base':
            default:
                // Solo mostrar mapa base
                break;
        }

        this.currentLayer = layerType;
    }

    /**
     * Remueve la capa actual del mapa
     */
    removeCurrentLayer() {
        Object.values(this.layers).forEach(layer => {
            if (layer && this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });
    }

    /**
     * Carga marcadores de hospitales (placeholder)
     */
    loadHospitalsLayer() {
        // Placeholder para datos de hospitales
        console.log('📍 Cargando capa de hospitales...');
        // Aquí se cargarían los datos reales de hospitales
    }

    /**
     * Carga marcadores de centros educativos (placeholder)
     */
    loadEducationLayer() {
        // Placeholder para datos de educación
        console.log('📍 Cargando capa de centros educativos...');
        // Aquí se cargarían los datos reales de centros educativos
    }

    /**
     * Obtiene la capa actual
     */
    getCurrentLayer() {
        return this.currentLayer;
    }
}

// Hacer disponible globalmente
window.LayerManager = LayerManager;






