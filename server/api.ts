import { remultExpress } from "remult/remult-express";
import { Product } from "shared/products.js";
import { Customer } from "shared/customers.js";
import { Order } from "shared/orders.js";
import { OrderDetail } from "shared/order-details.js";

export const api = remultExpress({
  entities: [Product, Customer, Order, OrderDetail],
  getUser: (req) => req.session!["user"],
});
