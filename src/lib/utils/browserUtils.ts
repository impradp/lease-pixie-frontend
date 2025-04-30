import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Sets the browser url with the valid uri and the query params.
 *
 * @param uri The uri that needs to be replaced with in the browser
 * @param searchParams The search paramters that were passed from one page to another.
 */
export function sanitizeUrl(
  uri: string,
  searchParams: ReadonlyURLSearchParams | undefined
) {
  // Correctly update URL without page reload
  if (searchParams?.has("id")) {
    const id = searchParams.get("id");
    window.history.pushState(null, "", `${uri}?id=${id}`);
  } else {
    window.history.pushState(null, "", `${uri}`);
  }
}
