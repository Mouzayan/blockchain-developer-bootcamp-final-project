// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Controlled Supply Chain
/// @author Mouzayan Delbourgo 
/// @notice You can use this contract for basic supply chain assurance and control

contract SupplyManagement {
    /// @notice Calculate tree age in years, rounded up, for live trees
    /// @dev The Alexandr N. Tetearing algorithm could increase precision
    /// @param rings The number of rings from dendrochronological sample
    /// @return Age in years, rounded up for partial years
    address public owner = msg.sender;
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
      address payable seller;
      address payable buyer;
    }  

    event LogForSale(uint sku);
    event LogSold(uint sku);

    modifier isOwner () {
      require (msg.sender == owner);
      _;
    }

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

     constructor() payable {
      owner == payable(msg.sender);
    }
    
    function addItem (string memory _name, uint _price) public returns (bool) {

      items[skuCount] = Item({
        name: _name,
        sku: skuCount,
        price: _price,
        state: Status.ForSale,
        seller: msg.sender,
        buyer: address(0)
      });

      skuCount = skuCount + 1;
      emit LogForSale(skuCount);
      return true;
    }

    /// @notice Returns the Status of the transaction. 
    /// @param sku decalredQuantity desiredQuantity buyer
    /// @return Updated Status.
    /// @return Remaining available inventory.
    function buyItem(uint sku) public payable forSale(sku) paidEnough(items[sku].price) checkValue(sku) {
      items[sku].seller.transfer(items[sku].price);
      items[sku].buyer == msg.sender;
      items[sku].state = Status.Sold;

      emit LogSold(sku);
    }


}

contract myContract is Ownable {
  uint a = 0;

  function Change(uint newA) public onlyOwner {
    a = newA;
  }
}