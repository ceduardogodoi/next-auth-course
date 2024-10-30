"use client";

import { Button } from "@/components/ui/button";
import { logout } from "./actions";

export function LogoutButton() {
  async function handleLogout() {
    await logout();
  }

  return (
    <Button size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
