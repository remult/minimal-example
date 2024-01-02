import { Allow, Entity, Fields } from "remult";

@Entity("customers", {
  allowApiCrud: Allow.authenticated,
})
export class Customer {
  @Fields.cuid()
  id = "";

  @Fields.string()
  name = "";

  @Fields.string()
  email = "";

  @Fields.boolean({
    allowApiUpdate: ["admin"],
  })
  premiumMember = false;

  @Fields.dateOnly({
    allowApiUpdate: ["admin"],
  })
  membershipEndDate?: Date;
}
