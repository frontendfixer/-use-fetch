export const getBaseURL = () => {
  if (typeof process !== 'undefined' && process.env) {
    // Node.js environment
    return process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_BASE_URL
      : process.env.LOCAL_BASE_URL;
  } else if (typeof Deno !== 'undefined') {
    // Deno environment
    return Deno.env.get("DENO_ENV") === "production"
      ? Deno.env.get("PRODUCTION_BASE_URL")
      : Deno.env.get("LOCAL_BASE_URL");
  }
  // Fallback for other environments (e.g., browser)
  return '';
};