// Keep the existing SAMBHAV UPSC website/backend as the source of truth.
// Do not duplicate email authentication or create a separate user database here.
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL || "https://sambhavupsc.online";

// API routes should be connected only after verifying their existing contracts
// in the standalone SAMBHAV-UPSC web repository.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || WEBSITE_URL;
