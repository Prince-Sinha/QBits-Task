// Predefined product catalog
const readline = require("readline");
class Product {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }

  toString() {
    return `ID: ${this.id}, Name: ${this.name}, Price: $${this.price.toFixed(
      2
    )}, Category: ${this.category}`;
  }
}
class Item {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  totalPrice() {
    return this.product.price * this.quantity;
  }

  toString() {
    return `${this.product.name} - ${
      this.quantity
    } @ $${this.product.price.toFixed(2)} each = $${this.totalPrice().toFixed(
      2
    )}`;
  }
}
class Discount {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  // Placeholder method for applying discount (to be overridden)
  apply(cart) {
    return 0;
  }
}

// Buy 1 Get 1 Free for Fashion category
class BuyOneGetOneFreeFashion extends Discount {
  constructor() {
    super(
      "Buy 1 Get 1 Free on Fashion",
      "Buy 1 Get 1 Free for Fashion category items."
    );
  }

  apply(cart) {
    let discount = 0;
    for (let item of Object.values(cart.items)) {
      if (item.product.category === "Fashion" && item.quantity >= 2) {
        const freeItems = Math.floor(item.quantity / 2); // Buy 1 get 1 free
        discount += freeItems * item.product.price;
      }
    }
    return discount;
  }
}

// 10% Off on Electronics
class TenPercentOffElectronics extends Discount {
  constructor() {
    super("10% Off on Electronics", "10% discount on all Electronics items.");
  }

  apply(cart) {
    let discount = 0;
    for (let item of Object.values(cart.items)) {
      if (item.product.category === "Electronics") {
        discount += item.totalPrice() * 0.1; // 10% off
      }
    }
    return discount;
  }
}

// Discount Manager to handle listing and applying all discounts
class DiscountManager {
  constructor() {
    this.availableDiscounts = [
      new BuyOneGetOneFreeFashion(),
      new TenPercentOffElectronics(),
    ];
  }

  listDiscounts() {
    console.log("\nAvailable Discounts:");
    this.availableDiscounts.forEach((discount, index) => {
      console.log(`${index + 1}. ${discount.name} - ${discount.description}`);
    });
  }

  applyDiscounts(cart) {
    let totalDiscount = 0;
    this.availableDiscounts.forEach((discount) => {
      totalDiscount += discount.apply(cart);
    });
    return totalDiscount;
  }
}

class Cart {
  constructor() {
    this.items = {};
    this.discountManager = new DiscountManager();
    this.exchangeRates = {
      EUR: 0.85, // Example rate: 1 USD = 0.85 EUR
      GBP: 0.75, // Example rate: 1 USD = 0.75 GBP
    };
  }

  addItem(productId, productCatalog, quantity = 1) {
    const product = productCatalog.find((p) => p.id === productId);
    if (!product) {
      console.log("Product not found.");
      return;
    }

    if (this.items[productId]) {
      this.items[productId].quantity += quantity;
    } else {
      this.items[productId] = new Item(product, quantity);
    }
    console.log(`Added ${quantity} of ${product.name} to the cart.`);
  }

  removeItem(productId, quantity = 0) {
    if (!this.items[productId]) {
      console.log(`Product ${productId} is not in the cart.`);
      return;
    }

    if (quantity === 0 || this.items[productId].quantity <= quantity) {
      delete this.items[productId];
      console.log(
        `Removed ${
          this.items[productId]?.product.name || productId
        } from the cart.`
      );
    } else {
      this.items[productId].quantity -= quantity;
      console.log(
        `Reduced ${this.items[productId].product.name} by ${quantity}.`
      );
    }
  }

  //   calculateSubtotal() {
  //     let subtotal = 0;
  //     for (let item of Object.values(this.items)) {
  //       subtotal += item.totalPrice();
  //     }
  //     return subtotal;
  //   }

