import React from 'react'
import { Button, SideSheet, Heading, Pane, TextInputField, SelectField, Checkbox } from 'evergreen-ui'
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
  activities: NewActivity[],
}

interface NewActivity extends Activity {
  _id: number;
}

export default class NewActivitiesSheet extends React.Component<any, NewActivitiesSheetState> {
  private nextActivityId: number = 0;

  constructor(props: any) {
    super(props);

    this.state = this.initialState();
  }

  createEmptyActivity() {
    return {
      ...clone(emptyActivity),
      _id: this.nextActivityId++,
    } as NewActivity;
  }

  initialState() {
    return {
      isShown: false,
      activities: [this.createEmptyActivity()]
    }
  }

  toggleSideSheet() {
    this.setState((previousState) => ({
      ...previousState,
      isShown: !previousState.isShown,
    }));
  }

  addEmptyActivity() {
    this.setState((previousState) => ({
      ...previousState,
      activities: [...previousState.activities, this.createEmptyActivity()],
    }));
  }

  submitActivities() {
    this.state.activities.forEach((activity) => {
      activity.account = activity.account || this.defaultAccount() || "";
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

  accountSelector(value: any, changeFunction: (e: any) => void) {
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

  updateActivity(index: number, updater: (activity: NewActivity) => NewActivity) {
    this.setState((previousState) => ({
      ...previousState,
      activities: previousState.activities.map((activity, currentIndex) => {
        if (currentIndex !== index) {
          return activity;
        }
        return updater({ ...activity });
      }),
    }));
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
            {this.state.activities.map((activity, index) => <Pane key={activity._id} display="flex">
                <TextInputField
                  padding={5}
                  isInvalid={Number.isNaN(new Date(activity.date).getTime())}
                  flex={2}
                  label="Date"
                  value={`${activity.date}`}
                  onChange={(e: any) => {
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      date: e.target.value,
                    }));
                  }} />
                {
                  activity.transfer ?
                  this.accountSelector(activity.source, (e: any) => {
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      source: e.target.value,
                    }));
                  }) :
                  <TextInputField
                    padding={5}
                    isInvalid={!activity.source}
                    flex={3}
                    label="Source"
                    value={activity.source}
                    onChange={(e: any) => {
                      this.updateActivity(index, (nextActivity) => ({
                        ...nextActivity,
                        source: e.target.value,
                      }));
                    }} />
                }
                <TextInputField
                  padding={5}
                  isInvalid={!activity.description}
                  flex={3}
                  label="Description"
                  value={activity.description}
                  onChange={(e: any) => {
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      description: e.target.value,
                    }));
                  }} />
                <TextInputField
                  padding={5}
                  isInvalid={Number.isNaN(Number.parseFloat(String(activity.value.amount)))}
                  flex={1}
                  label="Amount"
                  value={activity.value.amount}
                  onChange={(e: any) => {
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      value: {
                        ...nextActivity.value,
                        amount: e.target.value,
                      },
                    }));
                  }} />
                <SelectField
                  padding={5}
                  flex={1}
                  label="Currency"
                  value={activity.value.currency}
                  onChange={(e: any) => {
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      value: {
                        ...nextActivity.value,
                        currency: e.target.value as Currency,
                      },
                    }));
                  }} >
                  {Object.keys(Currency).map(currency => <option key={currency} value={currency}>{currency}</option>)}
                </SelectField>
                {this.accountSelector(activity.account, (e: any) => {
                  this.updateActivity(index, (nextActivity) => ({
                    ...nextActivity,
                    account: e.target.value,
                  }));
                })}
                <Checkbox
                  label="Transfer"
                  marginTop={36}
                  checked={activity.transfer}
                  onChange={(e: any) => {
                    const transfer = e.target.checked;
                    this.updateActivity(index, (nextActivity) => ({
                      ...nextActivity,
                      transfer,
                      source: transfer ? this.defaultAccount() || "" : "",
                    }));
                  }} />
              </Pane>)}
          </Pane>
        </SideSheet>
      </Button>
    );
  }
}
