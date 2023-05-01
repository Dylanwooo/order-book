import { addStreamCommands } from "@lensesio/cypress-websocket-testing";
import "rxjs/add/operator/takeUntil";

addStreamCommands();

describe("Rabbitx orderbook", () => {
  it("should render the orderbook container", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Price(USD)").should("be.visible");
  });

  it("should handle the ws correctly", () => {
    cy.stream({ url: "wss://api.prod.rabbitx.io/ws" }).then((subject) => {
      subject
        .pipe(
          takeUntil(timer(1000)),
          reduce((acc, val) => acc.concat([val]), [])
        )
        .subscribe({
          next: (results) => {
            expect(results).to.not.be.undefined;
          },
          error: (err) => {},
          complete: done,
        });
    });
  });

  it("should render the bids and asks list", () => {
    cy.visit("http://localhost:3000/");

    cy.get(".ask-wrapper")
      .children()
      .should("have.length.greaterThan", 0);

    cy.get(".bid-wrapper")
      .children()
      .should("have.length.greaterThan", 0);
  });
});
