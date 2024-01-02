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

  log(
    `New Customer "${newCustomer.name}" created with id: "${newCustomer.id}"`
  );

  const newProduct1 = await repo(Product).insert({
    name: `Product${r}`,
    unitPrice: 15.99,
    stockQuantity: 10,
  });

  log(
    `New Product "${newProduct1.name}" created with id: "${newProduct1.id}". ${newProduct1.stockQuantity} items in stock.`
  );

  const newProduct2 = await repo(Product).insert({
    name: `Product${r + "_"}`,
    unitPrice: 20,
    stockQuantity: 100,
  });

  log(
    `New Product "${newProduct2.name}" created with id: "${newProduct2.id}". ${newProduct2.stockQuantity} items in stock.`
  );

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

  log(`New Order created with id: ${newOrder.id}`);

  await signIn("Manager");

  const orders = await repo(Order).find({
    where: {
      customer: { $id: newCustomer.id },
    },
    include: { customer: true, orderDetails: { include: { product: true } } },
  });

  for (const order of orders) {
    log(
      `Order ${order.id} for ${
        order.customer.name
      }, dated ${order.orderDate.toLocaleDateString()} is ${
        order.status
      }: ${order.orderDetails.map(
        (detail) =>
          `<br/>item: ${detail.product.name}, quantity: ${detail.quantity}, unit price: ${detail.unitPrice}`
      )}`
    );

    await repo(Order).save({ ...order, status: "Shipped" });
    log(`Order shipped`);
  }

  const product1 = await repo(Product).findId(newProduct1.id);
  log(`Current stock quantity of ${product1.name}: ${product1.stockQuantity}`);

  const product2 = await repo(Product).findId(newProduct2.id);
  log(`Current stock quantity of ${product2.name}: ${product2.stockQuantity}`);
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
    log(`Signed in as '${user.name}'`);
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
  document.querySelector<HTMLDivElement>(
    "#app"
  )!.innerHTML += `<p>${message}</p>`;
}
