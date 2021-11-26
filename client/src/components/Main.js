import React, { useState } from 'react';

import './Main.scss';
import './Item.scss';

export default function Main(props) {
  const [name, updateName] = useState('');
  const [price, updatePrice] = useState('');
  const [qty, updateQty] = useState('');

  return (
    <div className="home">
      <h1>add product</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const convertedPrice = props.web3.utils.toWei(price, 'Ether');
          props.createItem(name, convertedPrice, qty);
        }}
      >
        <div className="snippet">
          <div>
            <input
              id="itemName"
              type="text"
              value={name}
              onChange={(e) => updateName(e.target.value)}
              className="form-control"
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <input
              id="itemPrice"
              type="number"
              value={price}
              onChange={(e) => updatePrice(e.target.value)}
              className="form-control"
              placeholder="Enter item price"
              required
            />
          </div>
          <div>
            <input
              id="itemQuantity"
              type="number"
              value={qty}
              onChange={(e) => updateQty(e.target.value)}
              className="form-control"
              placeholder="Enter item quantity"
              required
            />
          </div>
          <button className="btn-edit">Submit</button>
          <button className="btn-delete">Delete</button>
        </div>
      </form>
    </div>
  );
}
