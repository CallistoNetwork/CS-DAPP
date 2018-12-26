import React, { Component } from 'react';
import PopPop from 'react-poppop';

class AccountDetails extends Component {

  state = {
    stakeConfirmation: false,
  };

  handleStake = (event) => {
    event.preventDefault();
    this.props.openStakeConfirmation();
  }

  submitStakeForm = (event) => {
    event.preventDefault();
    this.setState({ stakeConfirmation: true });
  }

  handleWithdraw = (event) => {
    event.preventDefault();
    this.props.openWithdrawConfirmation();
  }

  handleClaim = (event) => {
    event.preventDefault();
    this.props.openClaimConfirmation();
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
          <div><a className="btn-green" href="#stake" onClick={this.handleStake}>Start Staking</a></div>
          <div><a className="btn-green" href="#withdraw" onClick={this.handleWithdraw}>Withdraw</a></div>
          <div><a className="btn-green" href="#claim" onClick={this.handleClaim}>Claim Reward</a></div>
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
            <p className="App-stakeForm-subtitle">
              Your funds will be locked for 27 days and you will be unable to withdraw within the locking period
            </p>
            <input className="App-stakeForm-input" type='number' min={0} placeholder='Amount to stake' required />
            {!this.state.stakeConfirmation ? (
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
