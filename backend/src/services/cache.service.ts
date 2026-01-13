import NodeCache from 'node-cache';
import { CACHE_CONFIG } from '../config/cache';

/**
 * Serviço de Cache usando node-cache
 * Gerencia cache em memória para otimizar requisições à API Open-Meteo
 */
class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      checkperiod: CACHE_CONFIG.CHECK_PERIOD,
      useClones: false, // Melhor performance, não clona objetos
    });

    console.log('✅ Cache service initialized');
  }

  /**
   * Busca um valor do cache
   * @param key - Chave de identificação
   * @returns Valor armazenado ou undefined se não existir
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    
    if (value) {
      console.log(`📦 Cache HIT: ${key}`);
    } else {
      console.log(`❌ Cache MISS: ${key}`);
    }
    
    return value;
  }

  /**
   * Armazena um valor no cache
   * @param key - Chave de identificação
   * @param value - Valor a ser armazenado
   * @param ttl - Tempo de vida em segundos
   * @returns true se armazenado com sucesso
   */
  set<T>(key: string, value: T, ttl: number): boolean {
    const success = this.cache.set(key, value, ttl);
    
    if (success) {
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    }
    
    return success;
  }

  /**
   * Remove um item do cache
   * @param key - Chave de identificação
   * @returns Número de itens deletados
   */
  delete(key: string): number {
    const deleted = this.cache.del(key);
    console.log(`🗑️  Cache DELETE: ${key} (${deleted} items)`);
    return deleted;
  }

  /**
   * Limpa todo o cache
   */
  flush(): void {
    this.cache.flushAll();
    console.log('🧹 Cache FLUSHED - All items removed');
  }

  /**
   * Retorna estatísticas do cache
   * @returns Objeto com estatísticas (hits, misses, keys, etc)
   */
  getStats() {
    const stats = this.cache.getStats();
    const keys = this.cache.keys();
    
    return {
      hits: stats.hits,
      misses: stats.misses,
      keys: stats.keys,
      ksize: stats.ksize,
      vsize: stats.vsize,
      totalKeys: keys.length,
      cacheKeys: keys,
    };
  }

  /**
   * Verifica se uma chave existe no cache
   * @param key - Chave de identificação
   * @returns true se a chave existe
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Retorna todas as chaves armazenadas
   * @returns Array com todas as chaves
   */
  keys(): string[] {
    return this.cache.keys();
  }

  /**
   * Retorna o TTL restante de uma chave
   * @param key - Chave de identificação
   * @returns TTL em segundos ou undefined se não existir
   */
  getTtl(key: string): number | undefined {
    return this.cache.getTtl(key);
  }
}

// Exporta instância única (Singleton)
export const cacheService = new CacheService();
