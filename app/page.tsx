import { getConfig } from "@/lib/config";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/ui/HeroSection";

export default function Home() {
  const config = getConfig();

  return (
    <main className="min-h-screen">
      <HeroSection
        title="Twi.am"
        subtitle={config.header.subtitle}
        description={config.og.description}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.products.map((product, index) => (
              <ProductCard key={product.domain} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer links={config.footer.links} />
    </main>
  );
}