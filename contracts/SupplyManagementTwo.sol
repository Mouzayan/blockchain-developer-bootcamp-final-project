// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is ReentrancyGuard, Ownable {
    uint public startBlock; // itemSaleStartDate
    uint public endBlock; // itemSaleEndDate
    uint private skuCount;
    uint private _itemsSold;
    uint public saleTotal;
    uint public saleIncrement;
    SaleState public saleState; 
    
    enum ItemState {
        ForSale,
        Sold
    }
    
    enum SaleState {
        Started,
        Running,
        Ended
    }
    
    struct Item {
        uint sku;
        uint itemId;
        string itemName;
        address payable seller;
        address payable buyer;
        uint itemPrice;
        uint startBlock;
        uint endBlock;
        uint qty;
        ItemState state;
    }
    
    mapping(string => Item) private items; // creates key value pair so we are able to retrieve an item based on its properties
    mapping(address => uint) public purchasedAmt; // how many did each address buy
    
    constructor() {
        saleState = SaleState.Running;
        
        startBlock = block.number;
        endBlock = startBlock + 1051200;
        
        saleTotal = 0;
    }
    
    
    event LogForSale(uint sku); 
    event LogSold(uint sku);
    
    modifier afterStart(){
        require(block.number >= startBlock);
        _;
    }
    
    modifier beforeEnd(){
        require(block.number <= endBlock);
        _;
    }
    
    
    modifier paidEnough (uint _itemPrice, uint _qty) {
        require(msg.value >= _itemPrice * _qty, "Please submit the asking price in order to complete the purchase.");
        _;
    }
    
    modifier checkValue (uint _sku) {
        _;
        uint _itemPrice = items[_sku].itemPrice;
        uint _qty = items[_sku].qty;
        uint amountToRefund = msg.value - (_itemPrice * _qty);
        items[_sku].buyer.transfer(amountToRefund);
    }
    
    modifier forSale(uint _sku) {
        require (items[_sku].state == ItemState.ForSale
        && items[_sku].sku >= 0);
        _;
    }
    
    modifier sold(uint _sku) {
        require (items[_sku].state == ItemState.Sold);
        _;
    }
    
    function createMarketItem(string memory _itemName, uint _itemPrice, uint _qty) payable public nonReentrant returns (bool) {
        items[skuCount] = Item({
            itemName: _itemName,
            itemId: skuCount,
            itemPrice: _itemPrice,
            state: ItemState.ForSale,
            qty: _qty,
            seller: payable(msg.sender),
            buyer: payable(address(0)), // this is an empty address because we don't have a buyer when we initialize 
            startBlock: block.number,
            endBlock: startBlock + 1051200
         });
        skuCount = skuCount + 1;
         emit LogForSale(skuCount);
         return true;
    }
    
        function buyItem(uint sku, string memory itemName, uint qty) public payable afterStart beforeEnd forSale(sku) paidEnough(items[sku].itemPrice, items[sku].qty) checkValue(sku) nonReentrant {
         require(saleState == SaleState.Running);
         uint _qty = items[_sku].qty;
         require(_qty <= items[sku].qty);
         uint totalPaid;
         totalPaid = items[sku].itemPrice * _qty;
         items[sku].seller.transfer(items[sku].itemPrice * _qty);
         items[sku].buyer == msg.sender;
         items[sku].state = ItemState.Sold;
         items[sku].qty -= _qty; // current value in struct minus purchased qty
         
         saleTotal = saleTotal + totalPaid;
         
         emit LogSold(sku);
         _itemsSold = _itemsSold + _qty;
         
        }
        
        function finalizeSale() public onlyOwner {
            require(block.number > endBlock);
            
            address payable owner;
            address payable recipient;
            uint value;
            
            if (msg.sender == owner) {
                recipient = owner;
                value = saleTotal;
            }
            recipient.transfer(value);
        }
}