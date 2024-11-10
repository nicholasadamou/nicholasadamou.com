"use client";

import Image from "next/image";
import Link from "@/app/components/Link";
import Halo from "@/app/components/Halo";
import useGumroadProducts from "@/app/hooks/useGumroadProducts";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Product {
	id: string;
	name: string;
	description: string;
	formatted_price: string;
	short_url: string;
	thumbnail_url: string;
}

export default function ProductList() {
	const { products, loading, error } = useGumroadProducts();

	if (loading) {
		return (
			<ul className="animated-list flex snap-x snap-mandatory grid-cols-2 flex-nowrap gap-5 overflow-x-scroll md:grid md:overflow-auto">
				{Array.from({ length: 2 }).map((_, index) => (
					<li
						key={index}
						className="col-span-1 min-w-72 snap-start transition-opacity"
					>
						<div className="space-y-4 no-underline">
							<div className="aspect-video overflow-hidden rounded-md bg-secondary">
								<Skeleton className="h-full w-full" />
							</div>
							<div className="flex flex-row justify-between items-center gap-1">
								<Skeleton className="h-6 w-1/2" />
								<Skeleton className="h-6 w-12" />
							</div>
						</div>
					</li>
				))}
			</ul>
		);
	}

	if (error) return <p>Error: {error}</p>;

	return (
		<ul className="animated-list flex snap-x snap-mandatory grid-cols-2 flex-nowrap gap-5 overflow-x-scroll md:grid md:overflow-auto">
			{products.slice(0, 3).map((product: Product) => (
				<li
					key={product.id}
					className="col-span-1 min-w-72 snap-start transition-opacity"
				>
					<Link href={product.short_url} className="space-y-4 no-underline">
						<div className="aspect-video overflow-hidden rounded-md bg-secondary">
							<Halo strength={10}>
								<Image
									src={product.thumbnail_url}
									alt={product.name}
									fill
									priority={true}
									sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
									className="h-full w-full object-cover object-left-top"
								/>
							</Halo>
						</div>
						<div className="flex flex-row justify-between items-center gap-1">
							<p className="font-medium leading-tight">{product.name}</p>
							<p className="text-primary font-semibold no-underline">{product.formatted_price}</p>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
