/**
 * UIController - Maneja la interfaz de usuario y controles
 */
class UIController {
    constructor() {
        this.infoPanel = document.getElementById('info-panel');
        this.infoContent = document.getElementById('info-content');
        this.layerSelect = document.getElementById('layerSelect');
        this.resetViewBtn = document.getElementById('resetView');
        this.toggleInfoBtn = document.getElementById('toggleInfo');

        // Contadores
        this.hospitalCount = document.getElementById('hospital-count');
        this.educationCount = document.getElementById('education-count');
        this.municipalityCount = document.getElementById('municipality-count');

        this.infoPanelVisible = true;

        this.initializeEventListeners();
    }

    /**
     * Inicializa los event listeners de la UI
     */
    initializeEventListeners() {
        // Selector de capas
        if (this.layerSelect) {
            this.layerSelect.addEventListener('change', (e) => {
                this.handleLayerChange(e.target.value);
            });
        }

        // Botón reset view
        if (this.resetViewBtn) {
            this.resetViewBtn.addEventListener('click', () => {
                this.handleResetView();
            });
        }

        // Botón toggle info
        if (this.toggleInfoBtn) {
            this.toggleInfoBtn.addEventListener('click', () => {
                this.toggleInfoPanel();
            });
        }
    }

    /**
     * Maneja el cambio de capa
     */
    handleLayerChange(layerType) {
        console.log(`🔄 Cambiando a capa: ${layerType}`);

        if (window.layerManager) {
            window.layerManager.switchLayer(layerType);
        }

        this.updateLayerInfo(layerType);
    }

    /**
     * Maneja el reset de la vista del mapa
     */
    handleResetView() {
        console.log('🎯 Centrando vista del mapa');

        if (window.mapManager) {
            window.mapManager.resetView();
        }
    }

    /**
     * Alterna la visibilidad del panel de información
     */
    toggleInfoPanel() {
        if (this.infoPanel) {
            if (this.infoPanelVisible) {
                this.infoPanel.style.display = 'none';
                this.toggleInfoBtn.textContent = '👁️ Mostrar info';
            } else {
                this.infoPanel.style.display = 'block';
                this.toggleInfoBtn.textContent = 'ℹ️ Información';
            }
            this.infoPanelVisible = !this.infoPanelVisible;
        }
    }

    /**
     * Actualiza el panel de información con datos de un feature
     */
    updateInfoPanel(feature) {
        if (!this.infoContent || !feature) return;

        // Usar las propiedades correctas del GeoJSON
        const municipalityName = feature.properties?.DESCR || feature.properties?.ETIQUETA || 'Elemento desconocido';
        const municipalityCode = feature.properties?.CMUN || feature.properties?.CMUN4 || 'N/A';

        const infoHTML = `
            <div class="selected-info">
                <h4>📍 ${municipalityName}</h4>
                <p><strong>Código:</strong> ${municipalityCode}</p>
                <p><strong>Tipo:</strong> Municipio</p>
                <p class="timestamp">Seleccionado: ${new Date().toLocaleTimeString()}</p>
            </div>
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Hospitales:</span>
                    <span class="stat-value" id="hospital-count">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Centros educativos:</span>
                    <span class="stat-value" id="education-count">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Municipios:</span>
                    <span class="stat-value" id="municipality-count">179</span>
                </div>
            </div>
        `;

        this.infoContent.innerHTML = infoHTML;

        // Actualizar referencias a los elementos de estadísticas
        this.hospitalCount = document.getElementById('hospital-count');
        this.educationCount = document.getElementById('education-count');
        this.municipalityCount = document.getElementById('municipality-count');
    }

    /**
     * Actualiza la información de la capa actual
     */
    updateLayerInfo(layerType) {
        const layerNames = {
            'base': 'Mapa Base',
            'municipalities': 'Municipios',
            'hospitals': 'Hospitales',
            'education': 'Centros Educativos'
        };

        console.log(`ℹ️ Capa activa: ${layerNames[layerType] || layerType}`);
    }

    /**
     * Actualiza los contadores de estadísticas
     */
    updateStats(stats) {
        if (stats.hospitals !== undefined && this.hospitalCount) {
            this.hospitalCount.textContent = stats.hospitals;
        }

        if (stats.education !== undefined && this.educationCount) {
            this.educationCount.textContent = stats.education;
        }

        if (stats.municipalities !== undefined && this.municipalityCount) {
            this.municipalityCount.textContent = stats.municipalities;
        }
    }

