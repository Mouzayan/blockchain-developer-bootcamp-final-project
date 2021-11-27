**<h1 style="color:#A2FF33">Security measures used in smart contract:</h1>**

**<h3 style="color:#FFC733">Reentrancy Guard</h3>** 
Modifier that prevents nested calls to functions.

**<h3 style="color:#FFC733">Avoiding use of Tx.Origin</h3>** 
Protecting the address of the account that sent a transaction by using msg.sender instad of tx.origin.