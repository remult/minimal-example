import { Allow, Entity, Fields, remult } from "remult";

@Entity<Product>("products", {
  allowApiCrud: ["admin"],
  allowApiRead: Allow.authenticated,
  apiPrefilter: () =>
    remult.user?.roles?.includes("admin") ? {} : { discontinued: false },
})
export class Product {
  @Fields.cuid()
  id = "";

  @Fields.string()
  name = "";

  @Fields.number()
  unitPrice = 0;

  @Fields.integer()
  stockQuantity = 0;

  @Fields.boolean({
    includeInApi: ["admin"],
  })
  discontinued = false;
}
