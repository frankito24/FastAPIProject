// Configuración inicial del mapa
class MadridMap {
    constructor() {
        this.map = null;
        this.currentLayer = 'base';
        this.markers = {
            hospitals: [],
            education: [],
            municipalities: []
        };
        this.layerGroups = {
            hospitals: L.layerGroup(),
            education: L.layerGroup(),
            municipalities: L.layerGroup(),
            municipalityBorders: L.layerGroup()
        };
        this.municipalityGeoJSON = null;

        // Configuración de la API
        this.apiBaseUrl = 'http://127.0.0.1:8000';
        this.loadingEducationCenters = false;

        this.init();
    }

    init() {
        this.createMap();
        this.setupEventListeners();
        this.loadMunicipalityBorders();
        this.loadSampleData();
        this.updateStats();
    }

    createMap() {
        // Coordenadas del centro de la Comunidad de Madrid
        const madridCenter = [40.4168, -3.7038];

        // Inicializar el mapa
        this.map = L.map('map', {
            center: madridCenter,
            zoom: 9,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Agregar capa base minimalista (sin calles ni puntos de interés)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors, © CARTO',
            maxZoom: 18,
            subdomains: 'abcd'
        }).addTo(this.map);

        // Agregar controles personalizados
        this.addCustomControls();
    }

    addCustomControls() {
        // Control de escala
        L.control.scale({
            position: 'bottomright',
            metric: true,
            imperial: false
        }).addTo(this.map);
    }

    setupEventListeners() {
        // Selector de capas
        document.getElementById('layerSelect').addEventListener('change', (e) => {
            this.switchLayer(e.target.value);
        });

        // Botón de reset de vista
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        // Botón de información
        document.getElementById('toggleInfo').addEventListener('click', () => {
            this.toggleInfoPanel();
        });
    }

    switchLayer(layerType) {
        // Limpiar capas anteriores
        Object.values(this.layerGroups).forEach(group => {
            this.map.removeLayer(group);
        });

        this.currentLayer = layerType;

        // Mostrar delimitaciones de municipios en todas las vistas
        if (this.municipalityGeoJSON) {
            this.map.addLayer(this.layerGroups.municipalityBorders);
        }

        // Mostrar la capa seleccionada
        switch(layerType) {
            case 'hospitals':
                this.map.addLayer(this.layerGroups.hospitals);
                break;
            case 'education':
                this.map.addLayer(this.layerGroups.education);
                break;
            case 'municipalities':
                this.map.addLayer(this.layerGroups.municipalities);
                break;
            case 'base':
            default:
                // Solo mostrar el mapa base con delimitaciones
                break;
        }

        this.updateInfoPanel(layerType);
    }

    async loadMunicipalityBorders() {
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
                    const props = feature.properties;
                    const municipalityId = props.CMUN || props.CMUN4;

                    layer.bindPopup(`
                        <div class="popup-title">${props.DESCR || props.ETIQUETA || 'Municipio'}</div>
                        <div class="popup-info">
                            <strong>Código:</strong> ${municipalityId || 'N/A'}<br>
                            <strong>Etiqueta:</strong> ${props.ETIQUETA || 'N/A'}<br>
                            <button onclick="window.madridMap.loadEducationCentersForMunicipality('${municipalityId}')" 
                                    style="margin-top: 10px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                📚 Cargar Centros Educativos
                            </button>
                        </div>
                    `);

                    layer.on('click', async (e) => {
                        if (municipalityId) {
                            console.log(`🎯 Clic en municipio: ${props.DESCR || props.ETIQUETA} (ID: ${municipalityId})`);
                            await this.loadEducationCentersForMunicipality(municipalityId);
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
            });

            this.layerGroups.municipalityBorders.addLayer(this.municipalityGeoJSON);
            this.map.addLayer(this.layerGroups.municipalityBorders);
            this.map.fitBounds(this.municipalityGeoJSON.getBounds(), { padding: [20, 20] });

            console.log('✅ Delimitaciones cargadas y añadidas al mapa');

        } catch (error) {
            console.error('❌ Error cargando delimitaciones:', error);
            this.showNotification('❌ Error cargando delimitaciones de municipios', '#dc2626');
        }
    }

