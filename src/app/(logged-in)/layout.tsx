import Link from "next/link";
import { PropsWithChildren } from "react";
import { LogoutButton } from "./logout-button";

export default function LoggedInLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-200 flex justify-between p-4 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href="/my-account">My Account</Link>
          </li>
          <li>
            <Link href="/change-password">Change Password</Link>
          </li>
        </ul>

        <div>
          <LogoutButton />
        </div>
      </nav>

      <div className="flex-1 flex justify-center items-center">{children}</div>
    </div>
  );
}
