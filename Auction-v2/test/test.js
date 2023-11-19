let Auction = artifacts.require("./Auction.sol");

let auctionInstance;

contract("AuctionContract", function (accounts) {
  //accounts[0] is the default account
  describe("Contract deployment", function () {
    it("Contract deployment", function () {
      //Fetching the contract instance of our contract
      return Auction.deployed().then(function (instance) {
        //We save the instance in a global variable and all smart contract functions are called using this
        auctionInstance = instance;
        assert(
          auctionInstance !== undefined,
          "Auction contract should be defined"
        );
      });
    });

    it("Initial rule with corrected staringPrice and minimumStep", function () {
      //Fetching the rule of Auction
      return auctionInstance.rule().then(function (rule) {
        //We save the instance in a global variable and all smart contract functions are called using this
        assert(rule !== undefined, "Rule should be defined");
        assert.equal(rule.startingPrice, 50, "Starting price should be 50");
        assert.equal(rule.minimumStep, 5, "Minimum step should be 5");
      });
    });
  });

  // before(async function () {
  //   auctionInstance = await Auction.deployed();
  // });

  //Task 1: Register bidders
  describe("Register bidders", function () {
    it("Register bidders", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[1] })
        .then(function () {
          throw "Failed to register the bidder";
        })
        .catch(function (result) {
          if (result === "Failed to register the bidder") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    //Register only available in state.CREATE
    it("Register bidders", function () {
      if (auctionInstance.state != 0) {
        auctionInstance
          .register(accounts[1], 200, { from: accounts[0] })
          .then(function () {
            throw "Register not available in state.STARTED";
          })
          .catch(function (result) {
            if (result === "Register not available in state.STARTED") {
              assert(true);
            } else {
              assert(false);
            }
          });
      }
    });

    //When register need import 2 parameters
    it("Check with import 1 parameter with function register", function () {
      auctionInstance
        .register(accounts[1], { from: accounts[0] })
        .then(function () {
          throw "Register need two parameters";
        })
        .catch(function (result) {
          if (result == "Register need two parameters") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });
  });

  //Task 2: Start Auction
  describe("Start auction", function () {
    it("Only Auctionner can start Auction", function () {
      return auctionInstance
        .startSession({ from: accounts[1] })
        .then(function () {
          throw "Auctionner can be start Auction";
        })
        .catch(function (result) {
          if (result === "Auctionner can be start Auction") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    //Start Auction only available in state.CREATE
    it("Start Auction only available in state CREATE", function () {
      if (auctionInstance.state != 0) {
        auctionInstance
          .startSession({ from: accounts[0] })
          .then(function () {
            throw "Start Auction only available in state CREATE";
          })
          .catch(function (result) {
            if (result === "Start Auction only available in state CREATE") {
              assert(true);
            } else {
              assert(false);
            }
          });
      }
    });
  });

  //Task 3: Bid
  describe("Bid", function () {
    it("Bidders can bid", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[1] })
        .then(function () {
          auctionInstance.register(accounts[2], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.register(accounts[3], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.register(accounts[4], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.startSession({ from: accounts[0] });
        })
        .then(function () {
          auctionInstance.bid(accounts[1], 55);
        })
        .then(function () {
          auctionInstance.bid(accounts[2], 70);
        })
        .then(function () {
          auctionInstance.bid(accounts[3], 85);
        })
        .then(function () {
          auctionInstance.bid(accounts[4], 100);
        })
        .then(function () {
          throw "Bidders can be bid";
        })
        .catch(function (result) {
          if (result === "Bidders can be bid") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    //Bid only available in state.STARTED
    it("Bid only available in state.STARTED", function () {
      if (auctionInstance.state != 1) {
        auctionInstance
          .bid(accounts[1], 100)
          .then(function () {
            throw "Bid only available in state STARTED";
          })
          .catch(function (result) {
            if (result === "Bid only available in state STARTED") {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });

    //Next bidder must equal or bigger than current price + minimumstep
    it("Next bid", function () {
      return auctionInstance
        .register(accounts[1], 200, { from: accounts[1] })
        .then(function () {
          auctionInstance.register(accounts[2], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.register(accounts[3], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.register(accounts[4], 200, { from: accounts[1] });
        })
        .then(function () {
          auctionInstance.startSession({ from: accounts[0] });
        })
        .then(function () {
          auctionInstance.bid(accounts[1], 55);
        })
        .then(function () {
          auctionInstance.bid(accounts[2], 70);
        })
        .then(function () {
          auctionInstance.bid(accounts[3], 85);
        })
        .then(function () {
          auctionInstance.bid(accounts[4], 70);
        })
        .then(function () {
          throw "Next bid must bigger or equal current price + mimiStep";
        })
        .catch(function (result) {
          if (
            result === "Next bid must bigger or equal current price + mimiStep"
          ) {
            assert(false);
          } else {
            assert(true);
          }
        });
    });
  });

  //Task 4: Announce
  describe("Announce", function () {
    it("Only auctioneer can be announce", function () {
      return auctionInstance
        .announce({ from: accounts[1] })
        .then(function () {
          throw "Only auctionner can be announce";
        })
        .catch(function (result) {
          if (result === "Only auctionner can be announce") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    //Announce only available in state.STARTED
    it("Announce only available in state.STARTED", function () {
      if (auctionInstance.state != 1) {
        auctionInstance
          .announce({ from: accounts[0] })
          .then(function () {
            throw "Announce only available in state STARTED";
          })
          .catch(function (result) {
            if (result === "Announce only available in state STARTED") {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });

    //After three times Announce, Auction has closing
    it("After three time announces", function () {
      auctionInstance
        .announce({ from: accounts[0] })
        .then(function () {
          auctionInstance.announce({ from: accounts[0] });
        })
        .then(function () {
          auctionInstance.announce({ from: accounts[0] });
        })
        .then(function () {
          auctionInstance.announce({ from: accounts[0] });
        })
        .then(function () {
          assert.equal(auctionInstance.state == 2, "Auction must be CLOSING");
        });
    });
  });

  //Task 5: Withdraw the deposit
  describe("Withdraw the deposit", function () {
    //getDeposit only available in state.CLOSING, except Currentwinner
    it("getDeposit only available in state.CLOSING, except currentwinner", function () {
      if (auctionInstance.state != 2) {
        auctionInstance
          .getDeposit({ from: auctionInstance.currentWinner })
          .then(function () {
            throw "getDeposit only available in state.CLOSING, except currentwinner";
          })
          .catch(function (result) {
            if (
              result ===
              "getDeposit only available in state.CLOSING, except currentwinner"
            ) {
              assert(false);
            } else {
              assert(true);
            }
          });
      }
    });
  });
});
