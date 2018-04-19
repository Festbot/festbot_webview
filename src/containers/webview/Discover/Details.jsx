import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './DiscoverContainer.css';
import * as colors from 'material-ui/styles/colors';
import axios from 'axios';


import IconHeadset from 'material-ui/svg-icons/hardware/headset';
import IconInfo from 'material-ui/svg-icons/action/event';
import Star from 'material-ui/svg-icons/toggle/star';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import { Tabs, Tab } from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment';


export class Details extends Component {
  state={
		slideIndex: 0,
		events:[],
		artist:{
			facebook:'',
			website:'',
			spotify:'',
			genres:[],

		}
  }

  async componentDidMount()  {
		let ref = this.activeDetailsDiv;

  const {data} = await axios.post("http://159.65.198.31:5984/artists/_find",{selector:{slug: this.props.artist}})
	console.log('artist details ',data)
	this.setState({artist: data.docs[0]})
	

		const {data:eventData} = await axios.post("http://159.65.198.31:5984/shows/_find",{selector:{'artist_slug': this.props.artist}})
		console.log('program details ',eventData)

		this.setState({events: eventData.docs.sort((eventA,eventB)=> {
		 if (moment(eventA.startDate).isBefore(eventB.startDate)) return -1
		 if (moment(eventB.startDate).isBefore(eventA.startDate)) return 1
		 if (moment(eventB.startDate).isSame(eventA.startDate)) return 0
		})})
		
		console.log('program details ',this.state.events)
		
		const rect = this.activeDetailsDiv.getBoundingClientRect();
		console.log('DETAILS POSITION:' ,rect)

		if (rect.height >0 ) {
			this.props.setDetailsPanelHeight(rect.height)
		}
		//window.scrollTo( 0, rect.top )
}



handleChange = value => {
  this.setState({
    slideIndex: value
  });
};


  render() {
		const [,spotifyId] = this.state.artist.spotify.split(':');
		
		const eventList = this.state.events.map((event,index)=>{
			return (
				<li>
					<div className={classes.CalendarContainer}>
						<div className={classes.CalendarRow}>{moment(event.startDate).format('MMM')}</div>
						<div className={classes.CalendarRow}>{moment(event.startDate).format('Do')}</div>
					</div>
					<div className={classes.venueName}>{event.festival}</div>
					<div className={classes.saveIcon}><StarBorder color={colors.blueGrey300} /></div>
				</li>
			)
		})

    return (
      <div onClick={(e)=>{e.stopPropagation()}} ref={element => (this.activeDetailsDiv = element)}>
						<Tabs
							onChange={this.handleChange}
							value={this.state.slideIndex}
							tabItemContainerStyle={{
								backgroundColor: ' rgba(0,0,0,0.4)',
								height: '45px'
							}}
							inkBarStyle={{ backgroundColor: 'white' }}
						>
							<Tab icon={<IconInfo />} label="" value={0} />
							<Tab icon={<IconHeadset />} label="" value={1} />
							<Tab label="Map" value={2} />
						</Tabs>
						<SwipeableViews
							index={this.state.slideIndex}
							onChangeIndex={this.handleChange}
						>
							<div style={{padding: '16px 0'}}>
								<div className={classes.detailsHeader}>
									On tour
								</div>
								<div className={classes.detailsContent}>
									{eventList}
								</div>

								<div className={classes.detailsHeader}>
									Details
								</div>
								<div className={classes.detailsContent} style={{margin: '5px'}}>
									<p />
									<p />
									Facebook: {this.state.artist.facebook}
									<p />
									Website: {this.state.artist.website}
									<p />
									Genre: {this.state.artist.genres.join(', ')}
								</div>
							</div>

							<div>
								<iframe
									src={
										'https://open.spotify.com/embed/artist/' +
										spotifyId
									}
									width="100%"
									height="400"
									frameBorder={'0'}
									seamless
									allowtransparency="true"
								/>
							</div>

							<div>
								<h1>Map, Navigation</h1>
							</div>
						</SwipeableViews>
					</div>
    )
  }
}



const mapDispatchToProps = dispatch => {
	return {

    setDetailsPanelHeight:height => dispatch({type: 'UPD_DETAILSHEIGHT', value: height}),

	};
};

export default connect(null,mapDispatchToProps)(Details);



