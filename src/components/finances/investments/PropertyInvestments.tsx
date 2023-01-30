import React from 'react';
import { connect } from "react-redux";
import InvestmentsService from '../../../services/InvestmentsService';
import {
  Tab,
  Tablist,
  Pane,
} from 'evergreen-ui';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
ChartJS.register(LinearScale, PointElement, LineElement)
import { Line } from 'react-chartjs-2';

const options: any = {};

const data: any = {
  labels: [],
  datasets: [
    {
      label: 'Valuations',
      data: [],
      fill: false,
      backgroundColor: 'rgb(0, 128, 0)',
      borderColor: 'rgba(0, 128, 0, 0.2)',
    },
    // {
    //   label: 'Housing',
    //   data: [],
    //   fill: false,
    //   backgroundColor: 'rgb(128, 0, 0)',
    //   borderColor: 'rgba(128, 0, 0, 0.2)',
    // },
    // {
    //   label: 'Pet',
    //   data: [],
    //   fill: false,
    //   backgroundColor: 'rgb(0, 128, 128)',
    //   borderColor: 'rgba(0, 128, 128, 0.2)',
    // },
    // {
    //   label: 'Groceries',
    //   data: [],
    //   fill: false,
    //   backgroundColor: 'rgb(255, 128, 128)',
    //   borderColor: 'rgba(255, 128, 128, 0.2)',
    // },
    // {
    //   label: 'Car',
    //   data: [],
    //   fill: false,
    //   backgroundColor: 'rgb(0, 0, 128)',
    //   borderColor: 'rgba(0, 0, 128, 0.2)',
    // },
    // {
    //   label: 'Savings',
    //   data: [],
    //   fill: false,
    //   backgroundColor: 'rgb(128, 0, 128)',
    //   borderColor: 'rgba(128, 0, 128, 0.2)',
    // },
  ],
};

class PropertyInvestments extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await this.props.fetchProperties();
  }

  getReport() {
    const filled = JSON.parse(JSON.stringify(data));
    const grouped = this.state.selectedProperty.valuations
      .reduce((grouped:any, valuation:any) => {
        if(!grouped[valuation.date]) {
          grouped[valuation.date] = {
            average: 0,
            valuations: [],
          };
        }
        grouped[valuation.date].valuations.push(parseInt(valuation.valuation.amount));
        return grouped;
      }, {});
    Object.keys(grouped).forEach(date => {
      grouped[date].average = grouped[date].valuations.reduce((a: any,b:any) => a+b, 0) / grouped[date].valuations.length;
    });

    filled.labels = Object.keys(grouped);
    filled.datasets[0].data = filled.labels.map((i: any) => grouped[i].average);
    console.log("hej", filled)
    return filled;
  }

  getPropertyReport() {
    return <div>
      <h2>{this.state.selectedProperty.name}</h2>
      <Line data={this.getReport()} options={options} />
    </div>
  }

  render() {
    const properties = this.props.properties ?  Object.keys(this.props.properties).map(i => this.props.properties[i]) : [];

    return <div>
      <h1>Properties</h1>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {properties.map((property: any) => (
          <Tab
            key={property.id}
            onSelect={
              () => {
                this.props.fetchProperty(property.id);
                this.setState({...this.state, selectedProperty: property})
              }
            }
            isSelected={this.state.selectedProperty && property.id === this.state.selectedProperty.id} >
            {property.name}
          </Tab>
        ))}
      </Tablist>
      {this.state.selectedProperty ? this.getPropertyReport() : 'Select'}
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  ...state
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchProperties: () => dispatch(InvestmentsService.fetchProperties()),
  fetchProperty: (propertyId: string) => dispatch(InvestmentsService.fetchProperty(propertyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertyInvestments);
