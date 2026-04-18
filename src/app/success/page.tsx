import type { Metadata } from "next";
import Link from "next/link";
import {
  LuCheck,
  LuChevronRight,
  LuCircleHelp,
  LuMail,
  LuPackageCheck,
  LuPackageOpen,
} from "react-icons/lu";
import Stripe from "stripe";

import { Logo } from "@/components/Logo";
import { FadeIn } from "@/components/FadeIn";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const metadata: Metadata = {
  title: "Order Confirmation | Nimbus Keyboards",
  description:
    "Thank you for your purchase! Your order has been confirmed and is being processed.",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  // Handle missing session ID
  if (!sessionId) {
    return (
      <div className="relative mt-20 min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-950/80 ring-1 ring-red-500/30">
              <LuCircleHelp className="h-10 w-10 text-red-300" />
            </div>
            <h1 className="font-bold-slanted mt-8 text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
              <span className="block tracking-tight uppercase">Something</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text tracking-tight text-transparent uppercase">
                Went Wrong
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              No session ID found
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-gradient-to-r from-red-700 to-red-900 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-950/40"
            >
              Return Home
              <LuChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch session details from Stripe
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const orderDetails = {
      sessionId: session.id,
      customerEmail: session.customer_details?.email || "",
      amount: session.amount_total
        ? (session.amount_total / 100).toFixed(2)
        : "",
    };

    return (
      <div className="relative mt-20 min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950">
        <FadeIn
          targetChildren
          className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
        >
          {/* Success Icon and Header */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-red-900 ring-1 ring-red-400/30">
              <LuCheck className="h-10 w-10 text-white" />
            </div>

            <h1 className="font-bold-slanted mt-8 text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
              <span className="block tracking-tight uppercase">Payment</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-700 bg-clip-text tracking-tight text-transparent uppercase">
                Successful
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Thank you for your purchase! Your order has been confirmed and is
              being processed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-zinc-950/90 p-8 shadow-lg shadow-black/30 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-100">
                Order Confirmation
              </h2>
              <Logo className="h-8 w-auto" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 py-3">
                <span className="text-zinc-400">Order ID:</span>
                <span className="font-mono text-sm text-zinc-100">
                  {orderDetails.sessionId}
                </span>
              </div>

              {orderDetails.customerEmail && (
                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-zinc-100">
                    {orderDetails.customerEmail}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-white/10 py-3">
                <span className="text-zinc-400">Product:</span>
                <span className="text-zinc-100">Vapor75 Keyboard</span>
              </div>

              {orderDetails.amount && (
                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="font-semibold text-zinc-100">
                    ${orderDetails.amount}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <div className="mr-1.5 h-2 w-2 rounded-full bg-green-400" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mt-12 text-center">
            <h3 className="mb-6 text-2xl font-bold text-zinc-100">
              What&apos;s Next?
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-zinc-950/90 p-6 shadow-sm shadow-black/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950">
                  <LuMail className="h-6 w-6 text-red-400" />
                </div>
                <h4 className="mb-2 font-semibold text-zinc-100">
                  Order Confirmation
                </h4>
                <p className="text-sm text-zinc-400">
                  You&apos;ll receive an email confirmation with tracking
                  details shortly.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-zinc-950/90 p-6 shadow-sm shadow-black/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950">
                  <LuPackageOpen className="h-6 w-6 text-red-400" />
                </div>
                <h4 className="mb-2 font-semibold text-zinc-100">Processing</h4>
                <p className="text-sm text-zinc-400">
                  We&apos;re preparing your keyboard and will ship it within 2-3
                  business days.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-zinc-950/90 p-6 shadow-sm shadow-black/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950">
                  <LuPackageCheck className="h-6 w-6 text-red-400" />
                </div>
                <h4 className="mb-2 font-semibold text-zinc-100">Delivery</h4>
                <p className="text-sm text-zinc-400">
                  Your keyboard will arrive in 5-7 business days with tracking
                  information.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group relative flex transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-red-400/20 bg-gradient-to-r from-red-700 to-red-900 px-8 py-3 font-semibold text-white transition-all duration-300 will-change-transform hover:shadow-lg hover:shadow-red-950/40 focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
              <span className="font-bold-slanted relative z-10 flex items-center gap-2 text-lg uppercase">
                Continue Shopping
                <span className="inline-block text-lg transition-transform duration-200 group-hover:translate-x-0.5">
                  <LuChevronRight className="h-5 w-5" />
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="group flex items-center justify-center rounded-xl border border-white/10 bg-zinc-950/90 px-8 py-3 font-semibold text-zinc-200 transition-all duration-300 hover:border-red-700 hover:bg-zinc-900 focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
              <span className="flex items-center gap-2 text-lg">
                <LuCircleHelp className="h-5 w-5" />
                Need Help?
              </span>
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);

    return (
      <div className="relative mt-20 min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-950/80 ring-1 ring-red-500/30">
              <LuCircleHelp className="h-10 w-10 text-red-300" />
            </div>
            <h1 className="font-bold-slanted mt-8 text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
              <span className="block tracking-tight uppercase">Something</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text tracking-tight text-transparent uppercase">
                Went Wrong
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Failed to load order details
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-gradient-to-r from-red-700 to-red-900 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-950/40"
            >
              Return Home
              <LuChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
