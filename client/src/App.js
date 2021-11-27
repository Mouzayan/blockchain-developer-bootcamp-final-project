import React, { Component } from 'react';
import MarketPlaceContract from './contracts/MarketPlace.json';
import getWeb3 from './getWeb3';
import Navbar from './components/Navbar';
import Main from './components/Main';
import './style/index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      account: '',
      skuCount: 0,
      items: [],
      loading: true,
    };
    this.createItem = this.createItem.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // reading user account state
      this.setState({ account: accounts[0] });
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(
        MarketPlaceContract.abi,
        MarketPlaceContract.networks[networkId].address
      );
      const networkData = MarketPlaceContract.networks[networkId];
      const marketplace = new web3.eth.Contract(
        MarketPlaceContract.abi,
        networkData && networkData.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance, loading : false }, this.runFunctionality);
      this.setState({ web3, accounts });
      this.setState({ marketplace })
      const itemCount = await marketplace.methods.skuCount().call()
      console.log(itemCount.toString())
      this.setState({ loading: false })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  createItem(name, price, quantity) {
    const { account, marketplace } = this.state;
    this.setState.loading({ loading: true })
    marketplace.methods
      .createMarketItem(name, price, quantity)
      .send({ from: account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  // handleClick(event){
  //   const contract = this.state.contract;
  //   const accounts = this.state.accounts;
  //   let value = 3
  //   contract.methods.set(value).send({ from: accounts[0] })
  //   .then(result => {
  //     return contract.methods.get().call()
  //   }).then(result => {
  //     return this.setState({storageValue: result})
  //   })
  // }

  // handleInputChange = (e) => {
  //   const target = e.target;
  //   const value = target.value;
  //   const inputValue = value.replace(/\D/g, '')
  //   this.setState({
  //     inputValue
  //   })
  // }

  // handleSubmit = (e) => {
  //   const contract = this.state.contract;
  //   const accounts = this.state.accounts;
  //   e.preventDefault()
  //   let value = this.state.inputValue
  //   contract.methods.set(value).send({ from: accounts[0] })
  //   .then(result => {
  //     return contract.methods.get().call()
  //   }).then(result => {
  //     return this.setState({storageValue: result})
  //   })
  // }

  isValid() {
    if (this.state.inputValue === '') return false;
    else return true;
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container">
        <Navbar account={this.state.account} />
        <div>
          {this.state.loading ? (
            <div>
              <p>"Loading..."</p>
            </div>
          ) : (
            <Main createItem={this.createItem} web3={this.state.web3} />
          )}
        </div>
      </div>
    );
  }
}
export default App;
