const EtherStoreFixed = artifacts.require("EtherStoreFixed");
const AttackFixed = artifacts.require("AttackFixed");

module.exports = async function (callback) {
  let etherStore;
  let attack;
  let accounts;
  let attackerAddr;
  let attackFixedOwnerAddr;
  let etherStoreFixedOwnerAddr;
  let victim1Addr;
  let victim2Addr;

  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  async function getBalance(address) {
    return web3.eth.getBalance(address);
  }

  function logAddresses() {
    console.log(`EtherStoreFixed owner address: ${etherStoreFixedOwnerAddr}`);
    console.log(`EtherStoreFixed address: ${etherStore.address}`);
    console.log(`Victim 1 account address: ${victim1Addr}`);
    console.log(`Victim 2 account address: ${victim2Addr}`);
    console.log(`AttackFixed owner address: ${attackFixedOwnerAddr}`);
    console.log(`AttackFixed address: ${attack.address}`);
    console.log(`Attacker account address: ${attackerAddr}`);
    console.log("\n");
  }

  async function logAddressesBalances() {
    const victim1Balance = await etherStore
      .balances(victim1Addr)
      .catch((e) => console.log(e));

    const victim2Balance = await etherStore
      .balances(victim2Addr)
      .catch((e) => console.log(e));

    console.log(
      `EtherStoreFixed balance: ${toEther(
        await getBalance(etherStore.address)
      )} ether`
    );
    console.log(
      `EtherStoreFixed victim 1 balance: ${toEther(
        victim1Balance.toString()
      )} ether`
    );
    console.log(
      `EtherStoreFixed victim 2 balance: ${toEther(
        victim2Balance.toString()
      )} ether`
    );
    console.log(
      `AttackFixed balance: ${toEther(await getBalance(attack.address))} ether`
    );
    console.log(
      `Attacker balance: ${toEther(await getBalance(attackerAddr))} ether`
    );
    console.log("\n");
  }

  function toEther(wei) {
    return web3.utils.fromWei(wei, "ether");
  }

  // Get an account
  accounts = await getAccounts();
  attackerAddr = accounts[0];
  // etherStoreFixedOwnerAddr = accounts[1];
  victim1Addr = accounts[2];
  victim2Addr = accounts[3];

  // Contracts instances
  // NB: Attacker gets the ownership of the AttackFixed contract
  etherStore = await EtherStoreFixed.deployed().catch((e) => console.log(e));
  attack = await AttackFixed.deployed().catch((e) => console.log(e));

  etherStoreFixedOwnerAddr = await etherStore
    .owner()
    .catch((e) => console.log(e));
  attackFixedOwnerAddr = await attack.owner().catch((e) => console.log(e));

  // Logs before the attack
  console.log("1. Addresses, and balances before the attack\n");

  logAddresses();
  await logAddressesBalances();

  // Victims deposit funds into EtherStoreFixed contract
  console.log("2. Victims deposit funds in EtherStoreFixed\n");

  await etherStore
    .depositFunds({
      value: web3.utils.toWei("5", "ether"),
      from: victim1Addr,
    })
    .catch((e) => console.log(e));

  await etherStore
    .depositFunds({
      value: web3.utils.toWei("5", "ether"),
      from: victim2Addr,
    })
    .catch((e) => console.log(e));

  await logAddressesBalances();

  // Attack part 1: Attack EtherStoreFixed via AttackFixed
  console.log("3. Attack EtherStoreFixed\n");

  await attack
    .attackUntrustedEtherStore({
      value: web3.utils.toWei("1", "ether"),
      from: attackerAddr,
    })
    .catch((e) => console.log(e));

  await logAddressesBalances();

  // Attack part 2: Collect stolen funds (from AttackFixed to attacker)
  console.log("4. Collect the stolen funds\n");

  await attack.collectEther().catch((e) => console.log(e));

  // Logs after the attack
  await logAddressesBalances();

  callback();
};
