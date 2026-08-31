import { describe, it, expect } from "vitest";
import {
  getMcpServerCard,
  getMcpRegistryManifest,
  getAiCatalog,
  handleMcpJsonRpc,
} from "@/lib/mcp/server";

describe("MCP manifests and JSON-RPC", () => {
  it("exposes streamable-http remotes in registry and server card", () => {
    const card = getMcpServerCard();
    const manifest = getMcpRegistryManifest();
    const catalog = getAiCatalog();

    expect(card.remotes[0].type).toBe("streamable-http");
    expect(card.remotes[0].url).toMatch(/\/mcp$/);
    expect(manifest.remotes[0].type).toBe("streamable-http");
    expect(catalog.entries[0].type).toBe("application/mcp-server-card+json");
  });

  it("handles initialize and tools/list", () => {
    const init = handleMcpJsonRpc({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test", version: "0.0.1" },
      },
    }) as { result: { protocolVersion: string; capabilities: unknown } };

    expect(init.result.protocolVersion).toBe("2025-11-25");
    expect(init.result.capabilities).toHaveProperty("tools");

    const list = handleMcpJsonRpc({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    }) as { result: { tools: Array<{ name: string }> } };

    const names = list.result.tools.map((t) => t.name);
    expect(names).toContain("nicholasadamou_search");
    expect(names).toContain("nicholasadamou_get_developer_docs");
  });

  it("calls search tool and returns structured content", () => {
    const response = handleMcpJsonRpc({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "nicholasadamou_search",
        arguments: { q: "a" },
      },
    }) as {
      result: {
        structuredContent: { count: number };
        isError?: boolean;
      };
    };

    expect(response.result.isError).toBeFalsy();
    expect(response.result.structuredContent.count).toBeGreaterThanOrEqual(0);
  });
});
