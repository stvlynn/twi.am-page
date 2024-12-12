"use client";

import { Card } from "@/components/ui/card";
import { Product } from "@/lib/config";
import { CardLink } from "@/components/ui/CardLink";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { ProductContent } from "@/components/ui/ProductContent";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  if (!product.link) return null;

  return (
    <CardLink href={product.link} index={index}>
      <Card className="h-full bg-white/95 hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <ProductHeader
          name={product.name}
          domain={product.domain}
          icon={product.icon}
        />
        <ProductContent
          description={product.description}
          features={product.features}
        />
      </Card>
    </CardLink>
  );
}