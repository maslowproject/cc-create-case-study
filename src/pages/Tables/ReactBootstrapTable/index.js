import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { loadModules } from '@esri/react-arcgis';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { selectSchool } from '../../../actions'

class ReactBootstrapTable extends Component {

  componentWillMount() {
    const component = this

    loadModules([
      "esri/tasks/support/Query",
      "esri/tasks/QueryTask",
    ]).then(([ Query, QueryTask ]) => {
      var query = new Query();
      query.outFields = ["*"];
      query.where = ""
      query.returnGeometry = true;

      var queryTask = new QueryTask({
        url: 'https://cohegis.houstontx.gov/cohgispub/rest/services/PD/Neighborhood_Services_wm/MapServer/0'
      });
    
      // Execute the query
      queryTask.execute(query)
      .then(function(result){
        const data = result.features.map(feature => {
          let featureData = feature.attributes
          featureData.geometry = feature.geometry

          return featureData
        })

        component.setState({ data })
      })
      .otherwise(function(e){
        console.log(e);
      });
    })
  }

  state = {
    data: null
  };

  showSchoolOnMap = row => {
    const { selectSchool, history } = this.props

    selectSchool(row.geometry)
    history.push('/')
  }

  render() {
    const { data } = this.state;
    const options = {
      sizePerPage: 20,
      prePage: 'Previous',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',
      hideSizePerPage: true,
      onRowDoubleClick: this.showSchoolOnMap
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4>Schools in the Houston Area</h4>
              </div>
              <div className="content">
                <BootstrapTable
                  data={data}
                  bordered={false}
                  striped
                  pagination={true}
                  options={options}>
                  <TableHeaderColumn
                    dataField='OBJECTID'
                    isKey
                    width="50px"
                    dataSort>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='CampName'
                    width="15%"
                    filter={ { type: 'TextFilter'} }
                    dataSort>
                    Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='DistName'
                    width="15%"
                    dataSort>
                    District
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='Score'
                    width="15%"
                    dataSort>
                    Score
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='GradeRange'
                    width="15%">
                    Grades
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='USER_School_Principal'
                    width="30%">
                    Principal
                  </TableHeaderColumn>
                  <TableHeaderColumn width="20%">
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default withRouter(connect(
  null,
  { selectSchool }
)(ReactBootstrapTable))