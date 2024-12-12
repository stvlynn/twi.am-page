import { FooterLink as FooterLinkType } from "@/lib/config";
import { FooterLink } from "@/components/ui/FooterLink";

export function Footer({ links }: { links: FooterLinkType[] }) {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {links.map((link, index) => (
            <FooterLink key={index} link={link} />
          ))}
        </div>
      </div>
    </footer>
  );
}