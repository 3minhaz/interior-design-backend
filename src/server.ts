import app from "./app";
import config from "./app/config";

async function bootstrap() {
  const server = app.listen(config.port, () => {
    console.log("server in running on port" + config.port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("server closed");
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}

bootstrap();
