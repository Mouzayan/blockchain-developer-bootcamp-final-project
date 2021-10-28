const { default: Web3 } = require("web3");

const SimpleStorage = artifacts.require("SimpleStorage");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("SimpleStorage", function (accounts) {
  it("should assert true", async function () {
    await SimpleStorage.deployed();
    return assert.isTrue(true);
  });

  it("has an initial value of 0", async() => {
    // get the contract that's been deployed
    const ssInstance = await SimpleStorage.deployed();

    // verify it has an initial value of 0

    const storedData = await ssInstance.getStoredData.call();
    assert.equal(storedData, 0, "Initial state should be zero");
  })

  describe("Functionality", () => {
    it("should store a new value 42", async() => {
      // grab the contract we need
      const ssInstance = await SimpleStorage.deployed();


      // change the number!
      await ssInstance.setStoredData(42, {from: accounts[0]});

      const storedData = await ssInstance.getStoredData.call();
      assert.equal(storedData, 42, 42 was not stored!);
          })
  })

  it("should not let someone else change the variable", async() => {
    const [owner, badJoe] = accounts;
    const ssInstance = await SimpleStorage.new(42, {from: owner});

  try {
    await ssInstance.setStoredData(22, {from: badJoe })
  } catch(err) {}

    const balance = await web3.eth.getBalance(accounts[0]);
    console.log(balance);

    const storedData = await ssInstance.getStoredData.call();
    assert.equal(storedData, 42, 'storedData was not changed');

  });
});