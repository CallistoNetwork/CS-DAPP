import React, { Component } from 'react';
import PopPop from 'react-poppop';
import abi from '../utils/csAbi';

class AccountDetails extends Component {

  state = {
    stakeConfirmation: false,
  };

  handleStake = event => {
    event.preventDefault();
    this.props.openStakeConfirmation();
  }

  submitStakeForm = event => {
    event.preventDefault();
    this.setState({ stakeConfirmation: true });
    this.startStaking(event.target[0].value);
  }

  handleWithdraw = event => {
    event.preventDefault();
    this.props.openWithdrawConfirmation();
  }

  handleClaim = event => {
    event.preventDefault();
    this.props.openClaimConfirmation();
  }

  startStaking = async (amount) => {
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
        web3.eth.getAccounts((error, accounts, _this = $this, _amount = amount) => {
          $this.setState({ address: accounts[0] });
          if (!error) {
            csContract.start_staking({
              from: accounts[0],
              gas: 200000,
              value: web3.toWei(_amount),
            }, (error, payback) => {
              if (!error) {
                _this.setState({
                  stakeConfirmation: false,
                }, () => window.location.reload())
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
      this.setError('Connection problems.');
    }
  }

  witdrawStake = async () => {
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
            csContract.withdraw_stake({
              gas: 200000,
            }, (error, payback) => {
              if (!error) {
                _this.setState({
                  stakeConfirmation: false,
                }, () => window.location.reload())
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
      this.setError('Connection problems.');
    }
  }

  clailReward = async () => {
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
            csContract.claim({
              gas: 200000,
            }, (error, payback) => {
              if (!error) {
                _this.setState({
                  stakeConfirmation: false,
                }, () => window.location.reload())
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
      this.setError('Connection problems.');
    }
  }

  render() {
    const { balance, staked, reward } = this.props;
    return (
      <div>
        <div className="App-content-head">
          <span className="App-content-head-title">Account Balance</span>
          <span className="App-content-head-title">Staking Balance</span>
          <span className="App-content-head-title">Reward</span>
        </div>
        <div className="App-content-details">
          <span className="App-content-head-title">{balance.toLocaleString()} CLO</span>
          <span className="App-content-head-title">{staked.toLocaleString()} CLO</span>
          <span className="App-content-head-title">{reward.toLocaleString()} CLO</span>
        </div>
        <div className="App-content-btns">
          {/*<div><a className="btn-green" href="#stake" onClick={this.handleStake}>Start Staking</a></div>*/}
          <div><a className="btn-green" href="#withdraw" onClick={this.handleWithdraw}>Withdraw</a></div>
          {/*<div><a className="btn-green" href="#claim" onClick={this.handleClaim}>Claim Reward</a></div>*/}
        </div>
        <PopPop
          open={this.props.stakeConfirmation}
          closeBtn={true}
          closeOnEsc={true}
          onClose={() => this.props.closeStakeConfirmation()}
          closeOnOverlay={true}
          position='centerCenter'
          className="App-modal"
          contentStyle={{
            maxWidth: '350px',
            width: '100%',
            padding: '1rem',
          }}
        >
          <form className="App-stakeForm" onSubmit={this.submitStakeForm}>
            <h3 className="App-stakeForm-title">How much will your stake be?</h3>
            {staked > 0 ? (
              <p className="App-stakeForm-subtitle warning">
                You already have funds in staking contract. You will lose your staking 
                reward if you make a new deposit into the contract. You should withdraw 
                your staking reward first or use a another account for a new staking deposit.
              </p>
            ) : null}
            <p className="App-stakeForm-subtitle">
              Your funds will be locked for 27 days and you will be unable to withdraw within the locking period
            </p>
            <input className="App-stakeForm-input" name="amountToStake" type='number' min={0} placeholder='Amount to stake' required />
            {this.state.stakeConfirmation ? (
              <input
                className="App-stakeForm-submit btn-green"
                value="Stake now!"
                type="submit"
              />
            ) : (
              <div className="App-stakeForm-confirmation">
                <p className="App-stakeForm-message">Are you sure ?</p>
                <div className="App-stakeForm-confirmation-content">
                  <a
                    className="App-stakeForm-submit btn-green"
                    href="#stakeConfirmation"
                    onClick={() => this.setState({ stakeConfirmation: true })}
                  > Yes, of course </a>
                  <a
                    className="App-stakeForm-submit btn-green"
                    href="#cancelStake"
                    onClick={() => {
                      this.setState({ stakeConfirmation: false });
                      this.props.closeStakeConfirmation();
                    }}
                  > No </a>
                </div>
              </div>
            )}
          </form>
        </PopPop>
        <PopPop
          open={this.props.withdrawConfirmation}
          closeBtn={true}
          closeOnEsc={true}
          onClose={() => this.props.closeWithdrawConfirmation()}
          closeOnOverlay={true}
          position='centerCenter'
          className="App-modal"
          contentStyle={{
            maxWidth: '350px',
            width: '100%',
            padding: '1rem',
          }}
        >
          <div className="App-stakeForm">
            <h3 className="App-stakeForm-title">Do you wanna withdraw all your staked CLO's ?</h3>
            <p className="App-stakeForm-subtitle">
              You will withdraw from the staking contract
            </p>
            <div className="App-stakeForm-confirmation-content">
              <a
                className="App-stakeForm-submit btn-green"
                href="#confirmWithdraw"
                onClick={() => {
                  this.witdrawStake();
                }}
              > Yes, i'm sure </a>
              <a
                className="App-stakeForm-submit btn-green"
                href="#cancelWithdraw"
                onClick={() => {
                  this.setState({ stakeConfirmation: false });
                  this.props.closeWithdrawConfirmation();
                }}
              > No </a>
            </div>
          </div>
        </PopPop>
        <PopPop
          open={this.props.claimConfirmation}
          closeBtn={true}
          closeOnEsc={true}
          onClose={() => this.props.closeClaimConfirmation()}
          closeOnOverlay={true}
          position='centerCenter'
          className="App-modal"
          contentStyle={{
            maxWidth: '350px',
            width: '100%',
            padding: '1rem',
          }}
        >
          <div className="App-stakeForm">
            <h3 className="App-stakeForm-title">Do you wanna claim your rewards?</h3>
            <p className="App-stakeForm-subtitle">
              After claiming the reward, your funds will be frozen for the next 27 days and you will be unable to claim new reward OR withdraw your funds during this period.
            </p>
            <div className="App-stakeForm-confirmation-content">
              <a
                className="App-stakeForm-submit btn-green"
                href="#confirmClaim"
                onClick={() => {
                  this.clailReward();
                }}
              > Yes, i'm sure </a>
              <a
                className="App-stakeForm-submit btn-green"
                href="#cancelClaim"
                onClick={() => {
                  this.setState({ stakeConfirmation: false });
                  this.props.closeClaimConfirmation();
                }}
              > No </a>
            </div>
          </div>
        </PopPop>
      </div>
    );
  }
}

export default AccountDetails;
