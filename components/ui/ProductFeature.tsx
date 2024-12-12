interface ProductFeatureProps {
  feature: string;
}

export function ProductFeature({ feature }: ProductFeatureProps) {
  return (
    <li className="flex items-center space-x-2">
      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
      <span>{feature}</span>
    </li>
  );
}