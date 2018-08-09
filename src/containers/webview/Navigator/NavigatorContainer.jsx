import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Helmet } from 'react-helmet';

import geolocationWrapper from '../Zerking/setGeolocation.js';
import Map from '../Zerking/Map.jsx';
import Marker from '../Zerking/Marker.jsx';
import StageSelector from '../Zerking/StageSelector.jsx';

import PoiContaier from '../Zerking/PoiContaier.jsx';
import PoiFilterContainer from './PoiFilterContainer.jsx';
import withFilteredPoiTypes from './withFilteredPoiTypes.jsx';
import PoiSelector from '../Zerking/PoiSelector.jsx';
import { foodTypes, drinkTypes, serviceTypes } from '../Zerking/poiTypes.js';
import {
	initUserActiveFestivalStages,
	initUserActiveFestivalPois
} from '../../../store/actions';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PoiFilter = withFilteredPoiTypes(PoiSelector);

const StyledCarousel = styled(Carousel)`
	.carousel .slide {
		background: none !important;
	}
	.carousel img {
		width: auto !important;
	}
`;

const Title = styled.div`
	font-size: 140%;
	color: white;
	padding: 10px 20px;
	border-radius: 3px;
	background-color: rgba(22, 22, 22, 0.9);
	width: 100%;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.5);
`;

const Container = styled.div`
	background-color: #2c2c2c;
`;

export class NavigatorContainer extends Component {
	state = {
		initPage: 0
	};

	componentDidMount() {
		this.props.setMenu('hide');
		this.props.initUserActiveFestivalStages();
		this.props.initUserActiveFestivalPois();
	}

	changeHander = e => {
		this.setState({ initPage: e });
	};

	render() {
		if (!this.props.activeFestivalData) {
			return <div>Waiting for active festival data...</div>;
		}
		return (
			<Container>
				<PoiFilterContainer
					pois={this.props.pois}
					coverPhoto={this.props.activeFestivalData.coverPhoto}
				>
					<StyledCarousel
						showThumbs={false}
						swipeScrollTolerance={2}
						showStatus={false}
						showArrows={false}
						onChange={this.changeHander}
						selectedItem={this.state.initPage}
					>
						<div>
							<Title>{`Services - ${
								this.props.activeFestivalData.name
							} `}</Title>
							<PoiFilter
								pois={this.props.pois}
								poiTypes={serviceTypes}
								pos={{ lat: 0, lng: 0 }}
								festival={this.props.activeFestival}
							/>
						</div>
						<div>
							<Title>{`Drinks - ${
								this.props.activeFestivalData.name
							} `}</Title>
							<PoiFilter
								pois={this.props.pois}
								poiTypes={drinkTypes}
								pos={{ lat: 0, lng: 0 }}
								festival={this.props.activeFestival}
							/>
						</div>
						<div>
							<Title>{`Food - ${
								this.props.activeFestivalData.name
							} `}</Title>
							<PoiFilter
								pois={this.props.pois}
								poiTypes={foodTypes}
								pos={{ lat: 0, lng: 0 }}
								festival={this.props.activeFestival}
							/>
						</div>
					</StyledCarousel>
				</PoiFilterContainer>

				<PoiContaier
					readOnly
					pois={this.props.filteredPois}
					festival={this.props.activeFestival}
					pos={this.props.pos}
				/>
			</Container>
		);
	}
}

const mapStateToProps = ({ festbot, zerking }) => {
	return {
		userId: festbot.userId,
		activeFestival: festbot.activeFestival,
		stages: zerking.stages,
		pois: zerking.pois,
		filteredPois: zerking.filteredPois,
		activeFestivalData: zerking.activeFestivalData,
		filterItems: zerking.filterItems,
		pos: zerking.pos,
		webviewMenu: festbot.webviewMenu
	};
};

const mapDispatchToProps = dispatch => {
	return {
		initUserActiveFestivalStages: () =>
			dispatch(initUserActiveFestivalStages()),
		initUserActiveFestivalPois: () =>
			dispatch(initUserActiveFestivalPois()),
		setMenu: actualViewMenu =>
			dispatch({ type: 'UPD_MENU', value: actualViewMenu })
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(geolocationWrapper(NavigatorContainer));
