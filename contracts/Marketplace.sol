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
        address payable owner;
        uint startBlock;
        uint endBlock;
        uint saleTotal;
        bool purchased;
    }
    mapping(uint => Item) public items; // creates key value pair so we are able to retrieve an item based on its properties
    
    event LogSold(uint sku, string itemName, uint qty, uint itemPrice, address payable owner, bool purchased);
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
      require(bytes(_itemName).length > 0);
      require(_itemPrice > 0);
      require(_qty > 0);
      skuCount = skuCount + 1;
        items[skuCount] = Item({ //adding Item to items mapping
            sku: skuCount,
            itemName: _itemName,
            itemPrice: _itemPrice,
            state: SaleState.Running,
            qty: _qty,
            itemsSold: 0,
            owner: payable(msg.sender),
            startBlock: block.number,
            endBlock:  block.number + 1051200,
            saleTotal: 0,
            purchased: false
            
        });
        emit LogForSale(skuCount);
        return true;
    }

        function buyItem(uint _sku, uint qty) public payable // purchase qty = 3, stock items[_sku].qty =10
            onSale(_sku)
            paidEnough(items[_sku].itemPrice, qty)
            checkValue(_sku,  qty)
            nonReentrant
        {
          // fetch the item to buy
            Item memory _item = items[skuCount];
          // fetch the owner
          address payable seller = _item.owner;
          // require that the buyer is not the seller
            require(seller != msg.sender);
           // transfer ownership to the buyer
           _item.owner = payable(msg.sender);
            require(items[_sku].state == SaleState.Running);
            require(qty <= items[_sku].qty);
            items[_sku].qty -= qty;
            items[_sku].itemsSold += qty;
          // update the product in the mapping
          items[skuCount] = _item;
          // mark as purchased
          items[_sku].purchased = true;
          // pay the seller by sending them ether
            uint totalPaid = items[_sku].itemPrice * qty;
            seller.transfer(msg.value);
            items[_sku].saleTotal += totalPaid;

            emit LogSold(_sku, _item.itemName, qty, _item.itemPrice, payable(msg.sender), true);
        }
}