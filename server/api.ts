import { remultExpress } from "remult/remult-express";
import { createKnexDataProvider } from "remult/remult-knex";
import { Product } from "shared/products.js";
import { Customer } from "shared/customers.js";
import { Order } from "shared/orders.js";
import { OrderDetail } from "shared/order-details.js";

export const api = remultExpress({
  dataProvider: createKnexDataProvider({
    client: "sqlite3",
    connection: ":memory:",
    debug: true,
    log: { debug: ({ sql, bindings }) => console.log({ sql, bindings }) },
    useNullAsDefault: false,
  }),
  entities: [Product, Customer, Order, OrderDetail],
  getUser: (req) => req.session!["user"],
});
