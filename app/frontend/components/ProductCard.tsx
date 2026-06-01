'use client';

import { useEffect, useState } from 'react';
import type { EraProduct } from '@/app/frontend/hooks/useChat';

interface ProductCardProps {
  product: EraProduct;
  accentColor: string;
  delay?: number;
}

export default function ProductCard({ product, accentColor, delay = 0 }: ProductCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="product-card relative overflow-hidden rounded-2xl border bg-[#12121A]/80 backdrop-blur-sm cursor-default"
      style={{
        borderColor: `${accentColor}20`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease, transform 0.5s ease`,
      }}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}40, transparent)` }}
      />

      <div className="p-5 flex items-start gap-4">
        {/* Category icon */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
        >
          {getCategoryIcon(product.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white/90 font-medium text-sm leading-snug">{product.name}</h3>
            <span
              className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              {product.badge}
            </span>
          </div>

          <p className="text-white/40 text-xs leading-relaxed mb-2 italic">&ldquo;{product.tagline}&rdquo;</p>
          <p className="text-white/30 text-xs leading-relaxed mb-3">{product.description}</p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-white font-semibold text-base">{product.price}</span>
            <span className="text-white/30 text-xs line-through">{product.originalPrice}</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20"
            >
              Save {product.savings}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  switch (category?.toLowerCase()) {
    case 'laptop': return '💻';
    case 'monitor': return '🖥️';
    case 'desktop': return '🖥️';
    case 'accessory': return '🔌';
    case 'headset': return '🎧';
    case 'mouse': return '🖱️';
    case 'keyboard': return '⌨️';
    case 'dock': return '🔗';
    default: return '✦';
  }
}
