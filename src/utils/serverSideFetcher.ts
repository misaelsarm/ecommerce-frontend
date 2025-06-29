// utils/serverSideFetcher.ts
import { GetServerSidePropsContext } from "next";
import { getServerSideToken } from "./getServerSideToken";
import { makeRequest } from "./makeRequest";

interface FetchOptions {
  endpoint: string; // e.g., "/api/collections/:code"
  dataKey: string;  // e.g., "collection"
  propKey: string;  // e.g., "collection"
  paramKey?: string; // e.g., "code" (default: "id")
}

export const createServerSideFetcher = async (
  context: GetServerSidePropsContext,
  { endpoint, dataKey, propKey, paramKey = "id" }: FetchOptions
) => {
  const { req, params } = context;
  const dynamicValue = params?.[paramKey];
  const token = getServerSideToken(req);
  let errorCode = null;
  let errorMessage = null;
  let dataProp = null;

  try {
    const finalEndpoint = endpoint.replace(`:${paramKey}`, String(dynamicValue));
    const data = await makeRequest("get", finalEndpoint, {}, {
      headers: {
        "x-access-token": token,
      },
    });

    dataProp = data[dataKey];
  } catch (error: any) {
    errorCode = error.response?.status;
    errorMessage = error.response?.data?.message;
  }

  if (errorCode) {
    return {
      props: {
        error: {
          error: errorCode,
          message: errorMessage,
        },
      },
    };
  }

  return {
    props: {
      [propKey]: dataProp,
    },
  };
};
