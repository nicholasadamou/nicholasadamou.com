import {Metadata} from "next";
import Image from "next/image";

import Link from "@/app/components/Link";
import Section from "@/app/components/Section";
import ConnectLinks from "@/app/components/ConnectLinks";
import Resumes from "@/app/components/Resumes";
import Workplaces from "@/app/about/components/Workplaces";
import Gallery from "@/app/about/components/Gallery";

import ibmLogo from "public/work/ibm-logo.svg";

import arizona from "public/gallery/arizona.jpg";
import lakePlacid from "public/gallery/lake-placid.jpg";
import React from "react";

export const metadata: Metadata = {
	title: "About | Nicholas Adamou",
	description:
		"Software Engineer who is passionate about making the world better through software.",
};

export default function About() {
	return (
		<div className="flex flex-col gap-16 md:gap-24 overflow-hidden md:overflow-visible">
			<div>
				<h1 className="animate-in text-3xl font-bold tracking-tight text-primary">
					About
				</h1>
				<p
					className="animate-in text-secondary"
					style={{"--index": 1} as React.CSSProperties}
				>
					A glimpse into me.
				</p>
			</div>
			<div className="mb-8 md:hidden">
				<div
					className="animate-in"
					style={{"--index": 1} as React.CSSProperties}
				>
					<Image
						src={arizona}
						alt={"arizona"}
						width={324}
						height={139}
						className="pointer-events-none relative inset-0 h-60 -rotate-6 rounded-xl bg-gray-400 object-cover shadow-md"
						priority
					/>
				</div>

				<div
					className="animate-in"
					style={{"--index": 2} as React.CSSProperties}
				>
					<Image
						src={lakePlacid}
						alt={"lake-placid"}
						width={220}
						height={260}
						className="pointer-events-none absolute inset-0 -top-48 left-[45%] w-48 rotate-6 rounded-xl bg-gray-400 object-cover shadow-md md:left-[60%] md:w-56"
						priority

					/>
				</div>
			</div>
			<div className="hidden md:block">
				<Gallery/>
			</div>
			<div
				className="flex animate-in flex-col gap-16 md:gap-24"
				style={{"--index": 3} as React.CSSProperties}
			>
				<Section heading="About" headingAlignment="left">
					<div className="flex flex-col gap-6">
						<p>
							I am a seasoned Senior Software Engineer with a strong academic foundation, holding a{" "}
							<Link
								className="underline"
								href="https://www.parchment.com/u/award/6a9ef8b5cd81ba6e9befa8fd094e5a8e"
							>
								Master of Science in Computer Science
							</Link>{" "}
							<Link
								className="underline"
								href="https://www.gatech.edu/"
							>
								Georgia Institute of Technology
							</Link>{" "}and a{" "}
							<Link
								className="underline"
								href="https://drive.google.com/file/d/1ayD1gYOiD6pEq_mVtC64IUQYU1EB5yK2/view?usp=sharing"
							>
								Batchelor of Arts in Computer Science
							</Link>
							{" "}from{" "}
							<Link
								className="underline"
								href="https://www.cornellcollege.edu/"
							>
								Cornell College
							</Link>. My career is marked by a commitment to leveraging
							software engineering to create meaningful impact. I have a proven track record of delivering
							high-quality software solutions that meet the needs of
							users and stakeholders. I am a strong advocate for user-centered design and am passionate
							about creating well-designed products that are intuitive
							and easy to use.
						</p>
					</div>
				</Section>
				<Section heading="Connect" headingAlignment="left">
					<ul className="animated-list grid flex-grow grid-cols-1 gap-3 md:grid-cols-2">
						{ConnectLinks.map((link) => (
							<li className="col-span-1 transition-opacity" key={link.label}>
								{link.href ? (
									<Link
										href={link.href}
										className="inline-grid w-full rounded-lg bg-secondary p-4 no-underline transition-opacity"
									>
										<div className="flex items-center gap-3">
											<span className="text-xl">{link.icon}</span>
											{link.label}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="ml-auto h-5 w-5 text-secondary"
											>
												<path
													fillRule="evenodd"
													d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									</Link>
								) : (
									link.component && React.isValidElement(link.component)
										? React.cloneElement(link.component as React.ReactElement, { icon: link.icon, label: link.label })
										: link.component
								)}
							</li>
						))}
					</ul>
				</Section>
				<Section heading="Resumes" headingAlignment="left">
					<ul className="animated-list grid flex-grow grid-cols-1 gap-3 md:grid-cols-2">
						{Resumes.map((resume) => (
							<li className="col-span-1 transition-opacity" key={resume.label}>
								<Link
									href={resume.href}
									className="inline-grid w-full rounded-lg bg-secondary p-4 no-underline transition-opacity"
								>
									<div className="flex items-center gap-3">
										<span className="text-xl">{resume.icon}</span>
										{resume.label}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="ml-auto h-5 w-5 text-secondary"
										>
											<path
												fillRule="evenodd"
												d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Section>
				<Section heading="Work" headingAlignment="left">
					<div className="flex w-full flex-col gap-8">
						<p>
							I specialize in Full Stack Development and DevOps. But I am always learning new things.
							Here are some of the places I have worked.
						</p>
						<Workplaces items={workplaces}/>
					</div>
				</Section>
			</div>
		</div>
	);
}

const workplaces = [
	{
		title: "Senior Software Engineer",
		company: "IBM",
		date: "2023 -",
		imageSrc: ibmLogo,
		link: "https://ibm.com",
	},
	{
		title: "Software Engineer II",
		company: "IBM",
		date: "2021 - 2023",
		imageSrc: ibmLogo,
		link: "https://ibm.com",
	},
	{
		title: "Software Engineer I",
		company: "IBM",
		date: "2020 - 2021",
		imageSrc: ibmLogo,
		link: "https://ibm.com",
	},
];
