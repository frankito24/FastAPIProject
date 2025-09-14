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

        // Inicializar EducationManager después de que DataLoader esté disponible
        this.educationManager = null;
        this.municipalityGeoJSON = null;
    }

    /**
     * Inicializa el EducationManager cuando DataLoader esté disponible
     */
    initializeEducationManager(dataLoader) {
        this.educationManager = new EducationManager(this.mapManager, dataLoader);
        window.educationManager = this.educationManager;
    }

    /**
     * Carga y muestra la capa de municipios (migrado desde app.js)
     */
    async loadMunicipalitiesLayer() {
        try {
            console.log('🗺️ Cargando delimitaciones de municipios...');
            const response = await fetch('madrid_municipalities.geojson');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const geojsonData = await response.json();
            console.log('📊 GeoJSON cargado:', geojsonData.features?.length, 'municipios');

            this.municipalityGeoJSON = L.geoJSON(geojsonData, {
                style: {
                    color: '#1e40af',
                    weight: 2,
                    opacity: 0.9,
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2
                },
                onEachFeature: (feature, layer) => {
                    this.bindMunicipalityEvents(feature, layer);
                }
            });

            this.layers.municipalities = this.municipalityGeoJSON;

            console.log('✅ Capa de municipios cargada');
        } catch (error) {
            console.error('❌ Error al cargar municipios:', error);
            if (window.educationManager) {
                window.educationManager.showNotification('❌ Error cargando delimitaciones de municipios', '#dc2626');
            }
        }
    }

    /**
     * Vincula eventos a cada municipio (migrado desde app.js)
     */
    bindMunicipalityEvents(feature, layer) {
        const props = feature.properties;
        const municipalityId = props.CMUN || props.CMUN4;
        const municipalityName = props.DESCR || props.ETIQUETA || 'Municipio';

        layer.bindPopup(`
            <div class="popup-title">${municipalityName}</div>
            <div class="popup-info">
                <strong>Código:</strong> ${municipalityId || 'N/A'}<br>
                <strong>Etiqueta:</strong> ${props.ETIQUETA || 'N/A'}<br>
                <button onclick="window.layerManager.loadEducationCentersForMunicipality('${municipalityId}')"
                        style="margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📚 Cargar Centros Educativos
                </button>
            </div>
        `);

        layer.on('click', () => {
            console.log('[LayerManager] Municipio clicked:', municipalityName, municipalityId);
            if (window.uiController && typeof window.uiController.setMunicipalityInfo === 'function') {
                window.uiController.setMunicipalityInfo(municipalityName, municipalityId);
            } else {
                console.warn('[LayerManager] window.uiController or setMunicipalityInfo not available');
            }
        });

        layer.on('mouseover', () => {
            layer.setStyle({
                fillOpacity: 0.5,
                weight: 3,
                color: '#dc2626'
            });
        });

        layer.on('mouseout', () => {
            layer.setStyle({
                fillOpacity: 0.2,
                weight: 2,
                color: '#1e40af'
            });
        });
    }

    /**
     * Carga centros educativos para un municipio (delegado al EducationManager)
     */
    async loadEducationCentersForMunicipality(municipalityId) {
        if (this.educationManager) {
            await this.educationManager.loadEducationCentersForMunicipality(municipalityId);
        } else {
            console.error('❌ EducationManager no está inicializado');
        }
    }

    /**
     * Cambia la capa visible
     */
    switchLayer(layerType) {
        // Remover capa actual (excepto municipios que siempre quedan como base)
        this.removeCurrentLayer();

        // Siempre mostrar municipios como base si están cargados
        if (this.layers.municipalities && !this.map.hasLayer(this.layers.municipalities)) {
            this.layers.municipalities.addTo(this.map);
        }

        switch (layerType) {
            case 'municipalities':
                if (this.layers.municipalities) {
                    this.layers.municipalities.addTo(this.map);
                    // Ajustar vista a los límites de los municipios
                    this.map.fitBounds(this.layers.municipalities.getBounds(), { padding: [20, 20] });
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
                // Solo mostrar mapa base con municipios
                break;
        }

        this.currentLayer = layerType;
    }

    /**
     * Remueve la capa actual del mapa (excepto municipios)
     */
    removeCurrentLayer() {
        // Remover capas de datos específicos (hospitales, educación)
        // pero mantener municipios como base
        if (this.layers.hospitals && this.map.hasLayer(this.layers.hospitals)) {
            this.map.removeLayer(this.layers.hospitals);
        }

        // Remover capa de educación si está activa
        if (this.educationManager && this.map.hasLayer(this.educationManager.getEducationLayer())) {
            this.map.removeLayer(this.educationManager.getEducationLayer());
        }

        // NO remover la capa de municipios - siempre debe permanecer como base
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
     * Carga marcadores de centros educativos
     */
    loadEducationLayer() {
        console.log('📍 Cargando capa de centros educativos...');
        if (this.educationManager) {
            const educationLayer = this.educationManager.getEducationLayer();
            if (educationLayer && educationLayer.getLayers().length > 0) {
                this.map.addLayer(educationLayer);
            }
        }
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
