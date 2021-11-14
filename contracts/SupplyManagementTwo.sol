pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ReentrancyGuard {
    address public owner;
    uint public startBlock; // itemOfferingStartDate
    uint public endBlock; // itemOfferingEndDate
    uint private _itemIds;
    uint private _itemsSold;
    
    enum ItemState {
        ForSale,
        Sold
    }
    
    enum SotckOfferingState {
        Started,
        Running,
        Ended
    }
    
    struct Item {
        uint itemId;
        string itemName;
        address payable seller;
        address payable buyer;
        uint value;
        ItemState state;
        uint startBlock;
        uint endBlock;
    }
    
    mapping(uint => Item) private items; // creates key value pair so we are able to retrieve an item based on its properties
    
    constructor() payable {
        owner = msg.sender;
    }
    
    event LogForSale(uint itemId); 
    event LogSold(uint itemId);
    
    
    modifier paidEnough (uint _value) {
        require(msg.value >= _value, "Please submit the asking price in order to complete the purchase.");
        _;
    }
    
    modifier checkValue (uint _itemId) {
        _;
        uint _value = items[_itemId].value;
        uint amountToRefund = msg.value - _value;
        items[_itemId].buyer.transfer(amountToRefund);
    }
    
    modifier forSale(uint _itemId) {
        require (items[_itemId].state == ItemState.ForSale
        && items[_itemId].itemId >= 0);
        _;
    }
    
    modifier sold(uint _itemId) {
        require (items[_itemId].state == ItemState.Sold);
        _;
    }
    
    //  receive() external payable {
    //         require(msg.value >= value);
    //     }
    
    function createMarketItem(string memory _itemName, uint _value) payable public nonReentrant {
        items[_itemIds] = Item({
            itemName: _itemName,
            itemId: _itemIds,
            value: _value,
            state: ItemState.ForSale,
            seller: payable(msg.sender),
            buyer: payable(address(0)), // this is an empty address because we don't have a buyer when we initialize 
            startBlock: block.number,
            endBlock: startBlock + 1051200
         });
         _itemIds = _itemIds + 1;
         emit LogForSale(_itemIds);
    }
         
        function buyItem(uint itemId) public payable forSale(itemId) paidEnough(items[itemId].value) checkValue(itemId) nonReentrant {
         items[itemId].seller.transfer(items[itemId].value);
         items[itemId].buyer == msg.sender;
         items[itemId].state = ItemState.Sold;
         emit LogSold(itemId);
         _itemsSold = _itemsSold + 1;
        }
}
