let BN = web3.utils.BN;
const MarketPlace = artifacts.require('MarketPlace');
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract('MarketPlace',() => {
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
      let enumSaleState;
      before(() => {
        enumSaleState = MarketPlace.enums.SaleState;
        assert(
          enumSaleState,
          "The contract should define an Enum called SaleState"
        );
      });

      it("should define `Started`", () => {
        assert(
          enumSaleState.hasOwnProperty('Started'),
          "The enum does not have a `Started` value"
        );
      });

      it("should define `Running`", () => {
        assert(
          enumSaleState.hasOwnProperty('Running'),
          "The enum does not have a `Running` value"
        );
      });

      it("should define `Ended`", () => {
        assert(
          enumSaleState.hasOwnProperty('Ended'),
          "The enum does not have a `Ended` value"
        );
      });
})

describe("Item struct", () => {
      let subjectStruct;

      before(() => {
        subjectStruct = ItemStruct(MarketPlace);
        assert(
          subjectStruct !== null, 
          "The contract should define an `Item Struct`"
        );
      });

       it("should have an `itemName`", () => {
        assert(
          isDefined(subjectStruct)("itemName"), 
          "Struct Item should have a `itemName` member"
        );
        assert(
          isType(subjectStruct)("itemName")("string"), 
          "`itemName` should be of type `string`"
        );
      });

      it("should have a `sku`", () => {
        assert(
          isDefined(subjectStruct)("sku"), 
          "Struct Item should have a `sku` member"
        );
        assert(
          isType(subjectStruct)("sku")("uint"), 
          "`sku` should be of type `uint`"
        );
      });

      it("should have a `itemPrice`", () => {
        assert(
          isDefined(subjectStruct)("itemPrice"), 
          "Struct Item should have a `itemPrice` member"
        );
        assert(
          isType(subjectStruct)("itemPrice")("uint"), 
          "`itemPrice` should be of type `uint`"
        );
      });

      it("should have a `state`", () => {
        assert(
          isDefined(subjectStruct)("state"), 
          "Struct Item should have a `state` member"
        );
        assert(
          isType(subjectStruct)("state")("SaleState"), 
          "`state` should be of type `SaleState`"
        );
      });

      it("should have a `seller`", () => {
        assert(
          isDefined(subjectStruct)("seller"), 
          "Struct Item should have a `seller` member"
        );
        assert(
          isType(subjectStruct)("seller")("address"), 
          "`seller` should be of type `address`"
        );
        assert(
          isPayable(subjectStruct)("seller"), 
          "`seller` should be payable"
        );
      });

      it("should have a `qty`", () => {
        assert(
          isDefined(subjectStruct)("qty"), 
          "Struct Item should have a `qty` member"
        );
        assert(
          isType(subjectStruct)("qty")("uint"), 
          "`qty` should be of type `uint`"
        );
      });

      it("should have a `startBlock`", () => {
        assert(
          isDefined(subjectStruct)("startBlock"), 
          "Struct Item should have a `startBlock` member"
        );
        assert(
          isType(subjectStruct)("startBlock")("uint"), 
          "`startBlock` should be of type `uint`"
        );
      });

      it("should have a `endBlock`", () => {
        assert(
          isDefined(subjectStruct)("endBlock"), 
          "Struct Item should have a `endBlock` member"
        );
        assert(
          isType(subjectStruct)("endBlock")("uint"), 
          "`endBlock` should be of type `uint`"
        );
      });

      

});

describe("items", async() => {
  let result, sku

before(async () => {
  result = await marketplace.createMarketItem('book', web3.utils.toWei('1', 'Ether'), 100)
  sku = await marketplace.skuCount()
})

  it('creates items', async () => {
    assert.equal(sku, 1)
    console.log(result.logs)
    const event = result.logs[0].args
    assert.equal(event.sku.toNumber(), 1)
  })

})

   });
});