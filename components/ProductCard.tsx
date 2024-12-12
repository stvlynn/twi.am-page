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
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
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