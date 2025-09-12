/**
 * DataLoader - Maneja la carga de datos desde diferentes fuentes
 */
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
        // Configuración de la API migrada desde app.js
        this.apiBaseUrl = 'http://127.0.0.1:8000';
        this.loadingEducationCenters = false;
    }

    /**
     * Carga datos desde una URL con caché
     */
    async loadData(url, cacheKey = null) {
        const key = cacheKey || url;

        // Verificar caché
        if (this.cache.has(key)) {
            console.log(`📦 Usando datos en caché para: ${key}`);
            return this.cache.get(key);
        }

        // Verificar si ya se está cargando
        if (this.loadingStates.has(key)) {
            console.log(`⏳ Esperando carga en progreso: ${key}`);
            return this.loadingStates.get(key);
        }

        // Iniciar carga
        const loadPromise = this.fetchData(url);
        this.loadingStates.set(key, loadPromise);

        try {
            const data = await loadPromise;

            // Guardar en caché
            this.cache.set(key, data);
            this.loadingStates.delete(key);

            console.log(`✅ Datos cargados exitosamente: ${key}`);
            return data;

        } catch (error) {
            this.loadingStates.delete(key);
            console.error(`❌ Error cargando datos: ${key}`, error);
            throw error;
        }
    }

    /**
     * Realiza la petición HTTP
     */
    async fetchData(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    }

    /**
     * Carga datos de municipios
     */
    async loadMunicipalitiesData() {
        return this.loadData('madrid_municipalities.geojson', 'municipalities');
    }

    /**
     * Carga datos de hospitales (placeholder)
     */
    async loadHospitalsData() {
        console.log('🏥 Cargando datos de hospitales...');
        // Placeholder - aquí cargarías datos reales de hospitales
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    type: 'hospitals',
                    data: [],
                    count: 0
                });
            }, 1000);
        });
    }

    /**
     * Carga datos de centros educativos (placeholder)
     */
    async loadEducationData() {
        console.log('📚 Cargando datos de centros educativos...');
        // Placeholder - aquí cargarías datos reales de centros educativos
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    type: 'education',
                    data: [],
                    count: 0
                });
            }, 1000);
        });
    }

    /**
     * Obtiene estadísticas generales
     */
    async getStats() {
        try {
            const municipalitiesData = await this.loadMunicipalitiesData();
            const hospitalsData = await this.loadHospitalsData();
            const educationData = await this.loadEducationData();

            return {
                municipalities: municipalitiesData.features ? municipalitiesData.features.length : 179,
                hospitals: hospitalsData.count || 0,
                education: educationData.count || 0
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return {
                municipalities: 179,
                hospitals: 0,
                education: 0
            };
        }
    }

    /**
     * Limpia el caché
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Caché limpiado');
    }

    /**
     * Obtiene información del caché
     */
    getCacheInfo() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            loading: Array.from(this.loadingStates.keys())
        };
    }

    /**
     * Pre-carga datos importantes
     */
    async preloadData() {
        console.log('🚀 Pre-cargando datos importantes...');

        try {
            await this.loadMunicipalitiesData();
            console.log('✅ Datos de municipios pre-cargados');
        } catch (error) {
            console.error('❌ Error pre-cargando datos:', error);
        }
    }

    /**
     * Obtiene IDs de centros educativos por municipio (solo ids únicos)
     */
    async getEducationCenterIdsByMunicipality(municipalityId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/education_municipality/search?id_municipality=${municipalityId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.items) return [];
            // Filtrar para que solo se retornen items con id_education único
            const seen = new Set();
            const uniqueItems = [];
            for (const item of data.items) {
                if (item.id_education && !seen.has(item.id_education)) {
                    seen.add(item.id_education);
                    uniqueItems.push(item);
                }
            }
            return uniqueItems;
        } catch (error) {
            console.error(`❌ Error obteniendo IDs de centros educativos para municipio ${municipalityId}:`, error);
            return [];
        }
    }

    /**
     * Obtiene datos de un centro educativo por ID (migrado desde app.js)
     */
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

    /**
     * Obtiene análisis de un centro educativo (migrado desde app.js)
     */
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

    /**
     * Obtiene métricas de ciclos educativos (migrado desde app.js)
     */
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

    /**
     * Carga centros educativos completos para un municipio (migrado desde app.js)
     */
    async loadEducationCentersForMunicipality(municipalityId) {
        if (this.loadingEducationCenters) {
            console.log('⏳ Ya hay una carga de centros educativos en progreso...');
            return [];
        }

        this.loadingEducationCenters = true;

        try {
            console.log(`📚 Iniciando carga de centros educativos para municipio: ${municipalityId}`);

            const educationIds = await this.getEducationCenterIdsByMunicipality(municipalityId);
            console.log(`📊 Encontrados ${educationIds.length} centros educativos`);

            if (educationIds.length === 0) {
                return [];
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
            return centersWithCompleteData;

        } catch (error) {
            console.error('❌ Error general cargando centros educativos:', error);
            return [];
        } finally {
            this.loadingEducationCenters = false;
        }
    }
}

// Hacer disponible globalmente
window.DataLoader = DataLoader;
