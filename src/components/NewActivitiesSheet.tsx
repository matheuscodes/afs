import React from 'react'
import { Button, SideSheet, Heading, Paragraph, Pane, TextInputField, SelectField } from 'evergreen-ui'
import { Activity, Currency } from '../models/Activity'

function isFloat(n: any){
  return Number(n) === n && n % 1 !== 0;
}

function clone(obj: any) {
  const copy = JSON.parse(JSON.stringify(obj));
  copy.date = new Date(copy.date);
  return copy;
}

const emptyActivity: any = {
  date: new Date(),
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
    this.state.activities.forEach(activity => this.props.submitActivity(activity));
    this.setState({
      isShown: !this.state.isShown,
      activities: [],
    });
  }

  render() {
    return (
      <Button margin={10} onClick={() => this.setState({ isShown: true })}>
        {"New Activities"}
        <SideSheet
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
                  value={activity.date.toJSON().substring(0,10)}
                  onChange={(e: any) => {
                    activity.date = new Date(e.target.value);
                    this.setState(this.state);
                  }} />
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
              </Pane>)}
          </Pane>
        </SideSheet>
      </Button>
    );
  }
}