    async getEducationCenterIdsByMunicipality(municipalityId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/education_municipality/search?id_municipality=${municipalityId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(`❌ Error obteniendo IDs de centros educativos para municipio ${municipalityId}:`, error);
            return [];
        }
    }

    async getEducationCenterById(centerId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/education/${centerId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`❌ Error obteniendo datos del centro educativo ${centerId}:`, error);
            return null;
        }
    }

    async getEducationCenterAnalysis(centerId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/education_center_analysis/search?education_center_id=${centerId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.items && data.items.length > 0 ? data.items[0] : null;
        } catch (error) {
            console.error(`❌ Error obteniendo análisis del centro educativo ${centerId}:`, error);
            return null;
        }
    }

    async getEducationCycleMetrics(centerId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/education_cycle_metrics/search?education_center_id=${centerId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(`❌ Error obteniendo métricas de ciclos del centro educativo ${centerId}:`, error);
            return [];
        }
    }

    async loadEducationCentersForMunicipality(municipalityId) {
        if (this.loadingEducationCenters) {
            console.log('⏳ Ya hay una carga de centros educativos en progreso...');
            return;
        }

        this.loadingEducationCenters = true;

        const loadingNotification = this.showNotification(
            `🔄 Cargando centros educativos con análisis del municipio ${municipalityId}...`,
            '#3b82f6'
        );

        try {
            console.log(`📚 Iniciando carga de centros educativos para municipio: ${municipalityId}`);

            this.clearEducationMarkers();
            this.clearInfoPanel();

            const educationIds = await this.getEducationCenterIdsByMunicipality(municipalityId);
            console.log(`📊 Encontrados ${educationIds.length} centros educativos`);

            if (educationIds.length === 0) {
                this.showNotification(
                    `ℹ️ No se encontraron centros educativos para el municipio ${municipalityId}`,
                    '#f59e0b'
                );
                return;
            }

            const centersWithCompleteData = [];
            let processedCount = 0;

            for (const item of educationIds) {
                const centerId = item.id_education;
                processedCount++;

                console.log(`🔍 Verificando centro ${processedCount}/${educationIds.length}: ${centerId}`);

                const centerData = await this.getEducationCenterById(centerId);
                if (!centerData) {
                    console.log(`⚠️ No se encontraron datos básicos para el centro ${centerId}`);
                    continue;
                }

                const analysisData = await this.getEducationCenterAnalysis(centerId);
                if (!analysisData) {
                    console.log(`⚠️ No se encontraron datos de análisis para el centro ${centerId}`);
                    continue;
                }

                const cycleMetrics = await this.getEducationCycleMetrics(centerId);
                if (!cycleMetrics || cycleMetrics.length === 0) {
                    console.log(`⚠️ No se encontraron métricas de ciclos para el centro ${centerId}`);
                    continue;
                }

                centersWithCompleteData.push({
                    centerData,
                    analysisData,
                    cycleMetrics
                });

                console.log(`✅ Centro ${centerId} tiene datos completos`);
            }

            console.log(`📊 Centros con datos completos: ${centersWithCompleteData.length}/${educationIds.length}`);

            if (centersWithCompleteData.length === 0) {
                this.showNotification(
                    `ℹ️ No se encontraron centros educativos con datos de análisis completos para el municipio ${municipalityId}`,
                    '#f59e0b'
                );
                return;
            }

            this.addEducationMarkersWithAnalysis(centersWithCompleteData);

            if (this.currentLayer !== 'education') {
                document.getElementById('layerSelect').value = 'education';
                this.switchLayer('education');
            }

            this.showEducationAnalysisInPanel(centersWithCompleteData);
            this.updateStats();

            this.showNotification(
                `✅ Cargados ${centersWithCompleteData.length} centros educativos con análisis del municipio ${municipalityId}`,
                '#10b981'
            );

        } catch (error) {
            console.error('❌ Error general cargando centros educativos:', error);
            this.showNotification('❌ Error cargando centros educativos', '#dc2626');
        } finally {
            this.loadingEducationCenters = false;
            if (loadingNotification && loadingNotification.parentNode) {
                loadingNotification.remove();
            }
        }
    }

    clearEducationMarkers() {
        this.layerGroups.education.clearLayers();
        this.markers.education = [];
    }

    clearInfoPanel() {
        const content = document.getElementById('info-content');
        if (content) {
            content.innerHTML = '<p>Selecciona un municipio para ver información de centros educativos.</p>';
        }
    }

    addEducationMarkersWithAnalysis(centersWithCompleteData) {
        centersWithCompleteData.forEach(({ centerData, analysisData, cycleMetrics }) => {
            const lat = parseFloat(centerData.longitude);
            const lng = parseFloat(centerData.latitude);

            if (isNaN(lat) || isNaN(lng)) {
                console.warn(`⚠️ Centro ${centerData.name_short} tiene coordenadas inválidas:`, centerData.latitude, centerData.longitude);
                return;
            }

            const icon = L.divIcon({
                html: '📚',
                iconSize: [30, 30],
                className: 'custom-div-icon education-icon'
            });

            const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                    <div class="popup-title">${centerData.name_short}</div>
                    <div class="popup-subtitle">${centerData.description_large || centerData.description_short}</div>
                    <div class="popup-info">
                        <strong>ID Centro:</strong> ${analysisData.education_center_id}<br>
                        <strong>Tipo:</strong> ${analysisData.center_type}<br>
                        <strong>Dirección:</strong> ${centerData.address}<br>
                        <strong>Municipio:</strong> ${centerData.municipality_name}<br>
                        <strong>Año Análisis:</strong> ${analysisData.analysis_year}<br>
                        <strong>Tasa Ocupación:</strong> ${(parseFloat(analysisData.center_occupancy_rate) * 100).toFixed(1)}%<br>
                        <strong>Ratio Demanda:</strong> ${parseFloat(analysisData.center_demand_ratio).toFixed(2)}<br>
                        <button onclick="window.madridMap.showCenterDetails('${analysisData.education_center_id}')" 
                                style="margin-top: 10px; padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
                            📊 Ver Análisis Detallado
                        </button>
                    </div>
                `);

            this.layerGroups.education.addLayer(marker);
            this.markers.education.push({
                marker,
                centerData,
                analysisData,
                cycleMetrics
            });
        });

        console.log(`✅ Agregados ${centersWithCompleteData.length} marcadores de centros educativos con análisis al mapa`);
    }

    showEducationAnalysisInPanel(centersWithCompleteData) {
        const content = document.getElementById('info-content');
        if (!content) return;

        let html = `
            <div style="padding: 15px;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                    📚 Análisis de Centros Educativos
                </h3>
                <div style="margin-bottom: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px;">
                    <strong>Total centros con análisis:</strong> ${centersWithCompleteData.length}
                </div>
                <div style="max-height: 70vh; overflow-y: auto;">
        `;

        centersWithCompleteData.forEach(({ centerData, analysisData, cycleMetrics }, index) => {
            const occupancyRate = (parseFloat(analysisData.center_occupancy_rate) * 100).toFixed(1);
            const demandRatio = parseFloat(analysisData.center_demand_ratio).toFixed(2);
            const admissionEfficiency = (parseFloat(analysisData.center_admission_efficiency) * 100).toFixed(1);

            html += `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #1f2937; font-size: 16px;">${centerData.name_short}</h4>
                        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${analysisData.center_type} - ${centerData.municipality_name}</p>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div style="text-align: center; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; color: #1f2937; font-size: 18px;">${occupancyRate}%</div>
                            <div style="font-size: 12px; color: #6b7280;">Ocupación</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; color: #1f2937; font-size: 18px;">${demandRatio}</div>
                            <div style="font-size: 12px; color: #6b7280;">Ratio Demanda</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 13px; color: #4b5563; margin-bottom: 5px;">
                            <strong>Matriculados:</strong> ${parseInt(analysisData.total_enrolled).toLocaleString()} / ${parseInt(analysisData.total_max_enrolled).toLocaleString()}
                        </div>
                        <div style="font-size: 13px; color: #4b5563; margin-bottom: 5px;">
                            <strong>Solicitudes:</strong> ${parseInt(analysisData.total_applications_submitted).toLocaleString()}
                        </div>
                        <div style="font-size: 13px; color: #4b5563; margin-bottom: 5px;">
                            <strong>Eficiencia Admisión:</strong> ${admissionEfficiency}%
                        </div>
                    </div>

                    ${cycleMetrics.length > 0 ? `
                        <div style="margin-top: 10px;">
                            <div style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 5px;">Ciclos:</div>
                            ${cycleMetrics.map(cycle => `
                                <span style="display: inline-block; margin-right: 5px; margin-bottom: 3px; padding: 2px 6px; background: #ddd6fe; color: #5b21b6; border-radius: 12px; font-size: 11px;">
                                    ${cycle.cycle.toUpperCase()}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div></div>';
        content.innerHTML = html;
    }

    showCenterDetails(centerId) {
        const centerInfo = this.markers.education.find(item =>
            item.analysisData && item.analysisData.education_center_id === centerId
        );

        if (!centerInfo) {
            console.error('No se encontró información del centro:', centerId);
            return;
        }

        const { centerData, analysisData, cycleMetrics } = centerInfo;

        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 25px; border-radius: 15px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
                        <h2 style="margin: 0; color: #1f2937;">${centerData.name_short}</h2>
                        <button onclick="this.closest('div').parentElement.remove()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1e40af; margin-bottom: 10px;">📊 Análisis General (${analysisData.analysis_year})</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #1e40af;">${(parseFloat(analysisData.center_occupancy_rate) * 100).toFixed(1)}%</div>
                                <div style="color: #6b7280;">Tasa de Ocupación</div>
                            </div>
                            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${parseFloat(analysisData.center_demand_ratio).toFixed(2)}</div>
                                <div style="color: #6b7280;">Ratio de Demanda</div>
                            </div>
                            <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #d97706;">${(parseFloat(analysisData.center_admission_efficiency) * 100).toFixed(1)}%</div>
                                <div style="color: #6b7280;">Eficiencia Admisión</div>
                            </div>
                            <div style="background: #fce7f3; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #be185d;">${parseInt(analysisData.total_enrolled).toLocaleString()}</div>
                                <div style="color: #6b7280;">Total Matriculados</div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #1e40af; margin-bottom: 10px;">📈 Métricas Detalladas</h3>
                        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                            <div style="margin-bottom: 8px;"><strong>Plazas Estimadas:</strong> ${parseFloat(analysisData.total_estimated_places).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Máximo Matriculados:</strong> ${parseInt(analysisData.total_max_enrolled).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Solicitudes Presentadas:</strong> ${parseInt(analysisData.total_applications_submitted).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Solicitudes Admitidas:</strong> ${parseInt(analysisData.total_applications_admitted_real).toLocaleString()}</div>
                            <div><strong>Ciclos Activos:</strong> ${analysisData.cycles_active}</div>
                        </div>
                    </div>

                    ${cycleMetrics.length > 0 ? `
                        <div>
                            <h3 style="color: #1e40af; margin-bottom: 10px;">🎓 Análisis por Ciclos</h3>
                            ${cycleMetrics.map(cycle => `
                                <div style="background: #f3f4f6; margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px; text-transform: uppercase;">${cycle.cycle}</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                                        <div><strong>Ocupación:</strong> ${(parseFloat(cycle.occupancy_rate) * 100).toFixed(1)}%</div>
                                        <div><strong>Demanda:</strong> ${parseFloat(cycle.demand_ratio).toFixed(2)}</div>
                                        <div><strong>Matriculados:</strong> ${parseInt(cycle.target_year_enrolled).toLocaleString()}</div>
                                        <div><strong>Solicitudes:</strong> ${parseInt(cycle.applications_submitted).toLocaleString()}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getEducationIcon(clave) {
        return '📚'; // Siempre usar 📚 para todos los centros educativos
    }

    showNotification(message, color = '#3b82f6') {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${color};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 600;
                animation: slideDown 0.5s ease-out;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);

        return notification;
    }

    loadSampleData() {
        const sampleHospitals = [
            { name: "Hospital Universitario La Paz", lat: 40.4789, lng: -3.6766, beds: 1371, type: "Público" },
            { name: "Hospital Universitario 12 de Octubre", lat: 40.3736, lng: -3.6982, beds: 1365, type: "Público" },
            { name: "Hospital Universitario Ramón y Cajal", lat: 40.5198, lng: -3.6645, beds: 1227, type: "Público" },
            { name: "Hospital Clínico San Carlos", lat: 40.4380, lng: -3.7283, beds: 957, type: "Público" },
            { name: "Hospital Universitario La Princesa", lat: 40.4399, lng: -3.6863, beds: 511, type: "Público" },
            { name: "Hospital de La Zarzuela", lat: 40.5012, lng: -3.7891, beds: 225, type: "Privado" },
            { name: "Hospital Universitario Fundación Alcorcón", lat: 40.3460, lng: -3.8240, beds: 398, type: "Público" },
            { name: "Hospital Universitario Puerta de Hierro", lat: 40.4789, lng: -3.7901, beds: 607, type: "Público" }
        ];

        const sampleEducation = [
            { name: "IES San Patricio", lat: 40.4789, lng: -3.6866, type: "Instituto", students: 850 },
            { name: "CEIP Ramón y Cajal", lat: 40.4199, lng: -3.6945, type: "Primaria", students: 420 },
            { name: "Universidad Complutense", lat: 40.4378, lng: -3.7283, type: "Universidad", students: 85000 },
            { name: "Universidad Politécnica", lat: 40.3971, lng: -3.7280, type: "Universidad", students: 35000 },
            { name: "IES Isaac Newton", lat: 40.5012, lng: -3.7191, type: "Instituto", students: 720 },
            { name: "CEIP Miguel de Cervantes", lat: 40.3736, lng: -3.7082, type: "Primaria", students: 380 }
        ];

        const sampleMunicipalities = [
            { name: "Madrid", lat: 40.4168, lng: -3.7038, population: 3223334 },
            { name: "Móstoles", lat: 40.3232, lng: -3.8644, population: 206451 },
            { name: "Alcalá de Henares", lat: 40.4815, lng: -3.3649, population: 195649 },
            { name: "Fuenlabrada", lat: 40.2840, lng: -3.7909, population: 194171 },
            { name: "Leganés", lat: 40.3267, lng: -3.7631, population: 188425 },
            { name: "Getafe", lat: 40.3058, lng: -3.7327, population: 180747 },
            { name: "Alcorcón", lat: 40.3460, lng: -3.8240, population: 172384 },
            { name: "Torrejón de Ardoz", lat: 40.4556, lng: -3.4910, population: 131376 }
        ];

        this.loadHospitals(sampleHospitals);
        this.loadEducation(sampleEducation);
        this.loadMunicipalities(sampleMunicipalities);
    }

    loadHospitals(hospitals) {
        hospitals.forEach(hospital => {
            const icon = L.divIcon({
                html: '🏥',
                iconSize: [30, 30],
                className: 'custom-div-icon hospital-icon'
            });

            const marker = L.marker([hospital.lat, hospital.lng], { icon })
                .bindPopup(`
                    <div class="popup-title">${hospital.name}</div>
                    <div class="popup-info">
                        <strong>Tipo:</strong> ${hospital.type}<br>
                        <strong>Camas:</strong> ${hospital.beds}<br>
                        <strong>Coordenadas:</strong> ${hospital.lat.toFixed(4)}, ${hospital.lng.toFixed(4)}
                    </div>
                `);

            this.layerGroups.hospitals.addLayer(marker);
            this.markers.hospitals.push(marker);
        });
    }

    loadEducation(centers) {
        centers.forEach(center => {
            const icon = L.divIcon({
                html: '📚',
                iconSize: [30, 30],
                className: 'custom-div-icon education-icon'
            });

            const marker = L.marker([center.lat, center.lng], { icon })
                .bindPopup(`
                    <div class="popup-title">${center.name}</div>
                    <div class="popup-info">
                        <strong>Tipo:</strong> ${center.type}<br>
                        <strong>Estudiantes:</strong> ${center.students.toLocaleString()}<br>
                        <strong>Coordenadas:</strong> ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}
                    </div>
                `);

            this.layerGroups.education.addLayer(marker);
            this.markers.education.push(marker);
        });
    }

    loadMunicipalities(municipalities) {
        municipalities.forEach(municipality => {
            const icon = L.divIcon({
                html: '🏛️',
                iconSize: [25, 25],
                className: 'custom-div-icon municipality-icon'
            });

            const marker = L.marker([municipality.lat, municipality.lng], { icon })
                .bindPopup(`
                    <div class="popup-title">${municipality.name}</div>
                    <div class="popup-info">
                        <strong>Población:</strong> ${municipality.population.toLocaleString()}<br>
                        <strong>Coordenadas:</strong> ${municipality.lat.toFixed(4)}, ${municipality.lng.toFixed(4)}
                    </div>
                `);

            this.layerGroups.municipalities.addLayer(marker);
            this.markers.municipalities.push(marker);
        });
    }

    resetView() {
        const madridCenter = [40.4168, -3.7038];
        this.map.setView(madridCenter, 9);
    }

    toggleInfoPanel() {
        const panel = document.getElementById('info-panel');
        panel.classList.toggle('hidden');
    }

    updateInfoPanel(layerType) {
        const content = document.getElementById('info-content');

        switch(layerType) {
            case 'hospitals':
                content.innerHTML = `
                    <p><strong>Vista de Hospitales</strong></p>
                    <p>Mostrando hospitales públicos y privados de la Comunidad de Madrid.</p>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Total hospitales:</span>
                            <span class="stat-value">${this.markers.hospitals.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Camas totales:</span>
                            <span class="stat-value">6,661</span>
                        </div>
                    </div>
                `;
                break;
            case 'education':
                content.innerHTML = `
                    <p><strong>Vista de Centros Educativos</strong></p>
                    <p>Centros de educación primaria, secundaria y universidades.</p>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Total centros:</span>
                            <span class="stat-value">${this.markers.education.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Estudiantes:</span>
                            <span class="stat-value">122,370</span>
                        </div>
                    </div>
                `;
                break;
            case 'municipalities':
                content.innerHTML = `
                    <p><strong>Vista de Municipios</strong></p>
                    <p>Principales municipios de la Comunidad de Madrid.</p>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Municipios mostrados:</span>
                            <span class="stat-value">${this.markers.municipalities.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Población total:</span>
                            <span class="stat-value">4.6M</span>
                        </div>
                    </div>
                `;
                break;
            default:
                content.innerHTML = `
                    <p>Selecciona una capa para ver información específica.</p>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-label">Hospitales:</span>
                            <span class="stat-value">${this.markers.hospitals.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Centros educativos:</span>
                            <span class="stat-value">${this.markers.education.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Municipios:</span>
                            <span class="stat-value">179</span>
                        </div>
                    </div>
                `;
        }
    }

    updateStats() {
        const hospitalCountElement = document.getElementById('hospital-count');
        const educationCountElement = document.getElementById('education-count');
        const municipalityCountElement = document.getElementById('municipality-count');

        if (hospitalCountElement) {
            hospitalCountElement.textContent = this.markers.hospitals.length;
        }

        if (educationCountElement) {
            educationCountElement.textContent = this.markers.education.length;
        }

        if (municipalityCountElement) {
            municipalityCountElement.textContent = '179';
        }
    }
}

// Estilos CSS adicionales para los iconos personalizados
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
`;

// Agregar estilos personalizados
const styleSheet = document.createElement('style');
styleSheet.textContent = customIconStyles;
document.head.appendChild(styleSheet);

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🗺️ Inicializando mapa de la Comunidad de Madrid...');

    // Crear instancia global para que sea accesible desde los botones de los popups
    window.madridMap = new MadridMap();

    // Mensaje de bienvenida
    setTimeout(() => {
        console.log('✅ Mapa cargado correctamente');

        // Mostrar notificación de bienvenida
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

        // Remover notificación después de 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);

    }, 1000);
});

// Agregar animación para la notificación
const notificationStyles = `
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

const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);









