import React from 'react';

import './Main.scss';
import './Item.scss';

export default function Main (props) {
  return (
    <div className="home">
    <h1>Add Product</h1>
    <form onSubmit={(e) => {
      e.preventDefault()
      const name = this.itemName.value
      const price = window.web3.utils.toWei(this.itemPrice.value.toString(), 'Ether')
      const quantity = this.qty.value
      this.props.createItem(name, price, quantity)
    }}>
    <div className="snippet">
        <input
          id= "itemName"
          type= "text"
          ref={(input) => { this.itemName = input }}
          className= "title"
          placeholder= "Item Name"
          required />
    </div>

      {/* <input
        id = 'itemPrice'
        type = 'text'
        ref = {(input) => { this.itemPrice = input }}
        className = 'description'
        placeholder = 'Item Price'
        required /> */}

      {/* <input
        id = 'itemQuantity'
        type = 'text'
        ref = {(input) => { this.qty = input }}
        className = 'description'
        placeholder = 'Item Price'
        required /> */}
      
    
        <button className="btn-edit" >
          Edit
        </button>
        <button className="btn-delete" >
          Delete
        </button>
      </form>
    
      
      {/* <h1>Let's Make this Project Happen!</h1>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Enter the amount:
              <input
                type="text"
               // placeholder="enter only numbers..."
                value={this.state.inputValue}
                onChange={this.handleInputChange.bind(this)}
                errorMessage={ this.isValid() ? '' : "This field is required." }
              />
            </label>
            <button className="btn-editor-toggle" disabled={!this.isValid()} type="submit">Submit</button>
          </form>
        </div>
        <div>
          <button onClick={this.handleClick.bind(this)}>Set Storage</button>
        </div> */}
    </div>
  );
};

