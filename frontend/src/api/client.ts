/**
 * API Client - Configured instance of generated API clients
 *
 * This file configures the generated OpenAPI clients with your axios instance
 * that includes authentication interceptors.
 */

import { Configuration } from "./generated/configuration";
import { AuthApi } from "./generated/api/auth-api";
import axiosInstance from "@/lib/axiosInstance";

// Get base URL from environment (matching your axiosInstance config)
const getBaseURL = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1"
  );
};

const baseURL = getBaseURL();
const basePath = `${baseURL}/api/v1`;

// Create configuration with base path
const apiConfiguration = new Configuration({
  basePath,
  baseOptions: {
    // Use the axios instance that has interceptors configured
    // The generated API will use this instance
  },
});

// Create API instances using your configured axios instance
// This ensures auth interceptors are applied automatically
export const authApi = new AuthApi(apiConfiguration, basePath, axiosInstance);

// Export all API instances
export const api = {
  auth: authApi,
};

// Re-export types for convenience
export type {
  AuthLoginPost200Response,
  AuthRegisterPost201Response,
  AuthLogoutPostRequest,
  AuthRefreshTokenPostRequest,
} from "./generated/models";
