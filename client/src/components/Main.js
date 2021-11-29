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
          console.log('conv price', convertedPrice)
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
              <th scope="col">Sku</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Units</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { props.items.map((item, key) => {
              return(
                <tr key = {key}>
                  <th scope="row">{item.sku.toString()}</th>
                  <td>{item.itemName}</td>
                  <td>{props.web3.utils.fromWei(item.itemPrice.toString(), 'Ether')} Eth</td>
                  <td>{item.owner}</td>
                  <td>{item.qty}</td>
                  <td>
                    <button className="btn-edit" 
                      name={item.sku}
                      value = {item.itemPrice}
                      onClick={(e) => {
                        props.purchaseItem(e.target.name, e.target.value)
                      }}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
