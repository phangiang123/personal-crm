"use server";

import { db } from "@/lib/db";

export type PushSubscriptionInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function saveSubscription(sub: PushSubscriptionInput) {
  await db.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { p256dh: sub.p256dh, auth: sub.auth },
    create: sub,
  });
}

export async function removeSubscription(endpoint: string) {
  await db.pushSubscription.deleteMany({ where: { endpoint } });
}

export async function hasActiveSubscription(endpoint: string) {
  const sub = await db.pushSubscription.findUnique({ where: { endpoint } });
  return !!sub;
}
