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

        // Buscador de municipios
        this.searchInput = document.getElementById('municipalitySearch');
        this.searchResults = document.getElementById('searchResults');
        this.clearSearchBtn = document.getElementById('clearSearch');
        this.searchTimeout = null;
        this.currentSearchTerm = '';

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
        // Buscador de municipios
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            this.searchInput.addEventListener('focus', () => {
                if (this.searchResults.children.length > 0) {
                    this.searchResults.style.display = 'block';
                }
            });

            this.searchInput.addEventListener('blur', () => {
                // Delay para permitir clicks en resultados
                setTimeout(() => {
                    this.searchResults.style.display = 'none';
                }, 200);
            });
        }

        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                // Solo limpiar el estado del buscador, no resetear el mapa
                this.searchInput.value = '';
                this.clearSearchState();
            });
        }

        // Cerrar resultados al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.searchInput?.contains(e.target) && !this.searchResults?.contains(e.target)) {
                this.searchResults.style.display = 'none';
            }
        });
    }

    /**
     * Resetea el panel de información al estado inicial
     */
    resetInfoPanel() {
        if (this.infoContent) {
            this.infoContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">Trabajo de Fin de Máster</h4>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                    <h5 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Determinación del nivel de prestación de los servicios públicos de ámbito local y comercial en la Comunidad de Madrid</h5>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563;"><strong>Máster:</strong> Ingeniería Informática 24/25</p>
                    <p style="margin: 0; font-size: 13px; color: #4b5563;"><strong>Universidad:</strong> UC3M</p>
                </div>
                
                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="color: #0369a1; margin: 0 0 10px 0; font-size: 15px;">🎯 Objetivo del Visor</h6>
                    <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
                        Este visor interactivo permite analizar la cobertura y accesibilidad de servicios públicos 
                        de educación y salud en los municipios de la Comunidad de Madrid.
                    </p>
                </div>
                
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h6 style="color: #059669; margin: 0 0 10px 0; font-size: 15px;">📋 Cómo usar el visor</h6>
                    <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: #374151;">
                        <li style="margin-bottom: 5px;">🔍 Busca un municipio en el buscador superior</li>
                        <li style="margin-bottom: 5px;">🗺️ Haz clic en cualquier municipio del mapa</li>
                        <li style="margin-bottom: 5px;">📊 Visualiza análisis detallados de cobertura</li>
                        <li>🏥📚 Explora centros de salud y educación</li>
                    </ul>
                </div>
            `;

            // Actualizar referencias
            this.hospitalCount = null;
            this.educationCount = null;
            this.municipalityCount = null;
        }

        // Ocultar información del municipio cuando se resetea el panel
        const municipalityInfo = document.getElementById('municipality-info');
        if (municipalityInfo) {
            municipalityInfo.style.display = 'none';
        }
    }

    /**
     * Actualiza la información del municipio en el panel
     */
    setMunicipalityInfo(name, code) {
        console.log('[UIController] setMunicipalityInfo called with:', name, code);

        const municipalityInfo = document.getElementById('municipality-info');
        const nameElem = document.getElementById('municipality-name');
        const codeElem = document.getElementById('municipality-code');

        if (!nameElem || !codeElem) {
            console.warn('[UIController] municipality-name or municipality-code element not found');
        }

        if (nameElem) nameElem.textContent = name || '-';
        if (codeElem) codeElem.textContent = code || '-';

        // Mostrar u ocultar el elemento municipality-info según si hay municipio seleccionado
        if (municipalityInfo) {
            if (name && name !== '-') {
                municipalityInfo.style.display = 'block';
            } else {
                municipalityInfo.style.display = 'none';
            }
        }
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

            // Análisis por ciclos educativos
            if (cycleMetrics && cycleMetrics.length > 0) {
                html += `
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #1e40af;">🎓 Análisis por Ciclos Educativos</h4>
                `;

                cycleMetrics.forEach(cycle => {
                    const coverageRatio = parseFloat(cycle.coverage_ratio).toFixed(2);
                    const isCovered = cycle.is_covered === 'True';
                    const deficit = parseFloat(cycle.deficit);

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

    /**
     * Maneja la entrada de texto en el buscador
     */
    handleSearchInput(value) {
        const trimmedValue = value.trim();
        this.currentSearchTerm = trimmedValue;

        if (trimmedValue.length > 0) {
            this.clearSearchBtn.style.display = 'block';
        } else {
            this.clearSearchBtn.style.display = 'none';
            this.searchResults.style.display = 'none';
            if (trimmedValue.length === 0) {
                this.clearSearchState();
            }
            return;
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (trimmedValue.length < 3) {
            this.searchResults.style.display = 'none';
            return;
        }

        // Delay de 0.5 segundos antes de buscar
        this.searchTimeout = setTimeout(() => {
            this.performSearch(trimmedValue);
        }, 500);
    }

    /**
     * Realiza la búsqueda de municipios
     */
    async performSearch(searchTerm) {
        if (searchTerm !== this.currentSearchTerm || searchTerm.length < 3) {
            return;
        }

        console.log(`🔍 Buscando municipios con término: "${searchTerm}"`);
        this.showSearchLoading();

        try {
            const results = await window.dataLoader.searchMunicipalities(searchTerm);
            if (searchTerm !== this.currentSearchTerm) {
                return;
            }
            this.displaySearchResults(results);
        } catch (error) {
            console.error('❌ Error en búsqueda de municipios:', error);
            this.showSearchError();
        }
    }

    showSearchLoading() {
        this.searchResults.innerHTML = '<div class="search-loading">🔄 Buscando municipios...</div>';
        this.searchResults.style.display = 'block';
    }

    showSearchError() {
        this.searchResults.innerHTML = '<div class="search-no-results">❌ Error en la búsqueda</div>';
        this.searchResults.style.display = 'block';
    }

    displaySearchResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-no-results">No se encontraron municipios</div>';
        } else {
            this.searchResults.innerHTML = results.map(municipality => `
                <div class="search-result-item" data-municipality-id="${municipality.id}">
                    <span class="search-result-name">${municipality.name}</span>
                    <span class="search-result-code">${municipality.id}</span>
                </div>
            `).join('');

            this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const municipalityId = item.dataset.municipalityId;
                    const municipalityName = item.querySelector('.search-result-name').textContent;
                    this.selectMunicipalityFromSearch(municipalityId, municipalityName);
                });
            });
        }

        this.searchResults.style.display = 'block';
    }

    async selectMunicipalityFromSearch(municipalityId, municipalityName) {
        console.log(`📍 Municipio seleccionado desde búsqueda: ${municipalityName} (${municipalityId})`);

        this.searchInput.value = municipalityName;
        this.searchResults.style.display = 'none';

        this.setMunicipalityInfo(municipalityName, municipalityId);
        await this.showMunicipalityEducationAnalysis(municipalityId, municipalityName);

        if (window.layerManager && window.layerManager.selectMunicipalityById) {
            window.layerManager.selectMunicipalityById(municipalityId);
        }

        await this.loadDataForMunicipality(municipalityId);
    }

    async loadDataForMunicipality(municipalityId) {
        try {
            if (window.layerManager && window.layerManager.loadEducationCentersForMunicipality) {
                await window.layerManager.loadEducationCentersForMunicipality(municipalityId);
            }
            if (window.layerManager && window.layerManager.loadHospitalsForMunicipality) {
                await window.layerManager.loadHospitalsForMunicipality(municipalityId);
            }
        } catch (error) {
            console.error('❌ Error cargando datos del municipio:', error);
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.currentSearchTerm = '';
        this.searchResults.style.display = 'none';
        this.clearSearchBtn.style.display = 'none';

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (window.layerManager && window.layerManager.resetPreviousSelection) {
            window.layerManager.resetPreviousSelection();
        }

        this.resetInfoPanel();
        this.setMunicipalityInfo('-', '-');
    }

    clearSearchState() {
        this.currentSearchTerm = '';
        this.searchResults.innerHTML = '';
        this.searchResults.style.display = 'none';

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        console.log('🧹 Estado del buscador limpiado');
    }
}

// Hacer disponible globalmente
window.UIController = UIController;
