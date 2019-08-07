import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  Button,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';

import {
  ViroSceneNavigator,
  ViroARSceneNavigator
} from 'react-viro';

import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, prototype } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

// Calculate map zoom
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



// Dummy data
const exampleMarker = [{
    latlng: { latitude: 48.8983508, longitude: 2.3778904},
    title: 'My Tesla car',
    description: '427m',
  },
];

// Dummy id for example map markers
var id = 0;

/*
 react-viro AR API key
 */
var sharedProps = {
  apiKey:"48F904D3-E6A6-4D2F-B66A-FFBEC0CA4B69",
}

var InitialARScene = require('./ARScene');

export default class ViroSample extends React.Component {
  render() {
    return (
      <AppNavigation style={ styles.tabBar }/>
    );
  }
}

class ARScreen extends React.Component {
  constructor () {
    super();
    this.state = {
      sharedProps: sharedProps,
    }
  }
  static navigationOptions = {
    tabBarLabel: 'AR',
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('./icons/camera.png')
      }
      style={[styles.icon, {tintColor: tintColor}]} 
      />
    ),
  };
  render() {
    return (
      //husk API key
      <ViroARSceneNavigator {...this.state.sharedProps}
      initialScene={{scene: InitialARScene}} />
    );
  }
}

class GoogleMapsScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Map',
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('./icons/placeholder.png')
      }
      style={[styles.icon, {tintColor: tintColor}]} 
      />
    ),
  };

  constructor(){
    super();
    this.state = {
      markers: exampleMarker,
      region: {
        latitude: 48.8983508,
        longitude: 2.3778904,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      currentPosition: {
        latitude: 0.0,
        longitude: 0.0,
      }
    }
  }

  componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currentPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  
  render() {
    return (
      <View style={styles.mainView}>
        <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        region={{ latitude: this.state.currentPosition.latitude,
                  longitude: this.state.currentPosition.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                  }}
        mapType="standard"
        showsUserLocation={true}
        userLocationAnnotationTitle="My position"
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsPointsOfInterest={true}
        showsCompass={true}
        showsIndoors={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        loadingEnabled={true}
        scrollEnabled={true}
        >
        {this.state.markers.map(marker => (
        <MapView.Marker
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
          key={id++}
        />
        ))}
        </MapView>
        <View style={styles.searchBarContainer}>
            <TextInput
              placeholder=" Search..."
              style={styles.searchBar}
            />
        </View>
      </View>
    );
  }
}

const AppNavigator = createBottomTabNavigator({
  Google: { screen: GoogleMapsScreen },
  AR: { screen: ARScreen },
},
{
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

const AppNavigation = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  ar: {
    flex: 1,
  },
  mainView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  searchBar: {
    elevation: 1,
    width: '99%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchBarContainer: {
    elevation: 1,
    backgroundColor: 'white',
    width: '90%',
    height: '6%',
    marginLeft: '5%',
    top: 40,
    borderRadius: 3,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0},
  },
});

AppRegistry.registerComponent('prototype', () => prototype);
module.exports = ViroSample
