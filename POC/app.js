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
                    color: '#1e40af',        // Azul más oscuro para mejor visibilidad
                    weight: 2,
                    opacity: 0.9,           // Mayor opacidad
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2        // Mayor relleno para mejor visibilidad
                },
                onEachFeature: (feature, layer) => {
                    const props = feature.properties;
                    layer.bindPopup(`
                        <div class="popup-title">${props.DESCR || props.ETIQUETA || 'Municipio'}</div>
                        <div class="popup-info">
                            <strong>Código:</strong> ${props.CMUN || props.CMUN4 || 'N/A'}<br>
                            <strong>Etiqueta:</strong> ${props.ETIQUETA || 'N/A'}
                        </div>
                    `);

                    // Efectos hover más visibles
                    layer.on('mouseover', () => {
                        layer.setStyle({
                            fillOpacity: 0.5,
                            weight: 3,
                            color: '#dc2626'    // Rojo al hacer hover
                        });
                    });

                    layer.on('mouseout', () => {
                        layer.setStyle({
                            fillOpacity: 0.2,
                            weight: 2,
                            color: '#1e40af'    // Volver al azul original
                        });
                    });
                }
            });

            this.layerGroups.municipalityBorders.addLayer(this.municipalityGeoJSON);

            // Asegurar que siempre se muestre la capa de municipios
            this.map.addLayer(this.layerGroups.municipalityBorders);

            // Ajustar vista para mostrar todos los municipios
            this.map.fitBounds(this.municipalityGeoJSON.getBounds(), {
                padding: [20, 20]
            });

            console.log('✅ Delimitaciones cargadas y añadidas al mapa');

        } catch (error) {
            console.error('❌ Error cargando delimitaciones:', error);

            // Fallback: mostrar notificación de error
            const errorNotification = document.createElement('div');
            errorNotification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #dc2626;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    z-index: 10000;
                ">
                    ❌ Error cargando delimitaciones de municipios
                </div>
            `;
            document.body.appendChild(errorNotification);
            setTimeout(() => errorNotification.remove(), 5000);
        }
    }

    loadSampleData() {
        // Datos de ejemplo de hospitales en Madrid
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

        // Datos de ejemplo de centros educativos
        const sampleEducation = [
            { name: "IES San Patricio", lat: 40.4789, lng: -3.6866, type: "Instituto", students: 850 },
            { name: "CEIP Ramón y Cajal", lat: 40.4199, lng: -3.6945, type: "Primaria", students: 420 },
            { name: "Universidad Complutense", lat: 40.4378, lng: -3.7283, type: "Universidad", students: 85000 },
            { name: "Universidad Politécnica", lat: 40.3971, lng: -3.7280, type: "Universidad", students: 35000 },
            { name: "IES Isaac Newton", lat: 40.5012, lng: -3.7191, type: "Instituto", students: 720 },
            { name: "CEIP Miguel de Cervantes", lat: 40.3736, lng: -3.7082, type: "Primaria", students: 380 }
        ];

        // Municipios principales
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
        document.getElementById('hospital-count').textContent = this.markers.hospitals.length;
        document.getElementById('education-count').textContent = this.markers.education.length;
        document.getElementById('municipality-count').textContent = '179';
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
    const madridMap = new MadridMap();

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
                🎉 ¡Mapa de Madrid cargado! Explora las diferentes capas de datos.
            </div>
        `;

        document.body.appendChild(notification);

        // Remover notificación después de 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);

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
