import React, { Component } from 'react';
import './NodeMap.css';
import { NODE_URL } from '../defineUrl';

// 참고 : https://apis.map.kakao.com/web/sample/multipleMarkerEvent/

import {
	nodeListElem,
	sensorListElem,
	nodeHealthCheckElem,
} from '../ElemInterface/ElementsInterface';
import MapNodeTable from './Table/MapNodeTable';
declare global {
	interface Window {
		kakao: any;
	}
}

interface NodeMapProps {
	healthState: Map<number, number>;
	batteryState: Map<number, number>;
}

interface NodeMapState {
	nodeList: Array<nodeListElem>;
	map: any;
	left: number;
	right: number;
	up: number;
	down: number;
}

class NodeMap extends Component<NodeMapProps, NodeMapState> {
	state: NodeMapState = {
		nodeList: [],
		map: {},
		left: 126.93120847993194,
		right: 126.9814068917757,
		up: 37.504736714448086,
		down: 37.48669801512536,
	};
	componentDidMount = () => {
		var mapContainer = document.getElementById('node_map'); // 지도를 표시할 div
		var mapOption = {
			center: new window.kakao.maps.LatLng(
				37.49575158172499,
				126.95633291769067
			), // 지도의 중심좌표
			level: 5, // 지도의 확대 레벨
		};

		// 지도를 생성합니다
		var map = new window.kakao.maps.Map(mapContainer, mapOption);
		this.setState({ map: map });

		this.getnodeList(
			this.state.left,
			this.state.right,
			this.state.up,
			this.state.down,
		);

		// 드래그가 끝날 때 or 확대 수준이 변경되면
		window.kakao.maps.event.addListener(map, 'idle', () => {
			// 지도의 현재 영역을 얻어옵니다
			var bounds = map.getBounds();

			// 영역의 남서쪽 좌표를 얻어옵니다
			var swLatLng = bounds.getSouthWest();

			// 영역의 북동쪽 좌표를 얻어옵니다
			var neLatLng = bounds.getNorthEast();

			this.setState({
				left: swLatLng.getLng(), // left
				right: neLatLng.getLng(), // right
				up: neLatLng.getLat(), // up
				down: swLatLng.getLat(), // down
			});

			this.getnodeList(
				swLatLng.getLng(), // left
				neLatLng.getLng(), // right
				neLatLng.getLat(), // up
				swLatLng.getLat() // down
			);
		});
	};
	// Get node list from backend
	getnodeList(left: number, right: number, up: number, down: number) {
		var url =
			NODE_URL +
			'?left=' +
			left +
			'&right=' +
			right +
			'&up=' +
			up +
			'&down=' +
			down;
		fetch(url)
			.then((res) => res.json())
			.then((data) => this.setState({ nodeList: data }))
			.catch((error) => console.error('Error:', error));
	}

	// Make Marker
	displayMarker(position: any, map: any) {
		// 마커를 생성합니다
		/*var marker = new window.kakao.maps.Marker({
			map: map, // 마커를 표시할 지도
			position: position.latlng, // 마커의 위치
		});*/

		var marker = this.addMarker(position, map)

		// 마커에 표시할 custom overlay를 생성합니다
		var customOverlay = new window.kakao.maps.CustomOverlay({
			position: marker.getPosition(),
		});

		var content = document.createElement('div');

		var title = document.createElement('div');
		title.innerHTML = position.title;
		title.className = 'title';

		var closeBtn = document.createElement('button');

		closeBtn.onclick = function () {
			customOverlay.setMap(null);
		};
		closeBtn.className = 'close';
		closeBtn.type = 'button';
		title.appendChild(closeBtn);

		var body = document.createElement('div');

		for (var i = 0; i < 3; i++) {
			var bodyElem = document.createElement('div');
			bodyElem.appendChild(document.createTextNode(position.content[i]));
			body.insertAdjacentElement('beforeend', bodyElem);
		}

		body.className = 'body';

		var info = document.createElement('div');
		info.className = 'info';

		info.insertAdjacentElement('afterbegin', title);

		var wrap = document.createElement('div');
		wrap.className = 'wrap';
		wrap.insertAdjacentElement('afterbegin', info);
		title.insertAdjacentElement('afterend', body);
		content.insertAdjacentElement('afterbegin', wrap);

		customOverlay.setContent(content);

		window.kakao.maps.event.addListener(marker, 'click', function () {
			customOverlay.setMap(map);
		});
	}

	// order는 노드의 종류
	addMarker(position: any, map: any) {
		if ( position.kind  === 'streetlemp') var imageSrc = 'https://user-images.githubusercontent.com/50009240/111455569-4edede80-8759-11eb-952f-2df28fdcdc4c.png'
		else if ( position.kind === 'trashcan') var imageSrc = 'https://user-images.githubusercontent.com/50009240/111451567-e857c180-8754-11eb-9299-0ea55e430b17.png'
		else var imageSrc = 'https://user-images.githubusercontent.com/50009240/111451575-ebeb4880-8754-11eb-8459-eed8f0983c55.png'
		/*var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
			imageSize = new window.kakao.maps.Size(40 , 45),  // 마커 이미지의 크기
			/*imgOptions =  {
				spriteSize : new window.kakao.maps.Size(686, 759), // 스프라이트 이미지의 크기
				//spriteSize : new window.kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
				spriteOrigin : new window.kakao.maps.Point(0, 0), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
				//spriteOrigin : new window.kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
				offset: new window.kakao.maps.Point(0, 0) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
			},*/
		var imageSize = new window.kakao.maps.Size(30 , 35),
			markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize),
			//markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new window.kakao.maps.Marker({
				map: map,
				position: position.latlng, // 마커의 위치
				image: markerImage 
			});

		// marker.setMap(map); // 지도 위에 마커를 표출합니다
	
		return marker;
	}

	render() {
		var positions = this.state.nodeList.map((node: nodeListElem) => {
			return {
				title: node.name.split('-')[1] + '-' + node.name.split('-')[2],
				kind: node.name.split('-')[0],
				content: [
					'sink : ' + node.sink_id,
					'id : ' + node.id,
					'sensor : ' +
						node.sensors.map((sensor: sensorListElem) => sensor.name.split('-')[1]),
				],
				latlng: new window.kakao.maps.LatLng(node.lat, node.lng),
			};
		});

		for (var i = 0; i < positions.length; i++) {
			this.displayMarker(positions[i], this.state.map);
		}

		return (
			<div>
				<div>
					<div id="node_map" style={{ width: '100%', height: '500px' }}></div>
					<MapNodeTable
						nodeList={this.state.nodeList}
						healthState={this.props.healthState}
						batteryState={this.props.batteryState}
					></MapNodeTable>
				</div>
			</div>
		);
	}
}

export default NodeMap;
