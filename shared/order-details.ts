import { Allow, Entity, Fields, Relations, repo } from "remult";
import { Order } from "./orders.js";
import { Product } from "./products.js";

@Entity("order-details", { allowApiCrud: Allow.authenticated })
export class OrderDetail {
  @Fields.cuid()
  id = "";

  @Relations.toOne(() => Order)
  order: Order;

  @Relations.toOne(() => Product)
  product: Product;

  @Fields.number<OrderDetail>({
    allowApiUpdate: false,
    saving: (orderDetail, _, e) => {
      if (e.isNew) orderDetail.unitPrice = orderDetail.product.unitPrice;
    },
  })
  unitPrice = 0;

  @Fields.integer()
  quantity = 0;
}
