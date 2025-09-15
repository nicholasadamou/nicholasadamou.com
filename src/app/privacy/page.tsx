"use client";

import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="animate-in text-3xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p
          className="animate-in text-secondary mt-5"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Welcome to nicholasadamou.com. I respect your privacy and are
          committed to protecting your personal information. This policy
          outlines my practices concerning data collection, use, and security.
        </p>
      </div>
      <div className="mx-auto">
        <div
          className="animate-in relative isolate mx-auto w-full overflow-hidden rounded-3xl pb-16 pt-12"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <section className="[&amp;_p]:text-gray-500">
            <h2 className="mt-10 text-lg font-semibold">
              Information I collect
            </h2>
            <p className="mt-2">
              I collect information directly from you when you use my services,
              and automatically as you navigate through the site. This may
              include personal details, contact information, and data related to
              your usage of my website.
            </p>

            <h2 className="mt-10 text-lg font-semibold">
              How I use your information
            </h2>
            <p className="mt-2">
              I use your information to provide, improve, and personalize my
              services, communicate with you, understand user behavior, and for
              security purposes.
            </p>

            <h2 className="mt-10 text-lg font-semibold">Data sharing</h2>
            <p className="mt-2">
              I do not share your personal information with third parties,
              except as necessary to provide my services, comply with the law,
              or protect my rights.
            </p>

            <h2 className="mt-10 text-lg font-semibold">Your rights</h2>
            <p className="mt-2">
              You have the right to access, correct, or delete your personal
              information. Please contact me to exercise these rights.
            </p>

            <h2 className="mt-10 text-lg font-semibold">Data security</h2>
            <p className="mt-2">
              I strive to protect your personal information but cannot guarantee
              its absolute security. I employ measures designed to protect your
              data from unauthorized access, disclosure, or destruction.
            </p>

            <h2 className="mt-10 text-lg font-semibold">
              Changes to this policy
            </h2>
            <p className="mt-2">
              I may update this policy to reflect changes to my information
              practices. If I make significant changes, I will notify you by
              email or through a notice on my website.
            </p>

            <h2 className="mt-10 text-lg font-semibold">Contact me</h2>
            <p className="mt-2">
              If you have any questions or suggestions about my privacy policy,
              do not hesitate to{" "}
              <a className="text-react-link font-medium" href="/contact">
                contact me.
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
