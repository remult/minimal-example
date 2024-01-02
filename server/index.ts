import express from "express";
import session from "cookie-session";
import { auth } from "./auth.js";
import { api } from "./api.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.set("trust proxy", 1);

app.use(
  session({
    secret: "shhhhhhhhhhh",
    // sameSite: "none",
    // secure: true,
  })
);

app.use(auth);

app.use(api);

const openApiDocument = api.openApiDoc({ title: "My API" });
app.get("/api/openApi.json", (req, res) => res.json(openApiDocument));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(3000, () => console.log("Server started"));
