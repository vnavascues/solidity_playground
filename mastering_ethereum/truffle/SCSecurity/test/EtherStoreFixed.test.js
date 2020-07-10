/**
 * EtherStoreFixed tests.
 *
 * Experimental test suite using:
 *   - OpenZeppelin test-environment, and test-helpers.
 *   - Jest.
 *   - Web3 (could "ethers.js" be integrated?).
 *
 * @group etherstorefixed
 * @group unit/etherstorefixed
 * @group contracts/etherstorefixed
 * @group contracts/unit/etherstorefixed
 * @group scsecurity/contracts/unit/etherstorefixed
 */
const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
// NB: All helpers are imported for learning purposes.
const {
  BN,
  balance,
  constants,
  ether,
  expectEvent,
  expectRevert,
  send,
  time,
} = require("@openzeppelin/test-helpers");

const EtherStoreFixed = contract.fromArtifact("EtherStoreFixed");
let etherStoreFixed;

describe("EtherStoreFixed", () => {
  const [_, etherStoreOwner, victim1] = accounts;

  beforeEach(async () => {
    etherStoreFixed = await EtherStoreFixed.new({ from: etherStoreOwner });
  });

  describe("when deployed", () => {
    test("the withdrawalLimit is 1 ether", async () => {
      const withdrawalLimit = await etherStoreFixed.withdrawalLimit();
      expect(withdrawalLimit.toString()).toEqual(ether("1").toString());
    });

    test("the owner is the deployer account", async () => {
      expect(await etherStoreFixed.owner()).toEqual(etherStoreOwner);
    });

    test("the balance is 0 ether", async () => {
      const contractBalance = await balance.current(etherStoreFixed.address);
      expect(contractBalance.toString()).toEqual(ether("0").toString());
    });
  });

  describe("when depositing funds", () => {
    test("the sender balances are updated", async () => {
      const depositAmount = ether("1.5");
      await etherStoreFixed.depositFunds({
        value: depositAmount,
        from: victim1,
      });
      const victim1Balance = await etherStoreFixed.balances(victim1);
      expect(victim1Balance.toString()).toEqual(depositAmount.toString());
    });
    test("the event LogDepositReceived is emitted", async () => {
      const depositAmount = ether("1.5");
      const receipt = await etherStoreFixed.depositFunds({
        value: depositAmount,
        from: victim1,
      });
      await expectEvent(receipt, "LogDepositReceived", {
        _sender: victim1,
        _value: depositAmount.toString(),
      });
    });
  });

  describe("when withdrawing funds", () => {
    describe("the sender does not have sufficient balance", () => {
      test("the transaction is reverted", async () => {
        const message = "Insufficient balance.";
        const withdrawAmount = ether("1");
        await expectRevert(
          etherStoreFixed.withdrawFunds(withdrawAmount, {
            from: victim1,
          }),
          message
        );
      });
    });
    describe("the sender has sufficient balance", () => {
      beforeEach(async () => {
        const depositAmount = ether("5");
        await etherStoreFixed.depositFunds({
          value: depositAmount,
          from: victim1,
        });
      });
      describe("the withdrawal limit is exceeded", () => {
        test("the transaction is reverted", async () => {
          const message = "Withdrawal limit exceeded.";
          const withdrawAmount = ether("1.5");
          await expectRevert(
            etherStoreFixed.withdrawFunds(withdrawAmount, {
              from: victim1,
            }),
            message
          );
        });
      });
      describe("the withdrawal limit is not exceeded", () => {
        describe("and a week has not passed since last withdrawal", () => {
          test("the transaction is reverted", async () => {
            const message = "A week has not passed since last withdrawal.";
            const withdrawAmount = ether("1");
            await etherStoreFixed.withdrawFunds(withdrawAmount, {
              from: victim1,
            });
            await expectRevert(
              etherStoreFixed.withdrawFunds(withdrawAmount, {
                from: victim1,
              }),
              message
            );
          });
        });
        describe("and a week has passed since the last withdrawal", () => {
          beforeEach(async () => {
            const withdrawAmount = ether("1");
            const startAt = await time.latest();
            const timeDelta = time.duration.weeks(2);
            const endAt = startAt.add(timeDelta);
            await etherStoreFixed.withdrawFunds(withdrawAmount, {
              from: victim1,
            });
            await time.increaseTo(endAt);
          });
          test("the sender withdraws the funds", async () => {
            const withdrawAmount = ether("1");
            const tracker = await balance.tracker(victim1);
            const receipt = await etherStoreFixed.withdrawFunds(
              withdrawAmount,
              {
                from: victim1,
              }
            );
            const tx = await web3.eth.getTransaction(receipt.tx);
            const gasPrice = new BN(tx.gasPrice);
            const gasUsed = new BN(receipt.receipt.gasUsed);
            const transactionCost = gasPrice.mul(gasUsed);
            const withdrawAmountDelta = withdrawAmount.sub(transactionCost);
            const trackerDelta = await tracker.delta();
            expect(trackerDelta.toString()).toEqual(
              withdrawAmountDelta.toString()
            );
          });
          test("the sender balance is updated", async () => {
            const withdrawAmount = ether("1");
            const previousVictim1Balance = await etherStoreFixed.balances(
              victim1
            );
            await etherStoreFixed.withdrawFunds(withdrawAmount, {
              from: victim1,
            });
            const currentVictim1Balance = await etherStoreFixed.balances(
              victim1
            );
            const expectedVictim1Balance = previousVictim1Balance.sub(
              withdrawAmount
            );
            expect(currentVictim1Balance.toString()).toEqual(
              expectedVictim1Balance.toString()
            );
          });
          test("the sender last withdraw time is updated", async () => {
            const withdrawAmount = ether("1");
            const startAt = await time.latest();
            const timeDelta = time.duration.hours(1);
            const endAt = startAt.add(timeDelta);
            await time.increaseTo(endAt);
            await etherStoreFixed.withdrawFunds(withdrawAmount, {
              from: victim1,
            });
            const currentVictim1LWTime = await etherStoreFixed.lastWithdrawTime(
              victim1
            );
            const isGTE = currentVictim1LWTime.gte(endAt);
            expect(isGTE).toBe(true);
          });
          test("the event LogWithdrawalProcessed is emitted", async () => {
            const withdrawAmount = ether("1");
            const receipt = await etherStoreFixed.withdrawFunds(
              withdrawAmount,
              {
                from: victim1,
              }
            );
            await expectEvent(receipt, "LogWithdrawalProcessed", {
              _sender: victim1,
              _value: withdrawAmount.toString(),
            });
          });
        });
      });
    });
  });
});
