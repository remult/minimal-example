import { remult, repo } from "remult";
import { Customer } from "shared/customers";
import { Product } from "shared/products";
import { Order } from "shared/orders";

const r = (Math.random() * 10000).toFixed(0);

async function demo() {
  await signOut();

  await signIn("Manager");

  const newCustomer = await repo(Customer).insert({
    name: `Customer${r}`,
    email: `${r}@remult.dev`,
  });

  log(`New Customer <i>${newCustomer.name}</i> (id: <i>${newCustomer.id.substring(0, 6) + "..."}</i>) created`);

  const newProduct1 = await repo(Product).insert({
    name: `Product${r}`,
    unitPrice: 15.99,
    stockQuantity: 10,
  });

  log(`New Product <i>${newProduct1.name}</i> (id: <i>${newProduct1.id.substring(0, 6) + "..."}</i>) 
    created with <i>${newProduct1.stockQuantity}</i> items in stock.`);

  const newProduct2 = await repo(Product).insert({
    name: `Product${r + "_"}`,
    unitPrice: 20,
    stockQuantity: 100,
  });

  log(`New Product <i>${newProduct2.name}</i> (id: <i>${newProduct2.id.substring(0, 6) + "..."}</i>) 
    created with <i>${newProduct2.stockQuantity}</i> items in stock.`);

  await signIn("SalesRep");

  const newOrder = await repo(Order).insert({
    customer: await repo(Customer).findFirst({ name: `Customer${r}` }),
  });

  await repo(Order)
    .relations(newOrder)
    .orderDetails.insert({
      product: await repo(Product).findFirst({ name: `Product${r}` }),
      quantity: 2,
    });

  await repo(Order)
    .relations(newOrder)
    .orderDetails.insert({
      product: await repo(Product).findFirst({ name: `Product${r + "_"}` }),
      quantity: 1,
    });

  log(`New Order (id: <i>${newOrder.id.substring(0, 6) + "..."}</i>) created`);

  await signIn("Manager");

  const orders = await repo(Order).find({
    where: {
      customer: { $id: newCustomer.id },
    },
    include: { customer: true, orderDetails: { include: { product: true } } },
  });

  for (const order of orders) {
    log(
      `Order for <i>${order.customer.name}</i>, dated <i>${order.orderDate.toLocaleDateString()}</i> is in status <i>${
        order.status
      }</i>: ${order.orderDetails.map(
        (detail) =>
          `<br/>Item: <i>${detail.product.name}</i>, quantity: <i>${detail.quantity}</i>, unit price: <i>${detail.unitPrice}</i>`
      )}`
    );

    await repo(Order).save({ ...order, status: "Shipped" });

    log(`Order status updated to <i>Shipped</i>`);
  }

  const product1 = await repo(Product).findId(newProduct1.id);
  log(`Current stock quantity of <i>${product1.name}</i> is <i>${product1.stockQuantity}</i>`);

  const product2 = await repo(Product).findId(newProduct2.id);
  log(`Current stock quantity of <i>${product2.name}</i> is <i>${product2.stockQuantity}</i>`);
}

demo();

async function signIn(username: string) {
  try {
    const user = await (
      await fetch("/api/signIn", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
    ).json();
    log(`Signed in as <i>${user.name}</i>`);
    remult.user = user;
  } catch (error) {
    log(`Sign in failed ${error}`);
    remult.user = undefined;
  }
}

async function signOut() {
  await fetch("/api/signOut", { method: "POST" });
}

function log(message: string) {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML += `<p>${message}</p>`;
}
