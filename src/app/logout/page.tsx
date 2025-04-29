"use client";

import { loginService } from "@/lib/services/login";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/ui/loader/LoadingOverlay";

/**
 * A component that handles user logout and redirects to the login page
 * @returns {JSX.Element} A loading overlay while redirecting
 */
function LogoutPage() {
  const router = useRouter(); // Hook to access Next.js router for navigation
  const searchParams = useSearchParams(); // Hook to access URL query parameters

  // Initiate logout process by calling loginService.logout
  loginService.logout();

  // Construct redirect URL, preserving any query parameters
  const queryString = searchParams.toString();
  const redirectUrl = queryString ? `/login?${queryString}` : "/login";

  // Perform redirect to login page with constructed URL
  router.push(redirectUrl);

  // Render loading overlay during redirect
  return <LoadingOverlay />;
}

export default LogoutPage;
