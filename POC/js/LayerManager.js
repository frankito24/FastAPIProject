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

        // Inicializar managers después de que DataLoader esté disponible
        this.educationManager = null;
        this.hospitalManager = null;
        this.municipalityGeoJSON = null;

    }

    /**
     * Inicializa los managers cuando DataLoader esté disponible
     */
    initializeEducationManager(dataLoader) {
        this.educationManager = new EducationManager(this.mapManager, dataLoader);
        this.hospitalManager = new HospitalManager(this.mapManager, dataLoader);
        window.educationManager = this.educationManager;
        window.hospitalManager = this.hospitalManager;
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
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    <button onclick="window.layerManager.loadEducationCentersForMunicipality('${municipalityId}')"
                            style="flex: 1; padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        📚 Centros Educativos
                    </button>
                    <button onclick="window.layerManager.loadHospitalsForMunicipality('${municipalityId}')"
                            style="flex: 1; padding: 8px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🏥 Hospitales
                    </button>
                </div>
            </div>
        `);

        // Actualiza el info-panel al hacer clic en el municipio
        layer.on('click', async () => {
            console.log('[LayerManager] Municipio clicked:', municipalityName, municipalityId);

            // Resetear el estilo del municipio previamente seleccionado
            this.resetPreviousSelection();

            // Marcar el nuevo municipio como seleccionado
            this.selectMunicipality(layer);

            if (window.uiController && typeof window.uiController.setMunicipalityInfo === 'function') {
                window.uiController.setMunicipalityInfo(municipalityName, municipalityId);
            }

            // Mostrar análisis educativo municipal
            if (window.uiController && typeof window.uiController.showMunicipalityEducationAnalysis === 'function') {
                await window.uiController.showMunicipalityEducationAnalysis(municipalityId, municipalityName);
            }
        });

        layer.on('mouseover', () => {
            // Solo aplicar hover si no es el municipio seleccionado
            if (this.selectedMunicipality !== layer) {
                layer.setStyle({
                    fillOpacity: 0.5,
                    weight: 3,
                    color: '#dc2626'
                });
            }
        });

        layer.on('mouseout', () => {
            // Solo resetear hover si no es el municipio seleccionado
            if (this.selectedMunicipality !== layer) {
                layer.setStyle({
                    fillOpacity: 0.2,
                    weight: 2,
                    color: '#1e40af'
                });
            }
        });
    }

    /**
     * Selecciona un municipio y lo marca en rojo
     */
    selectMunicipality(layer) {
        this.selectedMunicipality = layer;
        layer.setStyle({
            fillColor: '#dc2626',
            fillOpacity: 0.6,
            weight: 3,
            color: '#b91c1c',
            opacity: 1
        });
    }

    /**
     * Resetea el estilo del municipio previamente seleccionado
     */
    resetPreviousSelection() {
        if (this.selectedMunicipality) {
            this.selectedMunicipality.setStyle({
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                weight: 2,
                color: '#1e40af',
                opacity: 0.9
            });
            this.selectedMunicipality = null;
        }
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
     * Carga hospitales para un municipio (delegado al HospitalManager)
     */
    async loadHospitalsForMunicipality(municipalityId) {
        if (this.hospitalManager) {
            await this.hospitalManager.loadHospitalsForMunicipality(municipalityId);
        } else {
            console.error('❌ HospitalManager no está inicializado');
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
                    this.map.fitBounds(this.layers.municipalities.getBounds(), {padding: [20, 20]});
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

        // Remover capa de hospitales si está activa
        if (this.hospitalManager && this.map.hasLayer(this.hospitalManager.getHospitalLayer())) {
            this.map.removeLayer(this.hospitalManager.getHospitalLayer());
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
     * Obtiene la capa currente
     */
    getCurrentLayer() {
        return this.currentLayer;
    }

    /**
     * Selecciona un municipio por su ID desde el buscador
     */
    selectMunicipalityById(municipalityId) {
        console.log(`🔍 Buscando municipio con ID: "${municipalityId}"`);

        if (!this.municipalityGeoJSON) {
            console.warn('❌ municipalityGeoJSON no está cargado');
            return;
        }

        let found = false;
        // Buscar el layer del municipio por su ID
        this.municipalityGeoJSON.eachLayer((layer) => {
            const props = layer.feature.properties;
            const layerMunicipalityId = props.CMUN || props.CMUN4;

            console.log(`🔍 Comparando: "${layerMunicipalityId}" === "${municipalityId}"`);

            // Comparar como strings para evitar problemas de tipo
            if (String(layerMunicipalityId) === String(municipalityId)) {
                console.log(`✅ Municipio encontrado: ${props.DESCR || props.ETIQUETA}`);

                // Resetear selección anterior
                this.resetPreviousSelection();

                // Seleccionar este municipio
                this.selectMunicipality(layer);

                // Hacer zoom al municipio
                this.map.fitBounds(layer.getBounds(), { padding: [50, 50] });

                console.log(`✅ Municipio ${municipalityId} seleccionado y centrado en el mapa`);
                found = true;
                return; // Salir del loop
            }
        });

        if (!found) {
            console.warn(`❌ No se encontró municipio con ID: "${municipalityId}"`);
        }
    }

    /**
     * Hace zoom a un municipio específico por ID
     */
    zoomToMunicipality(municipalityId) {
        console.log(`🎯 Aplicando zoom a municipio con ID: "${municipalityId}"`);

        if (!this.municipalityGeoJSON) {
            console.warn('❌ municipalityGeoJSON no está cargado para zoom');
            return;
        }

        let found = false;
        this.municipalityGeoJSON.eachLayer((layer) => {
            const props = layer.feature.properties;
            const layerMunicipalityId = props.CMUN || props.CMUN4;

            // Comparar como strings para evitar problemas de tipo
            if (String(layerMunicipalityId) === String(municipalityId)) {
                this.map.fitBounds(layer.getBounds(), { padding: [50, 50] });
                console.log(`🎯 Zoom aplicado al municipio ${municipalityId}`);
                found = true;
                return; // Salir del loop
            }
        });

        if (!found) {
            console.warn(`❌ No se pudo hacer zoom - municipio no encontrado: "${municipalityId}"`);
        }
    }
}

// Hacer disponible globalmente
window.LayerManager = LayerManager;
