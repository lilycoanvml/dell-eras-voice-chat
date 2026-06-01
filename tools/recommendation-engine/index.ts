/**
 * Recommendation Engine
 *
 * Scores and ranks Dell products against a user's era assignment and
 * conversation context. Returns the top N products for the reveal.
 */

import productsData from '@/agents/recommendation-agent/products.json';

interface Product {
  id: string;
  name: string;
  category: string;
  eras: string[];
  price: number;
  originalPrice: number;
  savings: number;
  badge: string;
  taglines: Record<string, string>;
  description: string;
  specs: string[];
}

interface RecommendationContext {
  eraId: string;
  userAnswers: string[];
  preferPortability?: boolean;
  preferHighPerformance?: boolean;
  mentionedBudget?: boolean;
}

interface RecommendationResult {
  product: Product;
  score: number;
  tagline: string;
  rationale: string;
}

export class RecommendationEngine {
  private products: Product[];

  constructor() {
    this.products = productsData.catalog as unknown as Product[];
  }

  recommend(context: RecommendationContext, count = 3): RecommendationResult[] {
    const { eraId, userAnswers } = context;
    const fullText = userAnswers.join(' ').toLowerCase();

    const eraProducts = this.products.filter((p) => p.eras.includes(eraId));

    const scored = eraProducts.map((product) => {
      let score = 0;

      // Category preference scoring
      if (product.category === 'laptop') score += 10;
      if (product.category === 'monitor') score += 7;

      // Portability signal
      if (fullText.match(/travel|portable|light|thin|small|anywhere|nomad/)) {
        if (product.category === 'laptop' && product.name.includes('XPS 13')) score += 5;
      }

      // Performance signal
      if (fullText.match(/fast|performance|speed|powerful|render|compile/)) {
        if (product.price > 1500) score += 4;
      }

      // Visual / creative signal
      if (fullText.match(/visual|color|design|creative|photo|video|film/)) {
        if (product.name.includes('Canvas') || product.name.includes('OLED')) score += 4;
      }

      // Savings as secondary sort for price-conscious users
      if (context.mentionedBudget) {
        score += product.savings / 100;
      }

      return {
        product,
        score,
        tagline: product.taglines[eraId] || product.description,
        rationale: `Selected for ${eraId} era — ${product.category} category`,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
