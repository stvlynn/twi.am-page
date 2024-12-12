import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

export interface Product {
  name: string;
  domain: string;
  description: string;
  icon?: string;
  link?: string;
  features: string[];
}

export interface FooterLink {
  text: string;
  url: string;
  type: 'link' | 'twitter' | 'coffee' | 'kimi';
  image?: string;
}

export interface Config {
  header: {
    title: string;
    subtitle: string;
    description: string;
  };
  products: Product[];
  footer: {
    links: FooterLink[];
  };
}

export function getConfig(): Config {
  const configPath = join(process.cwd(), 'config', 'content.yaml');
  const fileContents = readFileSync(configPath, 'utf8');
  return yaml.load(fileContents) as Config;
}