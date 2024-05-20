import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utlis";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL}`);
      },
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info(`Next app started`);
    app.listen(PORT, () => {
      payload.logger.info(
        `Server started on: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
