export interface VscoImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  createdAt?: string;
  vsco_url?: string;
  upload_date?: string;
}

export interface VscoProfile {
  username: string;
  displayName?: string;
  bio?: string;
  profileImage?: string;
  display_name?: string;
  profile_url?: string;
  total_images_found?: number;
}

export interface VscoApiResponse {
  images: VscoImage[];
  hasMore: boolean;
  totalCount: number;
  source?: string;
  error?: string;
  generated_at?: string;
  profile?: VscoProfile;
}

export interface VscoError {
  message: string;
  status: number;
}
