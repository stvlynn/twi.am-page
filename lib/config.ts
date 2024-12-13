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
  type: 'link' | 'twitter' | 'coffee' | 'kimi' | 'dify' | 'license';
  image?: string;
}

export interface OpenGraph {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
}

export interface Config {
  header: {
    subtitle: string;
  };
  og: OpenGraph;
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