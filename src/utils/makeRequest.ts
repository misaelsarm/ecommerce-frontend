import { api } from "@/api/api";
import Cookies from "js-cookie";

export const makeRequest = async (method: 'get' | 'post' | 'put', url: string, data: any = {}, options = {}) => {
  const config: any = {
    method,
    url,
    headers: {
      "x-access-token": Cookies.get('token'),
      //@ts-ignore
      ...options.headers
    }
  };

  if (method !== 'get') {
    config.data = data;
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    // Handle error as needed
    console.error('API request error:', error);
    throw error;
  }
};