  viewCart() {
    if (Object.keys(this.items).length === 0) {
      console.log("Your cart is empty.");
      return;
    }
    console.log("\nYour Cart:");
    let index = 1;
    for (let item of Object.values(this.items)) {
      console.log(
        `${index}. ${item.product.name} - Quantity: ${
          item.quantity
        }, Price: $${item.product.price.toFixed(2)} USD, Total: $${item
          .totalPrice()
          .toFixed(2)} USD`
      );
      index++;
    }
    console.log(
      `Total (before discounts): $${this.calculateSubtotal().toFixed(2)} USD`
    );
  }

  checkout() {
    console.log("Applying discounts...");
    const discountAmount = this.discountManager.applyDiscounts(this);
    const total = subtotal - discountAmount;
    console.log(`Final Total in USD: $${total.toFixed(2)}`);

    // Prompt user for currency conversion
    const readline = require("readline-sync");
    const convertCurrency = readline
      .question("Would you like to view it in a different currency? (yes/no): ")
      .toLowerCase();

    if (convertCurrency === "yes") {
      console.log("Available Currencies: EUR, GBP");
      const selectedCurrency = readline
        .question("Enter currency: ")
        .toUpperCase();

      if (this.exchangeRates[selectedCurrency]) {
        const convertedTotal = this.convertCurrency(total, selectedCurrency);
        console.log(
          `Final Total in ${selectedCurrency}: ${convertedTotal.toFixed(
            2
          )} ${selectedCurrency}`
        );
      } else {
        console.log("Invalid currency selected.");
      }
    }

    this.clearCart();
  }

  // Method to convert the total to another currency
  convertCurrency(amount, currency) {
    return amount * this.exchangeRates[currency];
  }

  clearCart() {
    this.items = {};
    console.log("The cart has been cleared.");
  }
}
//predefined product catalog
const productCatalog = [
  new Product("P001", "Laptop", 1000.0, "Electronics"),
  new Product("P002", "Phone", 500.0, "Electronics"),
  new Product("P003", "T-shirt", 20.0, "Fashion"),
];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cart = new Cart();
const discount = new DiscountManager();
function showMenu() {
  console.log("\n-- Mini E-commerce Cart System --");
  console.log("initial_Product_Catalog. View product catalog");
  console.log("addtocart. Add product to cart");
  console.log("removefromcart. Remove product from cart");
  console.log("viewcart. View cart");
  console.log("listdiscounts. View All Discounts Available");
  console.log("applydiscounts. Apply discount");
  console.log("clearcart. Clear cart");
  console.log("checkout. Checkout");
  console.log("exit. Exit");
  rl.question("Choose an option: ", handleInput);
}

function handleInput(option) {
  switch (option) {
    case "initial":
      viewProductCatalog();
      break;
    case "addtocart":
      rl.question("Enter product ID to add to cart: ", (productId) => {
        rl.question("Enter quantity: ", (quantity) => {
          cart.addItem(productId, productCatalog, parseInt(quantity));
          showMenu();
        });
      });
      break;
    case "removefromcart":
      rl.question("Enter product ID to remove from cart: ", (productId) => {
        rl.question(
          "Enter quantity to remove (or 0 to remove entirely): ",
          (quantity) => {
            cart.removeItem(productId, parseInt(quantity));
            showMenu();
          }
        );
      });
      break;
    case "viewcart":
      cart.viewCart();
      showMenu();
      break;
    case "listdiscounts":
      discount.listDiscounts();
      break;
    case "applydiscounts":
      discount.applyDiscounts(cart);
      break;
    case "checkout":
      cart.checkout();
      showMenu();
      break;
    case "clearcart":
      cart.clearCart();
      break;
    case "exit":
      console.log("Exiting the system.");
      rl.close();
      break;
    default:
      console.log("Invalid option, please try again.");
      showMenu();
  }
}

function viewProductCatalog() {
  console.log("\nProduct Catalog:");
  productCatalog.forEach((product) => {
    console.log(product.toString());
  });
  showMenu();
}

// Start the application
showMenu();
