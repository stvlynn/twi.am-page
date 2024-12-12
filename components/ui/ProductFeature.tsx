interface ProductFeatureProps {
  feature: string;
}

export function ProductFeature({ feature }: ProductFeatureProps) {
  return (
    <li className="flex items-center space-x-3">
      <span className="w-1.5 h-1.5 bg-twitter-blue/40 rounded-full shrink-0" />
      <span className="text-sm leading-relaxed text-gray-500 font-normal tracking-wide">
        {feature}
      </span>
    </li>
  );
}