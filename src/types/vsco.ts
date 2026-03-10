export interface VscoImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  vsco_url?: string;
  upload_date?: string;
}

export interface VscoApiResponse {
  images: VscoImage[];
  hasMore: boolean;
  totalCount: number;
  source?: string;
  error?: string;
  generated_at?: string;
}

export interface VscoError {
  message: string;
  status: number;
}
