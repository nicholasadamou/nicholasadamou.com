import { useEffect, useState } from 'react';

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	currency: string;
	short_url: string;
	thumbnail_url: string;
	formatted_price: string;
}

const useGumroadProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/gumroad/products');

				if (!response.ok) {
					throw new Error('Failed to fetch products');
				}

				const data = await response.json();
				setProducts(data.products || []);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	return { products, loading, error };
};

export default useGumroadProducts;
