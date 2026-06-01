/**
 * Product Retrieval Tool
 *
 * Lightweight wrapper for fetching product data by ID, era, or category.
 * In production this would hit a real product catalog API.
 */

import productsData from '@/agents/recommendation-agent/products.json';

type Product = typeof productsData.catalog[0];

export class ProductRetrieval {
  private catalog: Product[];

  constructor() {
    this.catalog = productsData.catalog;
  }

  getById(id: string): Product | null {
    return this.catalog.find((p) => p.id === id) ?? null;
  }

  getByEra(eraId: string): Product[] {
    return this.catalog.filter((p) => p.eras.includes(eraId));
  }

  getByCategory(category: string): Product[] {
    return this.catalog.filter((p) => p.category === category);
  }

  getHeroProduct(eraId: string): Product | null {
    return this.catalog.find(
      (p) => p.eras.includes(eraId) && p.category === 'laptop'
    ) ?? null;
  }

  search(query: string): Product[] {
    const lower = query.toLowerCase();
    return this.catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }

  formatPrice(cents: number): string {
    return `$${cents.toLocaleString()}`;
  }
}
