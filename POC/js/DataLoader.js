/**
 * DataLoader - Maneja la carga de datos desde diferentes fuentes
 */
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
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
}

// Hacer disponible globalmente
window.DataLoader = DataLoader;
