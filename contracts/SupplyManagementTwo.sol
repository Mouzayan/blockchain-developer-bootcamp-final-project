// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ReentrancyGuard {
    address payable public owner;
    uint public startBlock; // stockOfferingStartDate
    uint public endBlock; // stockOfferingEndDate
    uint private _itemIds;
    uint private _itemsSold;
    uint256 public itemPrice = 0.1 ether; 
    
    enum State {
        ForSale,
        Sold,
        Started,
        Running,
        Ended
    }
    
    struct Item {
        uint itemId;
        string name;
        address payable seller;
        address payable buyer;
        uint price;
        State state;
    }
    
    mapping(uint => Item) private items; // creates key value pair so we are able to retrieve an item based on its id 
    
    constructor() {
        owner = payable(msg.sender);
        startBlock = block.number;
        endBlock = startBlock + 1051200;
    }
    
    event LogForSale(uint itemId); 
    event LogSold(uint itemId);
    
    
    modifier paidEnough (uint _price) {
        require(msg.value >= _price, "Please submit the asking price in order to complete the purchase.");
        _;
    }
    
    modifier checkValue (uint _itemId) {
        _;
        uint _price = items[_itemId].price;
        uint amountToRefund = msg.value - _price;
        items[_itemId].buyer.transfer(amountToRefund);
    }
    
    modifier forSale(uint _itemId) {
        require (items[_itemId].state == State.ForSale
        && items[_itemId].itemId >= 0);
        _;
    }
    
    modifier sold(uint _itemId) {
        require (items[_itemId].state == State.Sold);
        _;
    }
    
     receive() external payable {
            require(msg.value == 1 wei);
        }
    
    function createMarketItem(string memory _name, uint _price) public payable nonReentrant {
        require(_price == 1 wei);
        
        items[_itemIds] = Item({
            name: _name,
            itemId: _itemIds,
            price: _price,
            state: State.ForSale,
            seller: payable(msg.sender),
            buyer: payable(address(0)) // this is an empty address because we don't have a buyer when we initialize 
            
         });
         _itemIds = _itemIds + 1;
          emit LogForSale(_itemIds);
        
    }
         
        function buyItem(uint itemId) public payable forSale(itemId) paidEnough(items[itemId].price) checkValue(itemId) nonReentrant {
         items[itemId].seller.transfer(items[itemId].price);
         items[itemId].buyer == msg.sender;
         items[itemId].state = State.Sold;
         emit LogSold(itemId);
         _itemsSold = _itemsSold + 1;
        }
}

