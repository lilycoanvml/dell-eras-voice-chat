'use client';

import { useEffect, useState } from 'react';
import type { EraRevealPayload } from '@/app/frontend/hooks/useChat';
import ProductCard from './ProductCard';

interface EraRevealProps {
  data: EraRevealPayload;
}

export default function EraReveal({ data }: EraRevealProps) {
  const [phase, setPhase] = useState<'hidden' | 'era' | 'products'>('hidden');
  const { era, products, closingMessage } = data;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('era'), 300);
    const t2 = setTimeout(() => setPhase('products'), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Era card */}
      <div
        className="relative overflow-hidden rounded-3xl border transition-all duration-1000"
        style={{
          borderColor: `${era.primaryColor}30`,
          background: `linear-gradient(135deg, ${era.primaryColor}12 0%, ${era.secondaryColor}08 60%, transparent 100%)`,
          opacity: phase !== 'hidden' ? 1 : 0,
          transform: phase !== 'hidden' ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          filter: phase !== 'hidden' ? 'blur(0)' : 'blur(8px)',
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${era.primaryColor}, transparent 70%)` }}
        />

        <div className="relative p-8 md:p-10">
          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                background: `${era.primaryColor}20`,
                color: era.primaryColor,
                border: `1px solid ${era.primaryColor}30`,
              }}
            >
              Your Era
            </span>
          </div>

          {/* Era name */}
          <h2
            className="text-4xl md:text-5xl font-light mb-3 leading-tight"
            style={{
              background: `linear-gradient(135deg, ${era.primaryColor}, ${era.secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {era.name}
          </h2>

          {/* Tagline */}
          <p className="text-white/80 text-lg md:text-xl font-light italic mb-5">
            &ldquo;{era.tagline}&rdquo;
          </p>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed max-w-lg">
            {era.description}
          </p>

          {/* Divider */}
          <div
            className="mt-6 h-px w-16"
            style={{ background: `linear-gradient(to right, ${era.primaryColor}60, transparent)` }}
          />
        </div>
      </div>

      {/* Products section */}
      {phase === 'products' && (
        <div
          className="space-y-3 transition-all duration-700"
          style={{ animation: 'fadeUp 0.7s ease-out forwards' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, ${era.primaryColor}30, transparent)` }}
            />
            <p className="text-white/40 text-xs tracking-widest uppercase shrink-0">
              {closingMessage}
            </p>
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, ${era.primaryColor}30, transparent)` }}
            />
          </div>

          <div className="grid gap-3">
            {products.map((product, i) => (
              <ProductCard
                key={product.name}
                product={product}
                accentColor={i % 2 === 0 ? era.primaryColor : era.secondaryColor}
                delay={i * 150}
              />
            ))}
          </div>

          {/* Dell attribution */}
          <div className="text-center pt-2">
            <p className="text-white/20 text-xs">
              Prices reflect Black Friday savings. Available at{' '}
              <span className="text-[#007DB8]/60">dell.com</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
