import React from 'react';
import { Route } from 'react-router-dom';
import RegularTables from './RegularTables';
import ExtendedTables from './ExtendedTables';
import ReactBootstrapTable from './ReactBootstrapTable';

const Tables = ({match}) => (
  <div className="content">
    <ReactBootstrapTable />
  </div>
);

export default Tables;