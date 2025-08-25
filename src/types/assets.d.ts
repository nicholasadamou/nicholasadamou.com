// Type declarations for static assets
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.ico" {
  const content: string;
  export default content;
}

declare module "*.bmp" {
  const content: string;
  export default content;
}

// For imports from public directory
declare module "public/*" {
  const content: string;
  export default content;
}
