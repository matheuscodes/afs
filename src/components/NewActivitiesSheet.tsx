import React from 'react'
import { Button, SideSheet, Heading, Paragraph, Pane, TextInputField, SelectField, Checkbox } from 'evergreen-ui'
import { Activity, Currency } from '../models/Activity'

function isFloat(n: any){
  return Number(n) === n && n % 1 !== 0;
}

function clone(obj: any) {
  const copy = JSON.parse(JSON.stringify(obj));
  return copy;
}

const emptyActivity: any = {
  date: new Date().toJSON().substring(0,10),
  source: "",
  description: "",
  value: {
    amount: 0,
    currency: Currency.EUR,
  },
}

interface NewActivitiesSheetState {
  isShown: boolean,
  activities: Activity[],
}

export default class NewActivitiesSheet extends React.Component<any, NewActivitiesSheetState> {
  constructor(props: any) {
    super(props);

    this.state = this.initialState();
  }

  initialState() {
    return {
      isShown: false,
      activities: [clone(emptyActivity)]
    }
  }

  toggleSideSheet() {
    this.setState({
      isShown: !this.state.isShown,
      activities: this.state.activities,
    });
  }

  addEmptyActivity() {
    this.state.activities.push(clone(emptyActivity));
    this.setState(this.state);
  }

  submitActivities() {
    this.state.activities.forEach(activity => {
      activity.account = (activity.account || this.defaultAccount());
      activity.date = new Date(activity.date);
      this.props.submitActivity(activity);
    });
    this.setState({
      isShown: !this.state.isShown,
      activities: [],
    });
  }

  defaultAccount() {
    return this.props.accounts ? Object.keys(this.props.accounts)[0] : undefined
  }

  accountSelector(value: any, changeFunction: function) {
    return (
      <SelectField
        padding={5}
        flex={2}
        label="Account"
        value={value}
        onChange={changeFunction} >
        {
          Object.keys(this.props.accounts || {})
            .map(account =>
              <option key={account} value={account}>
                {this.props.accounts[account].name} ({this.props.accounts[account].type})
              </option>
            )
        }
      </SelectField>
    )
  }

  render() {
    return (
      <Button margin={10} onClick={() => this.setState({ isShown: true })}>
        {"New Activities"}
        <SideSheet
          width={1024}
          isShown={this.state.isShown}
          onCloseComplete={() => this.toggleSideSheet()} >
          <Pane margin={40}>
            <Heading margin={5} size={700} marginTop="default">New Activities</Heading>
            <Button margin={5} onClick={() => this.addEmptyActivity()}>Add</Button>
            <Button margin={5} onClick={() => this.submitActivities()}>Submit</Button>
            {this.state.activities.map((activity, index) => <Pane key={index} display="flex">
                <TextInputField
                  padding={5}
                  isInvalid={isNaN(new Date(activity.date).getTime())}
                  flex={2}
                  label="Date"
                  value={activity.date}
                  onChange={(e: any) => {
                    activity.date = e.target.value;
                    this.setState(this.state);
                  }} />
                {
                  activity.transfer ?
                  this.accountSelector(activity.source, (e: any) => {
                    activity.source = e.target.value;
                    this.setState(this.state);
                  }) :
                  <TextInputField
                    padding={5}
                    isInvalid={!activity.source}
                    flex={3}
                    label="Source"
                    value={activity.source}
                    onChange={(e: any) => {
                      activity.source = e.target.value;
                      this.setState(this.state);
                    }} />
                }
                <TextInputField
                  padding={5}
                  isInvalid={!activity.description}
                  flex={3}
                  label="Description"
                  value={activity.description}
                  onChange={(e: any) => {
                    activity.description = e.target.value;
                    this.setState(this.state);
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={isNaN(parseFloat(`${activity.value.amount}`))}
                  flex={1}
                  label="Amount"
                  value={activity.value.amount}
                  onChange={(e: any) => {
                    activity.value.amount = e.target.value;
                    this.setState(this.state);
                  }} />
                <SelectField
                  padding={5}
                  flex={1}
                  label="Currency"
                  value={activity.value.currency}
                  onChange={(e: any) => {
                    activity.value.currency = e.target.value as Currency;
                    this.setState(this.state);
                  }} >
                  {Object.keys(Currency).map(currency => <option key={currency} value={currency}>{currency}</option>)}
                </SelectField>
                {this.accountSelector(activity.account, (e: any) => {
                  activity.account = e.target.value;
                  this.setState(this.state);
                })}
                <Checkbox
                  label="Transfer"
                  marginTop={36}
                  checked={activity.transfer}
                  onChange={(e: any) => {
                    activity.transfer = e.target.checked;
                    if(activity.transfer) {
                      activity.source = this.defaultAccount();
                    } else {
                      activity.source = "";
                    }
                    this.setState(this.state);
                  }} />
              </Pane>)}
          </Pane>
        </SideSheet>
      </Button>
    );
  }
}
