import React from 'react';
import { connect } from "react-redux";
import LongTermService from '../../../services/LongTermService';
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

class Savings extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchSavings()
  }

  calculateSummary(savings: any) {
    const summary: any = {};

    if(savings && savings.length) {
      savings.forEach((activity: any) => {
        if(activity.source && activity.source.type === 'Saving') {
          if(!summary[activity.source.id]) {
            summary[activity.source.id] = JSON.parse(JSON.stringify(activity.source));
            summary[activity.source.id].funds = {};
          }

          summary[activity.source.id].total =
            (summary[activity.source.id].total || 0) - activity.value.amount

          summary[activity.source.id].funds[activity.description] =
            (summary[activity.source.id].funds[activity.description] || 0) - activity.value.amount
        }

        if(activity.account && activity.account.type === 'Saving') {
          if(!summary[activity.account.id]) {
            summary[activity.account.id] = JSON.parse(JSON.stringify(activity.account));
            summary[activity.account.id].funds = {};
          }

          summary[activity.account.id].total =
            (summary[activity.account.id].total || 0) + activity.value.amount

          summary[activity.account.id].funds[activity.description] =
            (summary[activity.account.id].funds[activity.description] || 0) + activity.value.amount
        }
      });
    }

    const groupedByBank: any = {}
    Object.keys(summary).map(key => summary[key]).forEach((account: any) => {
      if(!groupedByBank[account.bank]) {
        groupedByBank[account.bank] = []
      }
      groupedByBank[account.bank].push(account);
    })
    return groupedByBank;
  }

  render() {
    const summary: any = this.calculateSummary(this.props.longTerm.savings);
    return <div>
      <h1>Savings</h1>
      {
        Object.keys(summary).map(bank =>
          <div>
            <h2>{bank}</h2>
              {
                summary[bank].map((account: any) =>
                  <div>
                    <h3>{account.name}</h3>
                    Total: {account.total.toFixed(2)} €
                    <Table>
                      <Table.Body>
                        {
                          Object.keys(account.funds).map(fund =>
                            <Table.Row>
                              <Table.TextCell>
                                {fund}
                              </Table.TextCell>
                              <Table.TextCell>
                                {account.funds[fund]} €
                              </Table.TextCell>
                            </Table.Row>
                          )
                        }
                      </Table.Body>
                    </Table>
                  </div>
                )
              }
          </div>
        )
      }
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchSavings: () => dispatch(LongTermService.loadSavings())
});

export default connect(mapStateToProps, mapDispatchToProps)(Savings);
