"use server";

import bcrypt from "bcryptjs";
import { signOut, auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function changePassword(newPassword: string) {
  if (newPassword.length < 8) {
    throw new Error("Mật khẩu cần ít nhất 8 ký tự.");
  }
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Chưa đăng nhập.");
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { email: session.user.email },
    data: { passwordHash },
  });
}
