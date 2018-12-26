import React, { Component } from 'react';
import AccountDetails from './AccountDetails';
import ProgressBar from './ProgressBar';
import logo from '../images/single-logo.svg';
import trustLogo from '../images/trustLogo.png';

import '../styles/App.css';

class App extends Component {
  
  state = {
    stakeConfirmation: false,
    withdrawConfirmation: false,
    claimConfirmation: false,
    error: '',
    address: '',
    balance: 0,
    onStaking: 0,
    reward: 0,
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

  setError = value => this.setState({ error: value });

  connectNode = async () => {
    if (window.ethereum) {
      window.web3 = new window.Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const $this = this;
        window.web3.eth.getAccounts(function(error, accounts, _this = $this) {
          if (!error) {
            $this.setState({ address: accounts[0] });
            window.web3.eth.getBalance(accounts[0], function(error, balance, __this = _this) {
              if (!error && balance) {
                __this.setState({
                  balance: balance.toNumber() / 1000000000000000000,
                  onStaking: 200000,
                  reward: 39000,
                });
              } else {
                __this.setState({ error });
              }
            });
          } else {
            this.setError(error)
          }
        });
      } catch (error) {
        this.setError(error)
      }
    } else {
      this.setError('Connection problems.');
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
          <div>
            {this.state.address ? (
              <div className="App-address">
                You are connected to address: <br />
                <strong>
                  {this.state.address}
                </strong>
              </div>
            ) : null}
          </div>
          <div className="App-content square">
            <AccountDetails
              balance={this.state.balance}
              staked={this.state.onStaking}
              reward={this.state.reward}
              openStakeConfirmation={this.openStakeConfirmation}
              closeStakeConfirmation={this.closeStakeConfirmation}
              stakeConfirmation={this.state.stakeConfirmation}
              openWithdrawConfirmation={this.openWithdrawConfirmation}
              closeWithdrawConfirmation={this.closeWithdrawConfirmation}
              withdrawConfirmation={this.state.withdrawConfirmation}
              openClaimConfirmation={this.openClaimConfirmation}
              closeClaimConfirmation={this.closeClaimConfirmation}
              claimConfirmation={this.state.claimConfirmation}
              address={this.state.address}
            />
            <ProgressBar progress={22} />
            {this.state.error ? (
              <div className="App-error">
                <span  className="App-error-text">
                  {this.state.error}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