    /**
     * Muestra un mensaje de estado
     */
    showStatusMessage(message, type = 'info') {
        console.log(`${type === 'error' ? '❌' : 'ℹ️'} ${message}`);
    }

    /**
     * Resetea el panel de información al estado inicial
     */
    resetInfoPanel() {
        if (this.infoContent) {
            this.infoContent.innerHTML = `
                <p>Selecciona un elemento en el mapa para ver información detallada.</p>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Hospitales:</span>
                        <span class="stat-value" id="hospital-count">-</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Centros educativos:</span>
                        <span class="stat-value" id="education-count">-</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Municipios:</span>
                        <span class="stat-value" id="municipality-count">179</span>
                    </div>
                </div>
            `;

            // Actualizar referencias
            this.hospitalCount = document.getElementById('hospital-count');
            this.educationCount = document.getElementById('education-count');
            this.municipalityCount = document.getElementById('municipality-count');
        }
    }
    /**
     * Actualiza la información del municipio en el panel
     */
    setMunicipalityInfo(name, code) {
        console.log('[UIController] setMunicipalityInfo called with:', name, code);
        const nameElem = document.getElementById('municipality-name');
        const codeElem = document.getElementById('municipality-code');
        if (!nameElem || !codeElem) {
            console.warn('[UIController] municipality-name or municipality-code element not found');
        }
        if (nameElem) nameElem.textContent = name || '-';
        if (codeElem) codeElem.textContent = code || '-';
    }

    /**
     * Muestra análisis educativo municipal en el panel
     */
    async showMunicipalityEducationAnalysis(municipalityId, municipalityName) {
        console.log(`[UIController] Mostrando análisis educativo para municipio: ${municipalityId}`);

        if (!this.infoContent) return;

        // Mostrar loading
        this.infoContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
                <p>Cargando análisis educativo municipal...</p>
            </div>
        `;

        try {
            // Obtener datos de cobertura y métricas de ciclos
            const [coverageData, cycleMetrics] = await Promise.all([
                window.dataLoader.getMunicipalityEducationCoverage(municipalityId),
                window.dataLoader.getMunicipalityCycleMetrics(municipalityId)
            ]);

            if (!coverageData && (!cycleMetrics || cycleMetrics.length === 0)) {
                this.infoContent.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 24px; margin-bottom: 10px;">ℹ️</div>
                        <p>No se encontraron datos de análisis educativo para este municipio.</p>
                    </div>
                `;
                return;
            }

            let html = `
                <h3 style="margin: 0 0 15px 0; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                    🏛️ Análisis Educativo Municipal
                </h3>
            `;

            // Sección de cobertura general
            if (coverageData) {
                const coveragePercentage = parseFloat(coverageData.coverage_percentage).toFixed(1);
                const accessPercentage = parseFloat(coverageData.access_percentage).toFixed(1);
                const overallCoverage = parseFloat(coverageData.overall_coverage_ratio).toFixed(2);

                html += `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #3b82f6;">
                        <h4 style="margin: 0 0 10px 0; color: #1e40af;">📊 Resumen General</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                            <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                                <div style="font-size: 20px; font-weight: bold; color: ${coveragePercentage >= 75 ? '#10b981' : coveragePercentage >= 50 ? '#f59e0b' : '#ef4444'};">${coveragePercentage}%</div>
                                <div style="font-size: 12px; color: #6b7280;">Cobertura</div>
                            </div>
                            <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                                <div style="font-size: 20px; font-weight: bold; color: ${accessPercentage >= 90 ? '#10b981' : accessPercentage >= 70 ? '#f59e0b' : '#ef4444'};">${accessPercentage}%</div>
                                <div style="font-size: 12px; color: #6b7280;">Acceso</div>
                            </div>
                        </div>
                        <div style="font-size: 13px; color: #4b5563;">
                            <div><strong>Centros totales:</strong> ${coverageData.total_centers}</div>
                            <div><strong>Población 0-19 años:</strong> ${parseInt(coverageData.total_population_0_19).toLocaleString()}</div>
                            <div><strong>Necesidad estimada:</strong> ${parseFloat(coverageData.total_estimated_need).toLocaleString()}</div>
                            <div><strong>Capacidad total:</strong> ${parseInt(coverageData.total_capacity).toLocaleString()}</div>
                            <div><strong>Ratio cobertura:</strong> ${overallCoverage}</div>
                        </div>
                        <div style="margin-top: 10px; padding: 8px; background: ${coverageData.is_fully_covered === 'True' ? '#dcfce7' : '#fef3c7'}; border-radius: 4px; font-size: 12px;">
                            <strong>Estado:</strong> ${coverageData.access_classification} 
                            ${coverageData.is_fully_covered === 'True' ? '✅' : '⚠️'}
                        </div>
                    </div>
                `;
            }

