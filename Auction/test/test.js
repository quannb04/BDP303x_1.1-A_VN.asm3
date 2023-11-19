let Auction = artifacts.require("./Auction.sol");

let auctionInstance;

contract("AuctionContract", function (accounts) {
  //accounts[0] is the default account
  describe("Contract deployment", function () {
    it("Contract deployment", function () {
      //Fetching the contract instance of out smart contract
      return Auction.deployed().then(function (instance) {
        //We save the instance in a global variable and all smart contract functions are called using this
        auctionInstance = instance;
        assert(
          auctionInstance !== undefined,
          "Auction contract should be defined"
        );
      });
    });

    it("Initial rule with corrected startingPrice and minimumStep", function () {
      //Fetching the rule of Auction
      return auctionInstance.rule().then(function (rule) {
        //We save the instance in a globa variable and all smart contract functions are called using this
        assert(rule !== undefined, "Rule should be defined");

        assert.equal(rule.startingPrice, 50, "Staring price should be 50");
        assert.equal(rule.minimumStep, 5, "Minimum step should be 5");
      });
    });
  });

  //Task 1: The cases satisfy the registration conditions
  describe("Register", function () {
    it("Only Ownner can register for the bidders", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[1] })
        .then(function (result) {
          throw "Failed to register a bidder";
        })
        .catch(function (e) {
          var a = e.toString();
          if (e == "Failed to register a bidder") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it("Register is only available in State.CREATED", function () {
      if (auctionInstance.state() !== 0) {
        auctionInstance
          .register(accounts[1], 200, { from: accounts[0] })
          .then(function () {
            throw "Failed to register, state must in State.CREATED";
          })
          .catch(function (e) {
            // var a = e.toString();
            if (e === "Failed to register, state must in State.CREATED") {
              assert(true);
            } else {
              assert(false);
            }
          });
      }
    });

    it("Register needs 2 parameters", function () {
      return auctionInstance
        .register(accounts[2], { from: accounts[0] }) //test register with only 1 parameter
        .then(function (instance) {
          throw "Failed to register, need 2 parameters";
        })
        .catch(function (e) {
          if (e === "Failed to register, need 2 parameters") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });
  });

  //Task 2: Test case to satisfy Start auction's condition
  describe("Start auction", function () {
    it("Only Ownner can start for the Auction", function () {
      return auctionInstance
        .startSession({ from: accounts[2] }) //test vs accounts[2]
        .then(function (result) {
          throw "Failed to start the Auction";
        })
        .catch(function (e) {
          // var a = e.toString();
          if (e === "Failed to start the Auction") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it("Start Auction is only available in State.CREATED", function () {
      if (auctionInstance.state() !== 0) {
        auctionInstance
          .startSession({ from: accounts[0] })
          .then(function () {
            throw "Failed to start Auction, state must in State.CREATED";
          })
          .catch(function (e) {
            // var a = e.toString();
            if (e === "Failed to start Auction, state must in State.CREATED") {
              assert(true);
            } else {
              assert(false);
            }
          });
      }
    });
  });

  //Task 3: Test case satisfy Bid
  describe("The Bid", function () {
    it("Bidders can Bid", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[0] })
        .then(function () {
          return auctionInstance.register(accounts[2], 200, {
            from: accounts[0],
          });
        })
        .then(function () {
          return auctionInstance.register(accounts[3], 200, {
            from: accounts[0],
          });
        })
        .then(function () {
          return auctionInstance.register(accounts[4], 200, {
            from: accounts[0],
          });
        })
        .then(function () {
          return auctionInstance.startSession({ from: accounts[0] });
        })
        .then(function () {
          return auctionInstance.bid(55, { from: accounts[1] });
        })
        .then(function () {
          return auctionInstance.bid(60, { from: accounts[2] });
        })
        .then(function () {
          return auctionInstance.bid(70, { from: accounts[3] });
        })
        .then(function () {
          return auctionInstance.bid(100, { from: accounts[4] });
        })
        .then(function () {
          throw "Bidders can Bid";
        })
        .catch(function (e) {
          var a = e.toString();
          if (e === "Bidders can Bid") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it("Bid is only available in State.STARTED", function () {
      if (auctionInstance.state() !== 1) {
        auctionInstance
          .bid(100, { from: accounts[1] })
          .then(function () {
            throw "Failed to Bid, Bid only available in State.STARTED";
          })
          .catch(function (e) {
            // var a = e.toString();
            if (e === "Failed to Bid, Bid only available in State.STARTED") {
              assert(true);
            } else {
              assert(false);
            }
          });
      }
    });

    it("Test the price bidders bid", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[0] })
        .then(function () {
          return auctionInstance.register(accounts[2], 200, {
            from: accounts[0],
          });
        })
        .then(function () {
          return auctionInstance.register(accounts[3], 200, {
            from: accounts[0],
          });
        })
        .then(function () {
          return auctionInstance.bid(50, { from: accounts[1] });
        })
        .then(function () {
          return auctionInstance.bid(100, { from: accounts[2] });
        })
        .then(function () {
          return auctionInstance.bid(75, { from: accounts[3] });
        })
        .then(function () {
          throw "The price is not available";
        })
        .catch(function (e) {
          // var a = e.toString();
          if (e === "The price is not available") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });
  });

  //Task 4: Test case satisfy announce
  describe("The Announce", function () {
    it("Only Auctioneer can announce", function () {
      return auctionInstance
        .announce({ from: accounts[1] })
        .then(function () {
          throw "Only Auctioneer can announce";
        })
        .catch(function (e) {
          var a = e.toString();
          if (a === "Only Auctioneer can announce") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it("Announce is available in State.STARTED", function () {
      if (auctionInstance.state() !== 1) {
        auctionInstance
          .announce({ from: accounts[0] })
          .then(function () {
            throw "Only State.STARTED can call announce";
          })
          .catch(function (e) {
            var a = e.toString;
            if (a === "Only State.STARTED can call announce") {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });

    it("After three times announce, The Auction has closed", function () {
      if (auctionInstance.state() === 1) {
        auctionInstance
          .announce({ from: accounts[0] })
          .then(function () {
            return auctionInstance.announce({ from: accounts[0] });
          })
          .then(function () {
            return auctionInstance.announce({ from: accounts[0] });
          })
          .then(function () {
            return auctionInstance.announce({ from: accounts[0] });
          })
          .then(function () {
            assert.equal(
              auctionInstance.state() === 2,
              "The Auction does not closing"
            );
          });
      }
    });
  });

  //Task 5: Return the deposits
  describe("Return the deposit", function () {
    it("All bidders, except Winner can getDeposit", function () {
      if (auctionInstance.state() == 2) {
        auctionInstance
          .getDeposit({ from: auctionInstance.currentWinner() }) //check winner cant getDeposit
          .then(function () {
            throw "Winner can not getDeposit";
          })
          .catch(function (e) {
            // var a = e.toString();
            if (e === "Winner can not getDeposit") {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });
    it("All bidders, except Winner can getDeposit", function () {
      let account;
      if (account !== auctionInstance.currentWinner()) {
        auctionInstance
          .getDeposit({ from: account })
          .then(function () {
            throw "Bidder can withdraw";
          })
          .catch(function (e) {
            // var a = e.toString();
            if (e === "Bidder can withdraw") {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });
  });
});
