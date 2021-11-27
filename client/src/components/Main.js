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
          {/* <button className="btn-edit">Submit</button> */}
          <button className="btn-delete">Submit</button>
        </div>
      </form>
      <div>
      <h1>buy product</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Units</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            <tr>
              <th scope="row">1</th>
              <td>oil</td>
              <td>1 Eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td>150</td>
              <td><button className="btn-edit">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>copper</td>
              <td>3 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td>200</td>
              <td><button className="btn-edit">Buy</button></td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>silver</td>
              <td>0.5 eth</td>
              <td>0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9</td>
              <td>180</td>
              <td><button className="btn-edit">Buy</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
