import React, { Component } from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';

import SearchBar from '../../../ui/SearchBar.jsx';

import VisibilityControl from '../../../hoc/VisibilityControl/VisibilityControl.jsx'

import { getFestivalByName } from '../../../helpers/festivalApiHelper.js';

import { setFestival,getFestivalStages,getFestivalPois,setItemToZerking } from '../../../store/actions/actions.js';

const FestivalSelectorContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
`;
const FestivalItem = styled.div`
	margin: 50px;
	background-color: rgb(59, 40, 78);
	text-align: center;
	width: 90%;
	margin: 10px auto;
	padding: 10px 10px;
	font-size: 130%;
	color: white;
	box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	font-weight: 100;
	cursor: pointer;

	&:hover {
		background-color: rgb(189, 0, 08);
	}
`;
const Dots = styled.div`
	width: 10px;
	display: inline-block;
	float:right;
`;
const Dot = styled.div`
	height: 5px;
	width: 5px;
	background-color: #fff;
	border-radius: 50%;
	margin: 3px 2px;
	padding: 0;
`;

export class FestivalSelector extends Component {

	componentWillMount(){
	//	this.visibilityActionHandler()
	}


	festivalListFilter = async keyword => {
		const festivalList = await getFestivalByName(keyword);

		this.festivalListRender = festivalList.map(this.renderFestivalList);
		this.forceUpdate();
	};

	setActiveFestival = festival => {
		this.props.setActiveFestival(festival);
		festival&&this.props.getFestivalStages(festival._id)
		festival&&this.props.getFestivalPois(festival._id)
		this.props.setItemToZerking([])

		this.festivalListFilter();
	};

	componentDidMount() {
		this.festivalListFilter();
	}

	renderFestivalList = festival => {
		return (
			<FestivalItem key={festival._id} onClick={() => this.setActiveFestival(festival)}>
				{festival.name}
			</FestivalItem>
		);
	};


	visibilityActionHandler=(itemVisible)=>{
		if (!itemVisible) {
			this.setState({showFixed:true})
			console.log("Item not Visible")
		} else {
			this.setState({showFixed:false})
			console.log("Item  Visible")
		}
}


	render() {
		if (!this.props.festival) {
			return (
			
				<FestivalSelectorContainer>
					<FestivalItem style={{ backgroundColor: 'rgb(229, 0, 88)' }}>{`Select Festival`}</FestivalItem>
					<SearchBar searchQueryChanged={this.festivalListFilter} placeholder="Search Festival" />
					{this.festivalListRender}
				</FestivalSelectorContainer>

			);
		}

		return (
			<div>

			<VisibilityControl  always={true} visibilityActionHandler={this.visibilityActionHandler}>
					
				<FestivalItem onClick={this.props.onClick} style={{ backgroundColor: 'rgb(0, 199, 88)' }}>
				{`Add ${this.props.itemsToZerking.length} here ${this.props.festival.name}`}
					<Dots onClick={() => this.setActiveFestival()}>
						<Dot />
						<Dot />
						<Dot />
					</Dots>
				</FestivalItem>
				</VisibilityControl>
			</div>
		);
	}
}



const mapDispatchToProps = dispatch => {
	return {
		setActiveFestival: festival => dispatch(setFestival(festival)),
		getFestivalStages: festivalId => dispatch(getFestivalStages(festivalId)),
		getFestivalPois: festivalId => dispatch(getFestivalPois(festivalId)),
		setItemToZerking: item => dispatch(setItemToZerking(item)),
	};
};

export default connect(
	null,
	mapDispatchToProps
)(FestivalSelector);
