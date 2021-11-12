// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Controlled Supply Chain
/// @author Mouzayan Delbourgo 
/// @notice You can use this contract for basic supply chain assurance and control
///@dev Some functions will have the side effect of updating state
contract SupplyManagement is Ownable {
    // /// @notice The account that deployed the contract
    // address public override owner = msg.sender;
    /// @notice This is the amount of purchased items
    uint256 public skuCount;

    mapping(uint => Item) items;

    enum Status {
        ForSale,
        Sold
    }

    struct Item {
      string name;
      uint sku;
      uint price;
      Status state;
      uint declaredDate;
      address payable seller;
      address payable buyer;
    }  

    event LogForSale(uint sku);
    event LogSold(uint sku);

    modifier verifyCaller (address _address) {
      require (msg.sender == _address);
      _;
    }

    modifier paidEnough (uint _price) {
      require (msg.value >= _price);
      _;
    }

    modifier checkValue (uint _sku) {
      _;
      uint _price = items[_sku].price;
      uint amountToRefund = msg.value - _price;
      items[_sku].buyer.transfer(amountToRefund);
    }

    modifier forSale (uint _sku) {
      require (items[_sku].state == Status.ForSale
      && items[_sku].sku >=0);
      _;
    }

    modifier sold (uint _sku) {
      require (items[_sku].state == Status.Sold);
      _;
    }

    /// @notice Owner declares stock
    /// @param _name of item
    /// @param _price of item
    /// @return Boolean to confirm that item was added for purchase
    function declareStock (string name uint _sku uint _price uint _declaredDate;) public onlyOwner {
      
    }
    
    /// @notice Select item and its quantity to purchase
    /// @param _name of item
    /// @param _price of item
    /// @return Boolean to confirm that item was added for purchase
    function addItem (string memory _name, uint _price) public returns (bool) {

      items[skuCount] = Item({
        name: _name,
        sku: skuCount,
        price: _price,
        state: Status.ForSale,
        seller: payable(msg.sender),
        buyer: payable(address(0))
      });

      skuCount = skuCount + 1;
      emit LogForSale(skuCount);
      return true;
    }

    /// @notice Complete your purchase
    /// @param sku of item for  purchase
    function buyItem(uint sku) public payable forSale(sku) paidEnough(items[sku].price) checkValue(sku) {
      items[sku].seller.transfer(items[sku].price);
      items[sku].buyer == msg.sender;
      items[sku].state = Status.Sold;

      emit LogSold(sku);     
    }

}
