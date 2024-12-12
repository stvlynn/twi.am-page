import { CardContent } from "./card";
import { ProductFeature } from "./ProductFeature";

interface ProductContentProps {
  description: string;
  features: string[];
}

export function ProductContent({ description, features }: ProductContentProps) {
  return (
    <CardContent>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <ProductFeature key={i} feature={feature} />
        ))}
      </ul>
    </CardContent>
  );
}