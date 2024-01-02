import { Allow, Entity, Fields, Relations, repo } from "remult";
import { Customer } from "./customers.js";
import { OrderDetail } from "./order-details.js";
import { Product } from "./products.js";

@Entity<Order>("orders", {
  allowApiCrud: Allow.authenticated,
  async saving(order, e) {
    if (
      order.status === "Shipped" &&
      e.fields.status.originalValue === "Pending"
    ) {
      for (const detail of await repo(Order)
        .relations(order)
        .orderDetails.find({ include: { product: true } }))
        repo(Product).save({
          ...detail.product,
          stockQuantity: detail.product.stockQuantity - detail.quantity,
        });
    }
  },
})
export class Order {
  @Fields.cuid()
  id = "";

  @Relations.toOne(() => Customer)
  customer: Customer;

  @Fields.date()
  orderDate = new Date();

  @Fields.string()
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled" = "Pending";

  @Relations.toMany(() => OrderDetail)
  orderDetails: OrderDetail[];
}
