import Image from "next/image";
import { FooterLink as FooterLinkType } from "@/lib/config";

export function FooterLink({ link }: { link: FooterLinkType }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center hover:opacity-80 transition-opacity"
    >
      {link.type === "kimi" || link.type === "dify" ? (
        <div className="bg-gray-100 rounded-md p-0.5">
          <Image
            src={link.image!}
            alt={link.text}
            width={link.type === "dify" ? 48 : 56}
            height={14}
            className="h-[14px] w-auto"
          />
        </div>
      ) : link.image ? (
        <Image
          src={link.image}
          alt={link.text}
          width={link.type === "coffee" ? 80 : 120}
          height={20}
        />
      ) : (
        <span>{link.text}</span>
      )}
    </a>
  );
}