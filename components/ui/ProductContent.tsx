import { CardContent } from "./card";
import { ProductFeature } from "./ProductFeature";

interface ProductContentProps {
  description: string;
  features: string[];
}

export function ProductContent({ description, features }: ProductContentProps) {
  return (
    <CardContent className="flex flex-col gap-6">
      <p className="text-base leading-relaxed tracking-wide text-gray-600 font-light">
        {description}
      </p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <ProductFeature key={i} feature={feature} />
        ))}
      </ul>
    </CardContent>
  );
}