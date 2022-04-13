import express from "express";
import "reflect-metadata";

import {} from 'config/connection';
import {swaggerSpec, swaggerUi} from 'config/swagger';
//

import cors from "cors";
import userRouter from "routes/userRouter";
import nationRouter from "routes/nationRouter";
import companyRouter from "routes/companyRouter";
import regionRouter from "routes/regionRouter";
import territoryRouter from "routes/territoryRouter";
import truckRouter from "routes/truckRouter";
import routeRouter from "routes/routeRouter";
import cityRouter from "routes/cityRouter";
import outletRouter from "routes/outletRouter";
import materialRouter from "routes/materialRouter";
import agentRouter from "routes/agentRouter";
import channelRouter from "routes/channelRouter";
import routeMarketRouter from "routes/routeMarketRouter";
import invoiceRouter from "routes/invoiceRouter";

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1.0/users", userRouter);
app.use("/api/v1.0/nations", nationRouter);
app.use("/api/v1.0/companies", companyRouter);
app.use("/api/v1.0/regions", regionRouter);
app.use("/api/v1.0/territories", territoryRouter);
app.use("/api/v1.0/trucks", truckRouter);
app.use("/api/v1.0/routes", routeRouter);
app.use("/api/v1.0/cities", cityRouter);
app.use("/api/v1.0/outlets", outletRouter);
app.use("/api/v1.0/materials", materialRouter);
app.use("/api/v1.0/agents", agentRouter);
app.use("/api/v1.0/channels", channelRouter);
app.use("/api/v1.0/route-markets", routeMarketRouter);
app.use("/api/v1.0/invoices", invoiceRouter);


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
