import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuCheck, LuShieldCheck, LuTruck } from "react-icons/lu";

import { formatProductPrice, getProductByUid, PRODUCTS } from "@/products";
import { ProductCheckoutButton } from "./ProductCheckoutButton";

type ProductPageProps = {
  params: Promise<{ uid: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ uid: product.uid }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { uid } = await params;
  const product = getProductByUid(uid);

  if (!product) {
    return {
      title: "Product Not Found | KeyRush 3D",
    };
  }

  return {
    title: `${product.name} | KeyRush 3D`,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { uid } = await params;
  const product = getProductByUid(uid);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(185,28,28,0.22),transparent_34%),linear-gradient(180deg,#050505,#09090b_45%,#050505)] px-4 pt-28 pb-20 text-zinc-100 md:px-8 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium tracking-[0.22em] text-zinc-400 uppercase transition hover:text-red-300"
        >
          <LuArrowLeft className="size-4" />
          Back Home
        </Link>

        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.16),transparent_30%)]" />
            <Image
              src={product.image}
              alt={product.name}
              width={1200}
              height={900}
              priority
              className="relative aspect-[4/3] h-auto w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-4 text-xs tracking-[0.38em] text-red-300/80 uppercase">
              KeyRush Store
            </p>
            <h1 className="font-bold-slanted text-5xl leading-none tracking-tight uppercase md:text-7xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-zinc-300">
              {product.tagline}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center">
              <ProductCheckoutButton uid={product.uid} />
              <div>
                <p className="text-sm tracking-[0.28em] text-zinc-500 uppercase">
                  Price
                </p>
                <p className="font-bold-slanted text-4xl text-white">
                  {formatProductPrice(product)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                <LuTruck className="size-5 text-red-300" />
                Ships in 2-3 business days
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                <LuShieldCheck className="size-5 text-red-300" />
                Secure Stripe checkout
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-bold-slanted text-4xl uppercase md:text-5xl">
              Built For Daily Typing
            </h2>
            <ul className="mt-6 space-y-4">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 border-b border-white/10 pb-4 text-zinc-300"
                >
                  <LuCheck className="mt-1 size-5 shrink-0 text-red-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl border border-white/10 bg-zinc-950/70 p-5"
              >
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">
                  {spec.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-zinc-100">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {product.gallery.map((image, index) => (
            <div
              key={image}
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70"
            >
              <Image
                src={image}
                alt={`${product.name} detail ${index + 1}`}
                width={720}
                height={540}
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
