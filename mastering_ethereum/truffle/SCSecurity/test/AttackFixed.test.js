/**
 * AttackFixed unit and integration tests.
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
 * @group attackfixed
 * @group contracts/attackfixed
 * @group scsecurity/contracts/attackfixed
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
const { transactionCost } = require("./helpers/transactionCost.js");

const AttackFixed = contract.fromArtifact("AttackFixed");
const EtherStoreFixed = contract.fromArtifact("EtherStoreFixed");
let attackFixed;
let etherStoreFixed;

describe("AttackFixed", () => {
  const [attacker, etherStoreFixedOwner, victim1, account1] = accounts;

  beforeEach(async () => {
    etherStoreFixed = await EtherStoreFixed.new({ from: etherStoreFixedOwner });
    attackFixed = await AttackFixed.new(etherStoreFixed.address, {
      from: attacker,
    });
  });

  describe("deployed", () => {
    test("the untrustedEtherStore is the EtherStoreFixed address", async () => {
      const untrustedEtherStore = await attackFixed.untrustedEtherStore();
      expect(untrustedEtherStore).toEqual(etherStoreFixed.address);
    });

    test("the owner is the deployer account", async () => {
      expect(await attackFixed.owner()).toEqual(attacker);
    });

    test("the contract balance is 0 ether", async () => {
      const contractBal = await balance.current(attackFixed.address);
      expect(contractBal.toString()).toEqual(ether("0").toString());
    });
  });

  describe("receive()", () => {
    test("the contract balance is updated", async () => {
      const deposit = ether("2");
      const tracker = await balance.tracker(attackFixed.address);
      await send.ether(account1, attackFixed.address, deposit);
      const trackerDelta = await tracker.delta();
      expect(trackerDelta.toString()).toEqual(deposit.toString());
    });
  });

  describe("attackUntrustedEtherStore()", () => {
    describe("the sender is not the owner", () => {
      test("the transaction is reverted", async () => {
        const message = "Ownable: caller is not the owner.";
        await expectRevert(
          attackFixed.attackUntrustedEtherStore({ from: account1 }),
          message
        );
      });
    });

    describe("the sender is the owner", () => {
      describe("the message value is less than 1 ether", () => {
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

      describe("the message value is gte than 1 ether", () => {
        let prevEtherStoreFixedBal;
        beforeEach(async () => {
          await etherStoreFixed.depositFunds({
            value: ether("5"),
            from: victim1,
          });
          prevEtherStoreFixedBal = await balance.current(
            etherStoreFixed.address
          );
        });

        test("the attackFixed balance in EtherStoreFixed is created", async () => {
          // NB: After executing "depositFunds()" and "withdrawFunds()", balance
          // is 0 ether.
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: ether("1"),
          });
          const attackerBal = await etherStoreFixed.balances(attacker);
          expect(attackerBal.toString()).toEqual("0");
        });

        test("the contract balance remains the same", async () => {
          const deposit = ether("1");
          const tracker = await balance.tracker(attackFixed.address);
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: deposit,
          });
          const trackerDelta = await tracker.delta();
          expect(trackerDelta.toString()).toEqual(deposit.toString());
        });

        test("the EtherStoreFixed balance is safu", async () => {
          await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: ether("1"),
          });
          const curEtherStoreFixedBal = await balance.current(
            etherStoreFixed.address
          );
          expect(curEtherStoreFixedBal.toString()).toEqual(
            prevEtherStoreFixedBal.toString()
          );
        });

        test("the transaction event LogDepositReceived is emitted", async () => {
          const deposit = ether("1");
          const receipt = await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: deposit,
          });
          await expectEvent.inTransaction(
            receipt.tx,
            etherStoreFixed,
            "LogDepositReceived",
            {
              _sender: attackFixed.address,
              _value: deposit.toString(),
            }
          );
        });

        test("the transaction event LogWithdrawalProcessed is emitted", async () => {
          const deposit = ether("1");
          const receipt = await attackFixed.attackUntrustedEtherStore({
            from: attacker,
            value: deposit,
          });
          await expectEvent.inTransaction(
            receipt.tx,
            etherStoreFixed,
            "LogWithdrawalProcessed",
            {
              _sender: attackFixed.address,
              _value: deposit.toString(),
            }
          );
        });
      });
    });
  });

  describe("collectEther()", () => {
    describe("the sender is not the owner", () => {
      test("the transaction is reverted", async () => {
        const message = "Ownable: caller is not the owner.";
        await expectRevert(
          attackFixed.collectEther({ from: account1 }),
          message
        );
      });
    });

    describe("the sender is the owner", () => {
      let prevAttackFixedBal;
      beforeEach(async () => {
        await send.ether(attacker, attackFixed.address, ether("2"));
        prevAttackFixedBal = await balance.current(attackFixed.address);
      });

      test("the sender balance is updated", async () => {
        const tracker = await balance.tracker(attacker);
        const receipt = await attackFixed.collectEther({ from: attacker });
        const tx = await web3.eth.getTransaction(receipt.tx);
        const txCost = transactionCost(tx.gasPrice, receipt.receipt.gasUsed);
        const withdrawDelta = prevAttackFixedBal.sub(txCost);
        const trackerDelta = await tracker.delta();
        expect(trackerDelta.toString()).toEqual(withdrawDelta.toString());
      });

      test("the contract balance is updated", async () => {
        await attackFixed.collectEther({ from: attacker });
        const curAttackFixedBal = await balance.current(attackFixed.address);
        expect(curAttackFixedBal.toString()).toEqual("0");
      });
    });
  });
});
