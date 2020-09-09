/**
 * AttackFaulty unit and integration tests.
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
 * @group attackfaulty
 * @group faulty
 * @group reentrancy_attack/attackfaulty
 * @group reentrancy_attack/faulty
 */
const {accounts, contract, web3} = require("@openzeppelin/test-environment");
// NB: All helpers are imported for learning purposes.
const {
  // BN,
  balance,
  // constants,
  ether,
  // expectEvent,
  expectRevert,
  send,
  // time,
} = require("@openzeppelin/test-helpers");
const {transactionCost} = require("./../helpers/transactionCost.js");

const AttackFaulty = contract.fromArtifact("AttackFaulty");
const EtherStoreFaulty = contract.fromArtifact("EtherStoreFaulty");
let attackFaulty;
let etherStoreFaulty;

describe.only("AttackFaulty", () => {
  const [attacker, etherStoreFaultyOwner, victim1] = accounts;

  beforeEach(async () => {
    etherStoreFaulty = await EtherStoreFaulty.new({
      from: etherStoreFaultyOwner,
    });
    attackFaulty = await AttackFaulty.new(etherStoreFaulty.address, {
      from: attacker,
    });
  });

  describe("deployed", () => {
    test("the etherStoreFaulty is the EtherStoreFaulty address", async () => {
      const etherStoreFaultyAddr = await attackFaulty.etherStoreFaulty();
      expect(etherStoreFaultyAddr).toEqual(etherStoreFaulty.address);
    });

    test("the contract balance is 0 ether", async () => {
      const contractBal = await balance.current(attackFaulty.address);
      expect(contractBal.toString()).toEqual(ether("0").toString());
    });
  });

  describe("attackEtherStoreFaulty()", () => {
    describe("the message value is less than 1 ether", () => {
      test("the transaction is reverted", async () => {
        const message = "Requires 1 ether";
        await expectRevert(
          attackFaulty.attackEtherStoreFaulty({
            from: attacker,
            value: ether("0.99"),
          }),
          message
        );
      });
    });

    describe("the message value is gte than 1 ether", () => {
      let prevEtherStoreFaultyBal;
      beforeEach(async () => {
        await etherStoreFaulty.depositFunds({
          value: ether("5"),
          from: victim1,
        });
        prevEtherStoreFaultyBal = await balance.current(
          etherStoreFaulty.address
        );
      });

      test("the attackFaulty balance in EtherStoreFaulty is created", async () => {
        // NB: After executing "depositFunds()" and "withdrawFunds()", balance
        // is 0 ether.
        await attackFaulty.attackEtherStoreFaulty({
          from: attacker,
          value: ether("1"),
        });
        const attackerBal = await etherStoreFaulty.balances(attacker);
        expect(attackerBal.toString()).toEqual("0");
      });

      test("the contract balance is updated with the stolen ethers", async () => {
        // NB: The reentrancy attack is successful
        const deposit = ether("1");
        const tracker = await balance.tracker(attackFaulty.address);
        await attackFaulty.attackEtherStoreFaulty({
          from: attacker,
          value: deposit,
        });
        const trackerDelta = await tracker.delta();
        const expAttackFaultyBal = prevEtherStoreFaultyBal.add(deposit);
        expect(trackerDelta.toString()).toEqual(expAttackFaultyBal.toString());
      });

      test("the EtherStoreFaulty balance is updated (0 ether)", async () => {
        await attackFaulty.attackEtherStoreFaulty({
          from: attacker,
          value: ether("1"),
        });
        const curEtherStoreFaultyBal = await balance.current(
          etherStoreFaulty.address
        );
        expect(curEtherStoreFaultyBal.toString()).toEqual("0");
      });
    });
  });

  describe("collectEther()", () => {
    let prevAttackFaultyBal;
    beforeEach(async () => {
      await send.ether(attacker, attackFaulty.address, ether("2"));
      prevAttackFaultyBal = await balance.current(attackFaulty.address);
    });

    test("the sender balance is updated", async () => {
      const tracker = await balance.tracker(attacker);
      const receipt = await attackFaulty.collectEther({from: attacker});
      const tx = await web3.eth.getTransaction(receipt.tx);
      const txCost = transactionCost(tx.gasPrice, receipt.receipt.gasUsed);
      const withdrawDelta = prevAttackFaultyBal.sub(txCost);
      const trackerDelta = await tracker.delta();
      expect(trackerDelta.toString()).toEqual(withdrawDelta.toString());
    });

    test("the contract balance is updated", async () => {
      await attackFaulty.collectEther({from: attacker});
      const curAttackFaultyBal = await balance.current(attackFaulty.address);
      expect(curAttackFaultyBal.toString()).toEqual("0");
    });
  });
});
