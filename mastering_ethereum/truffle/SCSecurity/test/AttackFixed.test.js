/**
 * AttackFixed tests.
 *
 * Experimental test suite using:
 *   - OpenZeppelin test-environment, and test-helpers.
 *   - Jest.
 *   - Web3 (could "ethers.js" be integrated?).
 *
 * @group attackfixed
 * @group unit/attackfixed
 * @group contracts/attackfixed
 * @group contracts/unit/attackfixed
 * @group scsecurity/contracts/unit/attackfixed
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

const AttackFixed = contract.fromArtifact("AttackFixed");
const EtherStoreFixed = contract.fromArtifact("EtherStoreFixed");
let attackFixed;
let etherStoreFixed;

describe("AttackFixed", () => {
  const [attacker, etherStoreOwner, victim1] = accounts;

  beforeEach(async () => {
    etherStoreFixed = await EtherStoreFixed.new({ from: etherStoreOwner });
    attackFixed = await AttackFixed.new(etherStoreFixed.address, {
      from: attacker,
    });
  });

  describe("when deployed", () => {
    test("the untrustedEtherStore is the EtherStoreFixed address", async () => {
      const untrustedEtherStore = await attackFixed.untrustedEtherStore();
      expect(untrustedEtherStore).toEqual(etherStoreFixed.address);
    });

    test("the owner is the deployer account", async () => {
      expect(await attackFixed.owner()).toEqual(attacker);
    });

    test("the balance is 0 ether", async () => {
      const contractBalance = await balance.current(attackFixed.address);
      expect(contractBalance.toString()).toEqual(ether("0").toString());
    });
  });

  describe("when receiving ether", () => {
    test("the balance is updated", async () => {
      const value = ether("2");
      const tracker = await balance.tracker(attackFixed.address);
      await send.ether(etherStoreOwner, attackFixed.address, value);
      const trackerDelta = await tracker.delta();
      expect(trackerDelta.toString()).toEqual(value.toString());
    });
  });
  describe("when attacking untrustedEtherStore", () => {
    describe("and the sender is not the owner", () => {
      test("the transaction is reverted", async () => {
        const message = "Ownable: caller is not the owner.";
        await expectRevert(
          attackFixed.attackUntrustedEtherStore({
            from: etherStoreOwner,
          }),
          message
        );
      });
    });
    describe("and the sender is the owner", () => {
      describe("and the message value is less than 1 ether", () => {
        test("the transaction is reverted", async () => {
          const message = "Requires 1 ether.";
          await expectRevert(
            attackFixed.attackUntrustedEtherStore({
              from: attacker,
              value: ether("0.99"),
            }),
            message
          );
        });
      });
      // TODO:
      // - Test if an exception is risen via the fallback function in the logs
      // not via assertRevert().
      // - improve describes
      // - refactor scoped describe variables
      // - rename variables... too long... in both tests
      // - test fallback function?
      // - Test faulty contracts
      // - Unit or integration tests? Refactor "groups"
      // - Solidity coverage
      describe("and the message value is gte than 1 ether", () => {
        let previousUntrustedEtherStoreBalance;
        beforeEach(async () => {
          // const depositAmount = ether("5");
          await etherStoreFixed.depositFunds({
            value: ether("5"),
            from: victim1,
          });
          previousUntrustedEtherStoreBalance = await balance.current(
            etherStoreFixed.address
          );
        });
        test("the funds are deposited and withdrawn from EtherStoreFixed", async () => {
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: ether("1"),
          });
          const attackerBalance = await etherStoreFixed.balances(attacker);
          expect(attackerBalance.toString()).toEqual("0");
        });
        test("the attackFixed balance remains the same", async () => {
          const value = ether("1");
          const tracker = await balance.tracker(attackFixed.address);
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: value,
          });
          const trackerDelta = await tracker.delta();
          expect(trackerDelta.toString()).toEqual(value.toString());
        });
        test("the untrustedEtherStore balance is safu", async () => {
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: ether("1"),
          });
          const currentUntrustedEtherStoreBalance = await balance.current(
            etherStoreFixed.address
          );
          expect(currentUntrustedEtherStoreBalance.toString()).toEqual(
            previousUntrustedEtherStoreBalance.toString()
          );
        });
        test("the transaction event LogDepositReceived is emitted", async () => {
          const depositAmount = ether("1");
          const receipt = await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: depositAmount,
          });
          await expectEvent.inTransaction(
            receipt.tx,
            etherStoreFixed,
            "LogDepositReceived",
            {
              _sender: attackFixed.address,
              _value: depositAmount.toString(),
            }
          );
        });
        test("the transaction event LogWithdrawalProcessed is emitted", async () => {
          const depositAmount = ether("1");
          const receipt = await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: depositAmount,
          });
          await expectEvent.inTransaction(
            receipt.tx,
            etherStoreFixed,
            "LogWithdrawalProcessed",
            {
              _sender: attackFixed.address,
              _value: depositAmount.toString(),
            }
          );
        });
      });
    });
  });
  describe("when collecting ether", () => {
    describe("and the sender is not the owner", () => {
      test("the transaction is reverted", async () => {
        const message = "Ownable: caller is not the owner.";
        await expectRevert(
          attackFixed.collectEther({
            from: etherStoreOwner,
          }),
          message
        );
      });
    });
    describe("and the sender is the owner", () => {
      let previousAttackFixedBalance;
      beforeEach(async () => {
        await send.ether(attacker, attackFixed.address, ether("2"));
        previousAttackFixedBalance = await balance.current(attackFixed.address);
      });
      test("the sender collects the funds", async () => {
        const tracker = await balance.tracker(attacker);
        const receipt = await attackFixed.collectEther({ from: attacker });
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = new BN(tx.gasPrice);
        const gasUsed = new BN(receipt.receipt.gasUsed);
        const transactionCost = gasPrice.mul(gasUsed);
        const collectedAmountDelta = previousAttackFixedBalance.sub(
          transactionCost
        );
        const trackerDelta = await tracker.delta();
        expect(trackerDelta.toString()).toEqual(
          collectedAmountDelta.toString()
        );
      });
      test("the balances are updated", async () => {
        await attackFixed.collectEther({ from: attacker });
        const currentAttackFixedBalance = await balance.current(
          attackFixed.address
        );
        expect(currentAttackFixedBalance.toString()).toEqual("0");
      });
    });
  });
});
