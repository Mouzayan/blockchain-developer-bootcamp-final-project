// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketPlace is ReentrancyGuard, Ownable {
    uint public skuCount = 0;
    uint public salesCount = 0; //to keep track of how many purchases are stored in the mapping

    enum SaleState {
        Started,
        Running,
        Ended
    }
    struct Item {
        uint sku;
        string itemName;
        uint itemPrice;
        SaleState state;
        uint qty;
        uint itemsSold;
        address payable seller;
        uint startBlock;
        uint endBlock;
        uint saleTotal;
    }
    mapping(uint => Item) public items; // creates key value pair so we are able to retrieve an item based on its properties
    
    event LogSold(uint sku, uint qty, address buyer);
    event LogForSale(uint sku); 
    
    
    modifier onSale(uint _sku){
        require(items[_sku].startBlock <= block.number);
        require(items[_sku].endBlock >= block.number);
        require (items[_sku].state == SaleState.Running);
        require (items[_sku].sku > 0);
        _;
    }
    
    modifier paidEnough (uint _itemPrice, uint qty) {
        require(msg.value >= _itemPrice * qty, "Please submit the asking price in order to complete the purchase.");
        _;
    }
    
    
    modifier checkValue (uint _sku, uint _qty) {
        _;
        uint _itemPrice = items[_sku].itemPrice;
        uint amountToRefund = msg.value - (_itemPrice * _qty);
        payable(msg.sender).transfer(amountToRefund);
    }

    
    function createMarketItem(string memory _itemName, uint _itemPrice, uint _qty) payable public
        nonReentrant returns (bool)
    {
        items[skuCount] = Item({ //adding Item to items mapping
            sku: skuCount,
            itemName: _itemName,
            itemPrice: _itemPrice,
            state: SaleState.Running,
            qty: _qty,
            itemsSold: 0,
            seller: payable(msg.sender),
            startBlock: block.number,
            endBlock:  block.number + 1051200,
            saleTotal: 0
            
        });
        skuCount = skuCount + 1;
        emit LogForSale(skuCount);
        return true;
    }
    
        function buyItem(uint _sku, uint qty) public payable // purchase qty = 3, stock items[_sku].qty =10
            onSale(_sku)
            
            paidEnough(items[_sku].itemPrice, qty)
            checkValue(_sku,  qty)
            nonReentrant
        {
            require(items[_sku].state == SaleState.Running);
            require(qty <= items[_sku].qty);
            items[_sku].qty -= qty;
            items[_sku].itemsSold += qty;
            //items[_sku].buyer[msg.sender] += qty; // updating the total amount that msg.sender has purchased
             
            uint totalPaid = items[_sku].itemPrice * qty;
            items[_sku].seller.transfer(totalPaid);
            items[_sku].saleTotal += totalPaid;
             
            emit LogSold(_sku, qty, msg.sender);
        }
}