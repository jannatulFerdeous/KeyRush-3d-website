import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getProductByUid } from "@/products";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-07-30.basil",
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    const { uid } = await params;

    if (!uid) {
      return NextResponse.json(
        { error: "Missing Product UID" },
        { status: 400 },
      );
    }

    const product = getProductByUid(uid);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;
    const imageUrl = new URL(product.image, origin).toString();

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              images: [imageUrl],
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    };

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error", error);

    if (
      error instanceof Error &&
      error.message === "Missing STRIPE_SECRET_KEY environment variable"
    ) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create Stripe Session" },
      { status: 500 },
    );
  }
}
