import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import {
  createPlanWikiMcpServer,
  getBearerToken,
  verifyToken,
} from "@/app/api/mcp/handler";

const handleMcpRequest = async (req: Request) => {
  const authInfo = await verifyToken(req, getBearerToken(req));

  if (!authInfo) {
    return Response.json(
      {
        error: "unauthorized",
        message: "Provide a valid Authorization: Bearer <api-key>.",
      },
      { status: 401 },
    );
  }

  const server = createPlanWikiMcpServer(authInfo);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return transport.handleRequest(req, { authInfo });
};

export async function GET(req: Request) {
  return handleMcpRequest(req);
}

export async function POST(req: Request) {
  return handleMcpRequest(req);
}

export async function DELETE(req: Request) {
  return handleMcpRequest(req);
}
