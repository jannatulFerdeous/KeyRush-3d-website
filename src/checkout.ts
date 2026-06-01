export async function checkout(uid = "vapor75") {
  const response = await fetch(`/api/checkout/${uid}`, { method: "POST" });
  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    const message = data.error ?? "Failed to create checkout session";
    window.alert(message);
    throw new Error(message);
  }

  window.location.href = data.url;
}
