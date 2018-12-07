import React, { Component } from 'react';
import AccountDetails from './AccountDetails';
import ProgressBar from './ProgressBar';
import logo from '../images/single-logo.svg';
import trustLogo from '../images/trustLogo.png';

import '../styles/App.css';

window.balance = 0;

class App extends Component {
  
  state = {
    stakeConfirmation: false,
    withdrawConfirmation: false,
    claimConfirmation: false,
  }

  componentDidMount() {
    this.connectNode();
  }

  openStakeConfirmation = () => {
    this.setState({ stakeConfirmation: true });
  }

  closeStakeConfirmation = () => {
    this.setState({ stakeConfirmation: false });
  }

  openWithdrawConfirmation = () => {
    this.setState({ withdrawConfirmation: true });
  }

  closeWithdrawConfirmation = () => {
    this.setState({ withdrawConfirmation: false });
  }

  openClaimConfirmation = () => {
    this.setState({ claimConfirmation: true });
  }

  closeClaimConfirmation = () => {
    this.setState({ claimConfirmation: false });
  }

  connectNode = async () => {
    if (window.ethereum) {
      window.web3 = new window.Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        window.web3.eth.getAccounts(function(error, accounts) {
          if (!error) {
            window.web3.eth.getBalance(accounts[0], function(error, balance) {
              if (!error && balance) {
                window.balance = balance.toNumber() / 1000000000000000000;
              } else {
                console.error(error);
              }
            });
          } else {
            console.error(error);
          }
        });
      } catch (error) {
        console.log(error, 'Error: ')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <div className="App-container-logos">
            <a target="_blank" href="https://callisto.network" rel="noopener noreferrer">
              <figure className="App-container-figure">
                <img src={logo} alt="Clo logo" />
              </figure>
            </a>
            <a target="_blank" href="https://trustwallet.com" rel="noopener noreferrer">
              <figure className="App-container-figure">
                <img src={trustLogo} alt="Clo logo" />
              </figure>
            </a>
          </div>
          <div className="App-content square">
            <AccountDetails
              balance={window.balance}
              staked={2000000}
              reward={0}
              openStakeConfirmation={this.openStakeConfirmation}
              closeStakeConfirmation={this.closeStakeConfirmation}
              stakeConfirmation={this.state.stakeConfirmation}
              openWithdrawConfirmation={this.openWithdrawConfirmation}
              closeWithdrawConfirmation={this.closeWithdrawConfirmation}
              withdrawConfirmation={this.state.withdrawConfirmation}
              openClaimConfirmation={this.openClaimConfirmation}
              closeClaimConfirmation={this.closeClaimConfirmation}
              claimConfirmation={this.state.claimConfirmation}
            />
            <ProgressBar progress={62.1} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
