import React from "react";

export interface FeatureItem {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

export interface ComponentItem {
  icon: React.JSX.Element;
  title: string;
  description: string;
}

export interface FeaturedItem {
  name: string;
  description: string;
  features: FeatureItem[];
  components: ComponentItem[];
  url: string;
}

export interface FeaturedSectionProps {
  items: FeaturedItem[];
  title: React.ReactNode;
  description: string;
  buttonText: (itemName: string) => string;
  componentsTitle?: string;
  autoRotateInterval?: number;
}
