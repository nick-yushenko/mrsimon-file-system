import type { FastifyInstance } from "fastify";

export async function filesRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      items: [
        {
          id: "1",
          name: "Documents",
          type: "folder",
        },
        {
          id: "2",
          name: "example.pdf",
          type: "file",
        },
      ],
    };
  });
}
