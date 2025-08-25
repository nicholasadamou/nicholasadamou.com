// Type declarations for static assets
// Type for Next.js optimized images
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: StaticImageData;
  export default content;
}

declare module "*.jpg" {
  const content: StaticImageData;
  export default content;
}

declare module "*.jpeg" {
  const content: StaticImageData;
  export default content;
}

declare module "*.gif" {
  const content: StaticImageData;
  export default content;
}

declare module "*.webp" {
  const content: StaticImageData;
  export default content;
}

declare module "*.ico" {
  const content: string;
  export default content;
}

declare module "*.bmp" {
  const content: StaticImageData;
  export default content;
}

// For imports from public directory
declare module "public/*" {
  const content: string;
  export default content;
}
