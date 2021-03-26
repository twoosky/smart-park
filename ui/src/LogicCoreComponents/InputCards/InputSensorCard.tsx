import React, { Component } from 'react';
import Select from 'react-select';
import {
	sensorOptionsElem,
	sensorListElem,
} from '../../ElemInterface/ElementsInterface';
import '../LogicCore.css';

interface InputSensorCardProps {
	sensorList: Array<sensorListElem>;
	handleInputSensorCardChange: (sensor: any) => void;
}

/*  
InputSensorCard
- Get input of sensor element
*/

class InputSensorCard extends Component<InputSensorCardProps, {}> {
	render() {
		/*const sensorOptions  = this.props.sensorList.map((val: sensorListElem) => {
			var name= val.name.split('-')[0];
			if (name === 'particulate matter' || name === 'temperature and humidity' || name === 'soil moisture' || name === 'ultrasound') {
				console.log(name + '#@##!#!!!@@!!!!!')
				return {
					label: val.name,
					value: val.name,
					id: val.id,
					sensor_values: val.sensor_values,
				};
			}
		},*/
		let sensorOptions: Array<sensorOptionsElem>;
		sensorOptions = this.props.sensorList.map((val: sensorListElem) => {
			return {
				label: val.name.split('-')[1],
				value: val.name.split('-')[1],
				id: val.id,
				sensor_values: val.sensor_values,
			};
		});
		return (
			<div className="card form-group">
				<div className="card-body row ">
					<div className="col-2 right-divider">
						<span style={{ fontSize: '18pt', fontWeight: 500 }}>sensor</span>
					</div>
					<div className="col-5">
						<Select
							name="sensor"
							options={sensorOptions}
							classNamePrefix="select"
							onChange={this.props.handleInputSensorCardChange}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default InputSensorCard;
