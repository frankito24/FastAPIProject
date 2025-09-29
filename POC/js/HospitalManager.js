/**
 * HospitalManager - Maneja específicamente los hospitales y sus visualizaciones
 * Basado en el patrón de EducationManager
 */
class HospitalManager {
    constructor(mapManager, dataLoader) {
        this.mapManager = mapManager;
        this.dataLoader = dataLoader;
        this.map = mapManager.getMap();
        this.hospitalLayer = L.layerGroup();
        this.markers = [];
        this.hospitalsData = [];
    }

    /**
     * Carga hospitales para un municipio específico
     */
    async loadHospitalsForMunicipality(municipalityId) {
        const loadingNotification = this.showNotification(
            `🔄 Cargando hospitales con análisis del municipio ${municipalityId}...`,
            '#dc3545'
        );

        try {
            console.log(`🏥 Iniciando carga de hospitales para municipio: ${municipalityId}`);

            this.clearHospitalMarkers();

            const hospitalsWithCompleteData = await this.dataLoader.loadHospitalsForMunicipality(municipalityId);

            if (hospitalsWithCompleteData.length === 0) {
                this.showNotification(
                    `ℹ️ No se encontraron hospitales con datos de análisis completos para el municipio ${municipalityId}`,
                    '#f59e0b'
                );
                return;
            }

            this.addHospitalMarkersWithAnalysis(hospitalsWithCompleteData);
            this.hospitalsData = hospitalsWithCompleteData;

            // Mantener la capa de municipios visible y agregar los hospitales encima
            if (this.mapManager && window.layerManager) {
                const hospitalLayer = this.getHospitalLayer();
                if (hospitalLayer && !this.mapManager.getMap().hasLayer(hospitalLayer)) {
                    this.mapManager.getMap().addLayer(hospitalLayer);
                }
            }

            this.showNotification(
                `✅ Cargados ${hospitalsWithCompleteData.length} hospitales con análisis del municipio ${municipalityId}`,
                '#10b981'
            );

        } catch (error) {
            console.error('❌ Error general cargando hospitales:', error);
            this.showNotification('❌ Error cargando hospitales', '#dc2626');
        } finally {
            if (loadingNotification && loadingNotification.parentNode) {
                loadingNotification.remove();
            }
        }
    }

    /**
     * Limpia los marcadores de hospitales
     */
    clearHospitalMarkers() {
        this.hospitalLayer.clearLayers();
        this.markers = [];
        this.hospitalsData = [];
    }

