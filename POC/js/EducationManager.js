/**
 * EducationManager - Maneja específicamente los centros educativos y sus visualizaciones
 * (Migrado desde app.js)
 */
class EducationManager {
    constructor(mapManager, dataLoader) {
        this.mapManager = mapManager;
        this.dataLoader = dataLoader;
        this.map = mapManager.getMap();
        this.educationLayer = L.layerGroup();
        this.markers = [];
        this.centersData = [];
    }

    /**
     * Carga centros educativos para un municipio específico (migrado desde app.js)
     */
    async loadEducationCentersForMunicipality(municipalityId) {
        const loadingNotification = this.showNotification(
            `🔄 Cargando centros educativos con análisis del municipio ${municipalityId}...`,
            '#3b82f6'
        );

        try {
            console.log(`📚 Iniciando carga de centros educativos para municipio: ${municipalityId}`);

            this.clearEducationMarkers();

            const centersWithCompleteData = await this.dataLoader.loadEducationCentersForMunicipality(municipalityId);

            if (centersWithCompleteData.length === 0) {
                this.showNotification(
                    `ℹ️ No se encontraron centros educativos con datos de análisis completos para el municipio ${municipalityId}`,
                    '#f59e0b'
                );
                return;
            }

            this.addEducationMarkersWithAnalysis(centersWithCompleteData);
            this.centersData = centersWithCompleteData;

            // NO cambiar automáticamente a la capa de educación
            // Mantener la capa de municipios visible y agregar los centros educativos encima
            if (this.mapManager && window.layerManager) {
                const educationLayer = this.getEducationLayer();
                if (educationLayer && !this.mapManager.getMap().hasLayer(educationLayer)) {
                    this.mapManager.getMap().addLayer(educationLayer);
                }
            }

            this.showNotification(
                `✅ Cargados ${centersWithCompleteData.length} centros educativos con análisis del municipio ${municipalityId}`,
                '#10b981'
            );

        } catch (error) {
            console.error('❌ Error general cargando centros educativos:', error);
            this.showNotification('❌ Error cargando centros educativos', '#dc2626');
        } finally {
            if (loadingNotification && loadingNotification.parentNode) {
                loadingNotification.remove();
            }
        }
    }

    /**
     * Limpia los marcadores de educación (migrado desde app.js)
     */
    clearEducationMarkers() {
        this.educationLayer.clearLayers();
        this.markers = [];
        this.centersData = [];
    }

    /**
     * Limpia el panel de información (migrado desde app.js)
     */
    clearInfoPanel() {
        const content = document.getElementById('info-content');
        if (content) {
            content.innerHTML = '<p>Selecciona un municipio para ver información de centros educativos.</p>';
        }
    }

    /**
     * Agrega marcadores de centros educativos con análisis (migrado desde app.js)
     */
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
                        <button onclick="window.educationManager.showCenterDetails('${analysisData.education_center_id}')" 
                                style="margin-top: 10px; padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
                            📊 Ver Análisis Detallado
                        </button>
                    </div>
                `);

            this.educationLayer.addLayer(marker);
            this.markers.push({
                marker,
                centerData,
                analysisData,
                cycleMetrics
            });
        });

        console.log(`✅ Agregados ${centersWithCompleteData.length} marcadores de centros educativos con análisis al mapa`);
    }

    /**
     * Muestra el análisis de educación en el panel (migrado desde app.js)
     */
    showEducationAnalysisInPanel(centersWithCompleteData) {
        const content = document.getElementById('info-content');
        if (!content) return;

        let html = `
            <h3 style="margin: 0 0 15px 0; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                📚 Análisis de Centros Educativos
            </h3>
            <div style="margin-bottom: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px;">
                <strong>Total centros con análisis:</strong> ${centersWithCompleteData.length}
            </div>
            <div class="education-centers-list">
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

        html += '</div>';
        content.innerHTML = html;
    }

    /**
     * Muestra detalles de un centro específico (migrado desde app.js)
     */
    showCenterDetails(centerId) {
        const centerInfo = this.markers.find(item =>
            item.analysisData && item.analysisData.education_center_id === centerId
        );

        if (!centerInfo) {
            console.error('No se encontró información del centro:', centerId);
            return;
        }

        const { centerData, analysisData, cycleMetrics } = centerInfo;

        // Crear overlay con clase para fácil referencia
        const modal = document.createElement('div');
        modal.className = 'education-modal-overlay';
        modal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #1f2937;">${centerData.name_short}</h2>
                    <button onclick="this.closest('.education-modal-overlay').remove()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
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
        `;
        // Overlay con fondo oscuro y centrado
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '10001';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        document.body.appendChild(modal);
    }

    /**
     * Muestra una notificación (migrado desde app.js)
     */
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

    /**
     * Obtiene la capa de educación
     */
    getEducationLayer() {
        return this.educationLayer;
    }

    /**
     * Obtiene los datos actuales de centros
     */
    getCentersData() {
        return this.centersData;
    }

    /**
     * Obtiene los marcadores actuales
     */
    getMarkers() {
        return this.markers;
    }
}

// Hacer disponible globalmente
window.EducationManager = EducationManager;
