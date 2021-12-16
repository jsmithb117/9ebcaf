/// <reference types="cypress" />

const alice = {
  username: "Alice",
  email: "alice@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const bob = {
  username: "Bob",
  email: "bob@example.com",
  password: "L%e$xZHC4QKP@F",
};
const charlie = {
  username: "Charlie",
  email: "charlie@example.com",
  password: "123456",
}

describe("Implement a read status for messages", () => {
  it("setup", () => {
    cy.signup(alice.username, alice.email, alice.password);
    cy.logout();
    cy.signup(bob.username, bob.email, bob.password);
    cy.logout();
    cy.signup(charlie.username, charlie.email, charlie.password);
    cy.logout();
  });

  it("renders unread-message-count and resets to zero if clicked", () => {
    cy.reload();
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type("Bob");
    cy.contains("Bob").click();
    cy.get("input[name=text]").type("First message{enter}");
    cy.logout();

    cy.login(bob.username, bob.password);
    cy.get("#unread-message-count").should("contain", "1");
    cy.get("unread-message-count").click();
    cy.get("#unread-message-count").should.not("not.contain", "1");

  });

  it("renders other user avatar on last unread message", () => {
    //login with bob, send alice a message
    cy.reload();
    cy.login(bob.username, bob.password);
    cy.contains("Alice").click();
    cy.get("input[name=text]").type("Another 1st message{enter}");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.logout();

    //login with alice, read bob's messages
    cy.login(alice.username, alice.password);
    cy.contains("Bob").click();
    cy.logout();

    //login with bob, check to see if alice's avatar is on the latest read message
    cy.login(bob.username, bob.password);

    cy.contains("Alice").click();

    let count = 0;
    cy.get("#latest-read-message").then(() => {
      const $avatar = Cypress.$(':contains("#latest-read-message")');
      const $img = Cypress.$(':contains("img")');
      const $list = $avatar.parents().has($img).first();
      cy.wrap($list).children().eq(0).should.exist;
      cy.wrap($list).children().eq(1).should.exist;
    });
    });

});