    /**
     * Agrega marcadores de hospitales con análisis
     */
    addHospitalMarkersWithAnalysis(hospitalsWithCompleteData) {
        hospitalsWithCompleteData.forEach(({ hospitalData, analysisData }) => {
            const lat = parseFloat(hospitalData.latitude);
            const lng = parseFloat(hospitalData.longitude);

            if (isNaN(lat) || isNaN(lng)) {
                console.warn(`⚠️ Hospital ${hospitalData.name} tiene coordenadas inválidas:`, hospitalData.latitude, hospitalData.longitude);
                return;
            }

            const icon = L.divIcon({
                html: '🏥',
                iconSize: [30, 30],
                className: 'custom-div-icon hospital-icon'
            });

            const tasaOcupacion = (parseFloat(analysisData.tasa_ocupacion_camas) * 100).toFixed(1);
            const camasInstaladas = parseFloat(analysisData.camas_instaladas);
            const totalIngresos = parseInt(analysisData.total_ingresos).toLocaleString();

            const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                    <div class="popup-title">${hospitalData.name}</div>
                    <div class="popup-subtitle">${hospitalData.name_municipality}</div>
                    <div class="popup-info">
                        <strong>ID Hospital:</strong> ${analysisData.hospital_id}<br>
                        <strong>Dirección:</strong> ${hospitalData.address}<br>
                        <strong>Año Análisis:</strong> ${analysisData.analysis_year}<br>
                        <strong>Camas Instaladas:</strong> ${camasInstaladas}<br>
                        <strong>Tasa Ocupación:</strong> ${tasaOcupacion}%<br>
                        <strong>Total Ingresos:</strong> ${totalIngresos}<br>
                        <strong>Municipios Servidos:</strong> ${analysisData.num_municipios_asignados}<br>
                        <button onclick="window.hospitalManager.showHospitalDetails('${analysisData.hospital_id}')" 
                                style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
                            📊 Ver Análisis Detallado
                        </button>
                    </div>
                `);

            this.hospitalLayer.addLayer(marker);
            this.markers.push({
                marker,
                hospitalData,
                analysisData
            });
        });

        console.log(`✅ Agregados ${hospitalsWithCompleteData.length} marcadores de hospitales con análisis al mapa`);
    }

    /**
     * Muestra detalles de un hospital específico
     */
    showHospitalDetails(hospitalId) {
        const hospitalInfo = this.markers.find(item =>
            item.analysisData && item.analysisData.hospital_id === hospitalId
        );

        if (!hospitalInfo) {
            console.error('No se encontró información del hospital:', hospitalId);
            return;
        }

        const { hospitalData, analysisData } = hospitalInfo;

        // Crear overlay modal
        const modal = document.createElement('div');
        modal.className = 'hospital-modal-overlay';
        modal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #1f2937;">${hospitalData.name}</h2>
                    <button onclick="this.closest('.hospital-modal-overlay').remove()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">🏥 Información General</h3>
                    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="margin-bottom: 8px;"><strong>Dirección:</strong> ${hospitalData.address}</div>
                        <div style="margin-bottom: 8px;"><strong>Municipio:</strong> ${hospitalData.name_municipality}</div>
                        <div style="margin-bottom: 8px;"><strong>URL:</strong> <a href="${hospitalData.url}" target="_blank" style="color: #dc2626;">${hospitalData.url}</a></div>
                        <div><strong>Año de Análisis:</strong> ${analysisData.analysis_year}</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">📊 Métricas Principales</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${parseFloat(analysisData.camas_instaladas)}</div>
                            <div style="color: #6b7280;">Camas Instaladas</div>
                        </div>
                        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #1e40af;">${(parseFloat(analysisData.tasa_ocupacion_camas) * 100).toFixed(1)}%</div>
                            <div style="color: #6b7280;">Tasa Ocupación</div>
                        </div>
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${parseInt(analysisData.total_ingresos).toLocaleString()}</div>
                            <div style="color: #6b7280;">Total Ingresos</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">📈 Análisis de Actividad</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                            <div style="margin-bottom: 8px;"><strong>Ingresos Programados:</strong> ${parseInt(analysisData.ingresos_programados).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Ingresos Urgentes:</strong> ${parseInt(analysisData.ingresos_urgentes).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Estancia Media:</strong> ${parseFloat(analysisData.estancia_media_global).toFixed(2)} días</div>
                            <div><strong>Días Hospitalización:</strong> ${parseInt(analysisData.dias_hospitalizacion).toLocaleString()}</div>
                        </div>
                        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                            <div style="margin-bottom: 8px;"><strong>Urgencias Totales:</strong> ${parseInt(analysisData.urgencias_totales).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Capacidad Anual:</strong> ${parseInt(analysisData.capacidad_anual_camas).toLocaleString()}</div>
                            <div style="margin-bottom: 8px;"><strong>Productividad Camas:</strong> ${parseFloat(analysisData.productividad_camas).toFixed(2)}</div>
                            <div><strong>Eficiencia Estancia:</strong> ${(parseFloat(analysisData.eficiencia_estancia) * 100).toFixed(2)}%</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">🌍 Cobertura Poblacional</h3>
                    <div style="background: #fef7ff; padding: 15px; border-radius: 8px;">
                        <div style="margin-bottom: 8px;"><strong>Población Asignada:</strong> ${parseInt(analysisData.poblacion_total_asignada).toLocaleString()} habitantes</div>
                        <div style="margin-bottom: 8px;"><strong>Municipios Servidos:</strong> ${analysisData.num_municipios_asignados}</div>
                        <div style="margin-bottom: 8px;"><strong>Camas por 1000 hab.:</strong> ${parseFloat(analysisData.camas_por_1000_asignados).toFixed(2)}</div>
                        <div style="margin-bottom: 8px;"><strong>Capacidad Atención por 1000 hab.:</strong> ${parseFloat(analysisData.capacidad_atencion_por_1000_asignados).toFixed(2)}</div>
                        <div style="margin-bottom: 15px;"><strong>Preparación Camas:</strong> 
                            <span style="padding: 2px 8px; background: ${analysisData.preparacion_camas === 'Suficiente' ? '#dcfce7' : '#fef3c7'}; color: ${analysisData.preparacion_camas === 'Suficiente' ? '#166534' : '#92400e'}; border-radius: 12px; font-size: 12px;">
                                ${analysisData.preparacion_camas}
                            </span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;display:none;">
                    <h3 style="color: #dc2626; margin-bottom: 10px;">📋 Puntuaciones de Rendimiento</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; margin-bottom: 4px;">Ocupación Camas</div>
                            <div style="font-size: 18px; color: #1e40af;">${parseFloat(analysisData.tasa_ocupacion_camas_score).toFixed(1)}/100</div>
                        </div>
                        <div style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; margin-bottom: 4px;">Nivel de Servicio</div>
                            <div style="font-size: 18px; color: #1e40af;">${parseFloat(analysisData.nivel_servicio_score).toFixed(1)}/100</div>
                        </div>
                        <div style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; margin-bottom: 4px;">Productividad</div>
                            <div style="font-size: 18px; color: #1e40af;">${parseFloat(analysisData.productividad_camas_score).toFixed(1)}/100</div>
                        </div>
                        <div style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                            <div style="font-weight: bold; margin-bottom: 4px;">Preparación Poblacional</div>
                            <div style="font-size: 18px; color: #1e40af;">${parseFloat(analysisData.indice_preparacion_poblacional).toFixed(1)}/100</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style="color: #dc2626; margin-bottom: 10px;">🏘️ Municipios Servidos</h3>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; max-height: 150px; overflow-y: auto;">
                        ${JSON.parse(analysisData.municipios_servidos.replace(/'/g, '"')).map(municipio => 
                            `<span style="display: inline-block; margin: 2px; padding: 4px 8px; background: #e2e8f0; border-radius: 12px; font-size: 12px;">${municipio}</span>`
                        ).join('')}
                    </div>
                </div>
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
     * Muestra una notificación
     */
    showNotification(message, color = '#dc3545') {
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
     * Obtiene la capa de hospitales
     */
    getHospitalLayer() {
        return this.hospitalLayer;
    }

    /**
     * Obtiene los datos actuales de hospitales
     */
    getHospitalsData() {
        return this.hospitalsData;
    }

    /**
     * Obtiene los marcadores actuales
     */
    getMarkers() {
        return this.markers;
    }
}

// Hacer disponible globalmente
window.HospitalManager = HospitalManager;
