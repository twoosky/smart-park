import React, { Component } from 'react';
import RegisterSink from './Register/RegisterSink';
import SinkTable from './Table/SinkTable';

/*
SinkManagement
- Manage sink table, register sink
*/
const SinkManagement: React.FunctionComponent = () => {
	return (
		<>
			<div style={{ float: 'right' }}>
				<button
					type="button"
					className="btn btn-success my-2 my-sm-0"
					data-toggle="modal"
					data-target="#register-sink-modal"
					style={{ background: 'light' }}
				>
					register sink
				</button>
				<RegisterSink />
			</div>
			<div>
				<h3>Sink</h3>
				<SinkTable />
			</div>
		</>
	);
};

export default SinkManagement;