            // Sección de análisis por ciclos
            if (cycleMetrics && cycleMetrics.length > 0) {
                html += `
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #1e40af;">🎓 Análisis por Ciclos Educativos</h4>
                `;

                cycleMetrics.forEach(cycle => {
                    const coverageRatio = parseFloat(cycle.coverage_ratio).toFixed(2);
                    const isCovered = cycle.is_covered === 'True';
                    const deficit = parseFloat(cycle.deficit);

                    // Traducir nombres de ciclos
                    const cycleNames = {
                        'infantil_i_ciclo': 'Infantil I Ciclo (0-3 años)',
                        'infantil_ii_ciclo': 'Infantil II Ciclo (3-6 años)',
                        'primaria': 'Primaria (6-12 años)',
                        'eso': 'ESO (12-16 años)',
                        'bachillerato': 'Bachillerato (16-18 años)',
                        'fp_basica': 'FP Básica',
                        'fp_grado_medio': 'FP Grado Medio',
                        'fp_grado_superior': 'FP Grado Superior'
                    };
                    const cycleName = cycleNames[cycle.cycle] || cycle.cycle.toUpperCase();

                    html += `
                        <div style="margin-bottom: 15px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h5 style="margin: 0; color: #374151; font-size: 14px;">${cycleName}</h5>
                                <span style="padding: 2px 8px; background: ${isCovered ? '#dcfce7' : '#fef3c7'}; color: ${isCovered ? '#166534' : '#92400e'}; border-radius: 12px; font-size: 11px; font-weight: bold;">
                                    ${isCovered ? 'CUBIERTO' : 'DÉFICIT'}
                                </span>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px; font-size: 12px;">
                                <div style="text-align: center; padding: 6px; background: #f9fafb; border-radius: 4px;">
                                    <div style="font-weight: bold; color: #374151;">${cycle.capacity}</div>
                                    <div style="color: #6b7280;">Capacidad</div>
                                </div>
                                <div style="text-align: center; padding: 6px; background: #f9fafb; border-radius: 4px;">
                                    <div style="font-weight: bold; color: #374151;">${parseFloat(cycle.estimated_need).toFixed(0)}</div>
                                    <div style="color: #6b7280;">Necesidad</div>
                                </div>
                                <div style="text-align: center; padding: 6px; background: #f9fafb; border-radius: 4px;">
                                    <div style="font-weight: bold; color: ${isCovered ? '#10b981' : '#ef4444'};">${coverageRatio}</div>
                                    <div style="color: #6b7280;">Ratio</div>
                                </div>
                            </div>
                            
                            <div style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">
                                <strong>Centros (${cycle.num_centers}):</strong> ${cycle.centers_names}
                            </div>
                            
                            ${!isCovered && deficit > 0 ? `
                                <div style="padding: 6px 8px; background: #fee2e2; border-radius: 4px; font-size: 11px; color: #991b1b;">
                                    <strong>Déficit:</strong> ${deficit.toFixed(0)} plazas necesarias
                                </div>
                            ` : ''}
                        </div>
                    `;
                });

                html += '</div>';
            }

            // Si no hay datos de ciclos pero sí de cobertura general
            if ((!cycleMetrics || cycleMetrics.length === 0) && coverageData) {
                html += `
                    <div style="text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 13px; color: #6b7280;">
                        Datos detallados por ciclo no disponibles
                    </div>
                `;
            }

            this.infoContent.innerHTML = html;

        } catch (error) {
            console.error('❌ Error cargando análisis educativo municipal:', error);
            this.infoContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
                    <p>Error cargando análisis educativo municipal</p>
                </div>
            `;
        }
    }
}

// Hacer disponible globalmente
window.UIController = UIController;

// Hacer disponible globalmente
window.UIController = UIController;
