import React from 'react';
import { connect } from "react-redux";
import HomeService from '../../services/HomeService';
import { Home, MeterMeasurement } from '../../models/Home'
import {
  Tab,
  Tablist,
  Pane,
  Table,
  Heading,
} from 'evergreen-ui'

const ColumnFlex = {
  name: 2,
  data: 3,
}

class WaterAndHeatingBill extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { bill } = this.props;

    return <Pane
      elevation={2}
      width={'46%'}
      display={'inline-block'}
      padding={12}
      margin={'2%'}
      justifyContent="center"
      alignItems="center">
      <Table border>
        <Table.Head accountForScrollbar={false}>
          <Table.TextHeaderCell>
            Water and Heating bill {this.props.year}
          </Table.TextHeaderCell>
          {
            bill.payments ?
            <Table.TextHeaderCell>
              <strong>Bill: </strong>
              {(bill.cost.total.amount - bill.payments.sum.amount).toFixed(2) + bill.payments.sum.currency}
            </Table.TextHeaderCell> : ''
          }
        </Table.Head>
        {
          bill.cold ?
            <Table.Row height={'auto'}>
              <Table.TextCell flex={ColumnFlex.name}>
                <strong>Cold water</strong>
              </Table.TextCell>
              <Table.TextCell flex={ColumnFlex.data}>
                {bill.cold.base ? `${bill.cold.base}m² + ` : ''}
                {bill.cold.consumption}m³ = {bill.cold.cost.total.amount.toFixed(2) + bill.cold.cost.total.currency}
              </Table.TextCell>
            </Table.Row>
          : ''
        }
        {
          bill.warm ?
            <Table.Row height={'auto'}>
              <Table.TextCell flex={ColumnFlex.name}>
                <strong>Warm water</strong>
              </Table.TextCell>
              <Table.TextCell flex={ColumnFlex.data}>
                {bill.warm.base ? `${bill.warm.base}m² + ` : ''}
                {bill.warm.consumption}m³ = {bill.warm.cost.total.amount.toFixed(2) + bill.warm.cost.total.currency}
              </Table.TextCell>
            </Table.Row>
          : ''
        }

        {
          bill.heaters ?
            <Table.Row height={'auto'}>
              <Table.TextCell flex={ColumnFlex.name}>
                <strong>Heaters</strong><br/>
                {bill.heaters.map( (heater: any, index: number) =>
                  <div style={{float:'right'}} key={`heater-list-${index}`}>{heater.location}</div>
                )}
              </Table.TextCell>
              <Table.TextCell flex={ColumnFlex.data}>
                <br/>
                {bill.heaters.map( (heater: any, index: number) =>
                  <div key={`heater-cost-${index}`}>
                    {heater.base ? `${heater.base}m² + ` : ''}
                    {heater.consumption} = {heater.cost.total.amount.toFixed(2) + heater.cost.total.currency}
                  </div>
                )}
              </Table.TextCell>
            </Table.Row>

          : ''
        }
        <Table.Row height={'auto'}>
          <Table.TextCell flex={ColumnFlex.name}>
            <strong>Total costs</strong>
          </Table.TextCell>
          <Table.TextCell flex={ColumnFlex.data}>
            {bill.cost.total.amount.toFixed(2) + bill.cost.total.currency}
          </Table.TextCell>
        </Table.Row>
        { bill.payments ?
          <Table.Row height={'auto'}>
            <Table.TextCell><strong>Total payment</strong></Table.TextCell>
            <Table.TextCell>{bill.payments.sum.amount.toFixed(2) + bill.payments.sum.currency}</Table.TextCell>
          </Table.Row> : '' }
      </Table>
    </Pane>
  }
}

export default WaterAndHeatingBill;
