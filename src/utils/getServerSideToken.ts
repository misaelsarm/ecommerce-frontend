import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export const getServerSideToken = (nextReq: IncomingMessage & {
  cookies: NextApiRequestCookies;
}) => {
  // Extract the token from cookies
  const token = nextReq.headers.cookie
    ?.split(';')
    .find(c => c.trim().startsWith('token='))
    ?.split('=')[1];

  return token
}