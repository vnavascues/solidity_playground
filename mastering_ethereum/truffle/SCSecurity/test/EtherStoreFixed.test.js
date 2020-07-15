/**
 * EtherStoreFixed unit tests.
 *
 * Experimental test suite using the following modules:
 *   - OpenZeppelin test-environment, and test-helpers.
 *   - Jest.
 *   - Web3 (could "ethers.js" be integrated?).
 *
 * NB: This suite is not compatible with "solidity-coverage" because it does not
 * support OpenZeppelin test-environment, and test-helpers. It requires as well
 * swap Jest "test()" by "it()".
 *
 * @group etherstorefixed
 * @group contracts/etherstorefixed
 * @group scsecurity/contracts/etherstorefixed
 */
const {accounts, contract, web3} = require("@openzeppelin/test-environment");
// NB: All helpers are imported for learning purposes.
const {
  // BN,
  balance,
  // constants,
  ether,
  expectEvent,
  expectRevert,
  send,
  time,
} = require("@openzeppelin/test-helpers");
const {transactionCost} = require("./helpers/transactionCost.js");

const EtherStoreFixed = contract.fromArtifact("EtherStoreFixed");
let etherStoreFixed;

describe("EtherStoreFixed", () => {
  const [owner, account1] = accounts;

  beforeEach(async () => {
    etherStoreFixed = await EtherStoreFixed.new({from: owner});
  });

  describe("deployed", () => {
    test("the withdrawalLimit is 1 ether", async () => {
      const withdrawalLimit = await etherStoreFixed.withdrawalLimit();
      expect(withdrawalLimit.toString()).toEqual(ether("1").toString());
    });

    test("the owner is the deployer account", async () => {
      expect(await etherStoreFixed.owner()).toEqual(owner);
    });

    test("the contract balance is 0 ether", async () => {
      const contractBal = await balance.current(etherStoreFixed.address);
      expect(contractBal.toString()).toEqual(ether("0").toString());
    });
  });

  describe("receive() and fallback()", () => {
    test("the transaction is reverted", async () => {
      await expectRevert.unspecified(
        send.ether(owner, etherStoreFixed.address, ether("1"))
      );
    });
  });

  describe("depositFunds()", () => {
    test("the sender balances are updated", async () => {
      const deposit = ether("1.5");
      await etherStoreFixed.depositFunds({
        value: deposit,
        from: account1,
      });
      const account1Bal = await etherStoreFixed.balances(account1);
      expect(account1Bal.toString()).toEqual(deposit.toString());
    });

    test("the event LogDepositReceived is emitted", async () => {
      const deposit = ether("1.5");
      const receipt = await etherStoreFixed.depositFunds({
        value: deposit,
        from: account1,
      });
      await expectEvent(receipt, "LogDepositReceived", {
        _sender: account1,
        _value: deposit.toString(),
      });
    });
  });

  describe("withdrawFunds()", () => {
    describe("the sender does not have sufficient balance", () => {
      test("the transaction is reverted", async () => {
        const message = "EtherStoreFixed: Insufficient balance.";
        const withdraw = ether("1");
        await expectRevert(
          etherStoreFixed.withdrawFunds(withdraw, {from: account1}),
          message
        );
      });
    });

    describe("the sender has sufficient balance", () => {
      beforeEach(async () => {
        const deposit = ether("5");
        await etherStoreFixed.depositFunds({
          value: deposit,
          from: account1,
        });
      });

      describe("the withdrawal limit is exceeded", () => {
        test("the transaction is reverted", async () => {
          const message = "EtherStoreFixed: Withdrawal limit exceeded.";
          const withdraw = ether("1.5");
          await expectRevert(
            etherStoreFixed.withdrawFunds(withdraw, {from: account1}),
            message
          );
        });
      });

      describe("the withdrawal limit is not exceeded", () => {
        describe("a week has not passed since last withdrawal", () => {
          test("the transaction is reverted", async () => {
            const message =
              "EtherStoreFixed: A week has not passed since last withdrawal.";
            const withdraw = ether("1");
            await etherStoreFixed.withdrawFunds(withdraw, {from: account1});
            await expectRevert(
              etherStoreFixed.withdrawFunds(withdraw, {from: account1}),
              message
            );
          });
        });

        describe("a week has passed since the last withdrawal", () => {
          beforeEach(async () => {
            const withdraw = ether("1");
            const startAt = await time.latest();
            const timeDelta = time.duration.weeks(2);
            const endAt = startAt.add(timeDelta);
            await etherStoreFixed.withdrawFunds(withdraw, {from: account1});
            await time.increaseTo(endAt);
          });

          test("the sender withdraws the funds", async () => {
            const withdraw = ether("1");
            const tracker = await balance.tracker(account1);
            const receipt = await etherStoreFixed.withdrawFunds(withdraw, {
              from: account1,
            });
            const tx = await web3.eth.getTransaction(receipt.tx);
            const txCost = transactionCost(
              tx.gasPrice,
              receipt.receipt.gasUsed
            );
            const withdrawDelta = withdraw.sub(txCost);
            const trackerDelta = await tracker.delta();
            expect(trackerDelta.toString()).toEqual(withdrawDelta.toString());
          });

          test("the sender balance is updated", async () => {
            const withdraw = ether("1");
            const prevAccount1Bal = await etherStoreFixed.balances(account1);
            await etherStoreFixed.withdrawFunds(withdraw, {from: account1});
            const curAccount1Bal = await etherStoreFixed.balances(account1);
            const expAccount1Bal = prevAccount1Bal.sub(withdraw);
            expect(curAccount1Bal.toString()).toEqual(
              expAccount1Bal.toString()
            );
          });

          test("the sender last withdraw time is updated", async () => {
            const withdraw = ether("1");
            const startAt = await time.latest();
            const timeDelta = time.duration.hours(1);
            const endAt = startAt.add(timeDelta);
            await time.increaseTo(endAt);
            await etherStoreFixed.withdrawFunds(withdraw, {from: account1});
            const account1LWTime = await etherStoreFixed.lastWithdrawTime(
              account1
            );
            const isLWTimeGTE = account1LWTime.gte(endAt);
            expect(isLWTimeGTE).toBe(true);
          });

          test("the event LogWithdrawalProcessed is emitted", async () => {
            const withdraw = ether("1");
            const receipt = await etherStoreFixed.withdrawFunds(withdraw, {
              from: account1,
            });
            await expectEvent(receipt, "LogWithdrawalProcessed", {
              _sender: account1,
              _value: withdraw.toString(),
            });
          });
        });
      });
    });
  });
});
