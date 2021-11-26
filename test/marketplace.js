let BN = web3.utils.BN
const MarketPlace = artifacts.require('MarketPlace')
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper")
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('MarketPlace',([deployer, seller, buyer]) => {
let marketplace = null;
before(async() => {
  marketplace = await MarketPlace.deployed();
});

describe("deployment", async()=> {
  it('deploys successfully', async () => {
    const address = await marketplace.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })
})

describe("variables", () => {
    it("should have an owner", async () => {
      assert.equal(typeof marketplace.owner, 'function', "the contract has no owner");
    });

    it("should have an skuCount", async () => {
      assert.equal(typeof marketplace.skuCount, 'function', "the contract has no skuCount");
    });

    describe("enum SaleState", () => {
      let enumState;
      before(() => {
        enumState = MarketPlace.enums.SaleState;
        assert(
          enumState,
          "The contract should define an Enum called SaleState"
        );
      });

      it("should define `Started`", () => {
        assert(
          enumState.hasOwnProperty('Started'),
          "The enum does not have a `Started` value"
        );
      });

      it("should define `Running`", () => {
        assert(
          enumState.hasOwnProperty('Running'),
          "The enum does not have a `Running` value"
        );
      });

      it("should define `Ended`", () => {
        assert(
          enumState.hasOwnProperty('Ended'),
          "The enum does not have a `Ended` value"
        );
      });
})

describe("Item struct", () => {
      let itemStruct;

      before(() => {
        itemStruct = ItemStruct(MarketPlace);
        assert(
          itemStruct !== null, 
          "The contract should define an `Item Struct`"
        );
      });

       it("should have an `itemName`", () => {
        assert(
          isDefined(itemStruct)("itemName"), 
          "Struct Item should have a `itemName` member"
        );
        assert(
          isType(itemStruct)("itemName")("string"), 
          "`itemName` should be of type `string`"
        );
      });

      it("should have a `sku`", () => {
        assert(
          isDefined(itemStruct)("sku"), 
          "Struct Item should have a `sku` member"
        );
        assert(
          isType(itemStruct)("sku")("uint"), 
          "`sku` should be of type `uint`"
        );
      });

      it("should have a `itemPrice`", () => {
        assert(
          isDefined(itemStruct)("itemPrice"), 
          "Struct Item should have a `itemPrice` member"
        );
        assert(
          isType(itemStruct)("itemPrice")("uint"), 
          "`itemPrice` should be of type `uint`"
        );
      });

      it("should have a `owner`", () => {
        assert(
          isDefined(itemStruct)("owner"), 
          "Struct Item should have a `owner` member"
        );
        assert(
          isType(itemStruct)("owner")("address"), 
          "`owner` should be of type `address`"
        );
        assert(
          isPayable(itemStruct)("owner"), 
          "`owner` should be payable"
        );
      });

      it("should have a `qty`", () => {
        assert(
          isDefined(itemStruct)("qty"), 
          "Struct Item should have a `qty` member"
        );
        assert(
          isType(itemStruct)("qty")("uint"), 
          "`qty` should be of type `uint`"
        );
      });

      it("should have a `startBlock`", () => {
        assert(
          isDefined(itemStruct)("startBlock"), 
          "Struct Item should have a `startBlock` member"
        );
        assert(
          isType(itemStruct)("startBlock")("uint"), 
          "`startBlock` should be of type `uint`"
        );
      });

      it("should have a `endBlock`", () => {
        assert(
          isDefined(itemStruct)("endBlock"), 
          "Struct Item should have a `endBlock` member"
        );
        assert(
          isType(itemStruct)("endBlock")("uint"), 
          "`endBlock` should be of type `uint`"
        );
      });
});

describe("items", async() => {
  let result, skuCount

before(async () => {
  result = await marketplace.createMarketItem('book', web3.utils.toWei('1', 'Ether'), 100, { from: seller })
  sku = await marketplace.skuCount()
})
    it('creates items', async () => {
      // success
      assert.equal(sku, 1)
      const event = result.logs[0].args
      assert.equal(event.sku.toNumber(), 1)
      // failure: product must have a name
      await await marketplace.createMarketItem('', web3.utils.toWei('1', 'Ether'), 100, { from: seller }).should.be.rejected;
      // failure: product must have a price
      await await marketplace.createMarketItem('book', 0, 100, { from: seller }).should.be.rejected;
      // failure: product must have a quantity
      await await marketplace.createMarketItem('book', web3.utils.toWei('1', 'Ether'), 0, { from: seller }).should.be.rejected;
    })


    it('lists items', async () => {
      const item = await marketplace.items(sku)
      assert.equal(item.sku.toNumber(), 1)
      assert.equal(item.itemName, 'book', 'item name is correct')
      assert.equal(item.itemPrice, '1000000000000000000', 'item price is correct')
      assert.equal(item.qty, '100', 'item quantity is correct')
    })

    it('sells items and transfers value to seller', async () => {
      // Track seller balance before and after purchase
      let startSellerBalance = await web3.eth.getBalance(seller)
      startSellerBalance = new BN(startSellerBalance)

      // SUCCESS: buyer makes purchase
      result = await marketplace.buyItem(sku, 2, { from: buyer, value: web3.utils.toWei('2', 'Ether') })
      // check logs
      const event = result.logs[0].args
      assert.equal(event.sku.toNumber(), 1)
      assert.equal(event.itemName, 'book', 'item name is correct')
      assert.equal(event.itemPrice, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      // check that seller received funds (how much they had before, how much they have after)
      let endSellerBalance = await web3.eth.getBalance(seller)
      endSellerBalance = new BN(endSellerBalance)

      let itemPrice = web3.utils.toWei('2', 'Ether')
      itemPrice = new BN(itemPrice)

      const expectedBalance = startSellerBalance.add(itemPrice)
      assert.equal(endSellerBalance.toString(), expectedBalance.toString())

      // FAILURE: tries to buy item that does not exist (item must have valid sku)
      await marketplace.buyItem(99, 2, { from: buyer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;

      // FAILURE: tries to buy product without enough ether
      await marketplace.buyItem(sku, 2, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      console.log('succsess 3')

      // FAILURE: Buyer can't be seller
      // await marketplace.buyItem(sku, 2, { from: seller, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;

      // FAILURE: Deployer tries to buy the product
      // await marketplace.buyItem(sku, 2, { from: deployer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;

      })
    })
  })
})