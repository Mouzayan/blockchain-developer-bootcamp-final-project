import React, { Component } from "react";
import MarketPlaceContract from "./contracts/MarketPlace.json";
import getWeb3 from "./getWeb3";

import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      account: '',
      inputValue: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // reading user account state
      this.setState({ account: accounts[0] })
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketPlaceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketPlaceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result. --reset
    this.setState({ storageValue: response  });
  };

  handleClick(event){
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    let value = 3
    contract.methods.set(value).send({ from: accounts[0] })
    .then(result => {
      return contract.methods.get().call()
    }).then(result => {
      return this.setState({storageValue: result})
    })
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const inputValue = value.replace(/\D/g, '')
    this.setState({
      inputValue
    })
  }

  handleSubmit = (e) => {
    const contract = this.state.contract;
    const accounts = this.state.accounts;
    e.preventDefault()
    let value = this.state.inputValue
    contract.methods.set(value).send({ from: accounts[0] })
    .then(result => {
      return contract.methods.get().call()
    }).then(result => {
      return this.setState({storageValue: result})
    })
  }

  isValid() {
    if (this.state.inputValue === '') return false
    else return true
   }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <h1>Let's Make this Project Happen!</h1>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>
          <p>Your account address is: {this.state.account}</p>
        </div>
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
            <button disabled={!this.isValid()} type="submit">Submit</button>
          </form>
        </div>
        <div>
          <button onClick={this.handleClick.bind(this)}>Set Storage</button>
        </div>
      </div>
    );
  }
} 

export default App;
