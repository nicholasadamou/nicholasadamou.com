import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  formatted_price: string;
  short_url: string;
  thumbnail_url: string;
}

export default function useGumroadProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gumroad/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { products, loading, error };
}
