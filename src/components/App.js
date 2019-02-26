import React, { Component } from 'react';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
import AccountDetails from './AccountDetails';
import ProgressBar from './ProgressBar';
import logo from '../images/single-logo.svg';
import trustLogo from '../images/trustLogo.png';
import abi from '../utils/csAbi';
import '../styles/App.css';

let connectionInterval;

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
    roundInterval: 27,
    daysPassed: 0,
    conectionError: 0,
    NodeConnected: false,
  }

  componentDidMount() {
    connectionInterval = setInterval(this.connectNode, 1000);
    this.setError('Connecting to Callisto network');
  }

  componentDidUpdate() {
    if (this.state.NodeConnected) {
      clearInterval(connectionInterval);
    } else if (this.state.conectionError > 5 && this.state.error === 'Connecting to Callisto network') {
      clearInterval(connectionInterval);
      this.setError('Error conecting callisto network');
    }
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

  daysPassed = (date1) => {
    const date2 = new Date();
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  setError = value => this.setState({ error: value });

  connectNode = async () => {
    let web3 = window.web3;
    if (window.ethereum || web3.currentProvider) {
      if (window.ethereum) {
        web3 = new window.Web3(window.ethereum);
      } else {
        web3 = new window.Web3(web3.currentProvider);
      }
      try {
        if (window.ethereum) {
          await window.ethereum.enable();
        }
        const csContract = await web3.eth.contract(abi).at('0xd813419749b3c2cDc94A2F9Cfcf154113264a9d6');
        const $this = this;
        web3.eth.getAccounts((error, accounts, _this = $this) => {
          $this.setState({ address: accounts[0] });
          if (!error) {
            clearInterval(connectionInterval);
            _this.setError('');
            csContract.round_interval((error, roundInterval) => {
              if (!error) {
                _this.setState({
                  roundInterval: roundInterval / 86400,
                });
              } else {
                console.log(error)
              } 
            });
            csContract.staker(accounts[0], (error, staker) => {
              if (!error) {
                _this.setState({
                  onStaking: web3.fromWei(staker[0]),
                  daysPassed: _this.daysPassed(new Date(staker[1].toNumber() * 1000)),
                });
              } else {
                console.log(error)
              } 
            });
            csContract.stake_reward(accounts[0], (error, reward) => {
              if (!error) {
                _this.setState({
                  reward: web3.fromWei(reward).toFixed(3),
                })
              } else {
                console.log(error)
              }
            });
            web3.eth.getBalance(accounts[0], (error, balance, __this = _this) => {
              if (!error && balance) {
                __this.setState({
                  balance: web3.fromWei(balance).toFixed(3),
                });
              } else {
                console.log(error)
              }
            });
          } else {
            console.log(error)
          }
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      this.setState({ conectionError: this.state.conectionError + 1 })
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
              daysPassed={this.state.daysPassed}
              roundInterval={this.state.roundInterval}
            />
            <ProgressBar progress={this.state.roundInterval === 0 ? 0 : ((this.state.daysPassed * 100) / this.state.roundInterval).toFixed(0)} />
            {this.state.error ? (
              <div className="App-error">
                {this.state.error === 'Connecting to Callisto network' ?
                  (
                    <span className="App-orange-text">
                      {this.state.error}
                    </span>
                  ) : (
                    <span className="App-error-text">
                      {this.state.error}
                    </span>
                  )
                }
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
