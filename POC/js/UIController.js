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
}

// Hacer disponible globalmente
window.UIController = UIController;
