"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				toast.success("Message sent successfully!");
				// Trigger confetti effect on success
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.5 },
				});

				reset();
			} else {
				toast.error("Failed to send message.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="px-4 mx-auto max-w-[700px]">
			<Toaster />
			<div className="mx-auto">
				<div
					className="relative isolate mx-auto w-full animate-in overflow-hidden pb-16 pt-8"
					style={{ "--index": 2 } as React.CSSProperties}
				>
					<div>
						<h1 className="animate-in text-3xl font-bold tracking-tight">
							Let’s talk about your project
						</h1>
						<p
							className="mt-5 animate-in text-secondary"
							style={{ "--index": 1 } as React.CSSProperties}
						>
							I help companies and individuals build out their digital presence.
						</p>
					</div>
					<div className="relative">
						<div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
							<form className="lg:flex-auto" onSubmit={handleSubmit(onSubmit)}>
								<div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-semibold leading-6"
										>
											Name
										</label>
										<div className="mt-2.5">
											<input
												id="name"
												type="text"
												placeholder="Name"
												{...register("name")}
												className="focus:ring-react-link block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700 sm:text-sm sm:leading-6"
											/>
											{errors.name && (
												<p className="text-red-500 text-sm mt-1">
													{errors.name.message}
												</p>
											)}
										</div>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-semibold leading-6"
										>
											Email
										</label>
										<div className="mt-2.5">
											<input
												type="email"
												id="email"
												placeholder="Email"
												{...register("email")}
												className="focus:ring-react-link block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700 sm:text-sm sm:leading-6"
											/>
											{errors.email && (
												<p className="text-red-500 text-sm mt-1">
													{errors.email.message}
												</p>
											)}
										</div>
									</div>
									<div className="sm:col-span-2">
										<label
											htmlFor="message"
											className="block text-sm font-semibold leading-6"
										>
											Message
										</label>
										<div className="mt-2.5">
											<textarea
												id="message"
												placeholder="Message"
												{...register("message")}
												className="focus:ring-react-link block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset dark:ring-zinc-700 sm:text-sm sm:leading-6"
											></textarea>
											{errors.message && (
												<p className="text-red-500 text-sm mt-1">
													{errors.message.message}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className="mt-10">
									<button
										type="submit"
										disabled={loading}
										className="focus-visible:outline-react-link block w-full rounded-md bg-[#111] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
									>
										{loading ? "Sending..." : "Let’s talk"}
									</button>
								</div>
								<p className="mt-4 text-sm leading-6 text-zinc-500">
									By submitting this form, I agree to the{" "}
									<a className="font-medium underline" href="/privacy">
										privacy&nbsp;policy.
									</a>
								</p>
							</form>
						</div>
						<canvas className="pointer-events-none absolute inset-0 mx-auto w-full"></canvas>
					</div>
				</div>
			</div>
		</div>
	);
}
