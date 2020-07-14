import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Header from '../components/header';
import { Camera } from 'expo-camera';
import { FontAwesome5, Ionicons } from '@expo/vector-icons'; 
import { render } from 'react-dom';


export default class RecordScreen extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    }
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  onShutterPress = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
    }
  }

  render(){
    if (this.state.hasPermission === null) {
      return <View />;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container} >
        <Header />
        <Camera 
          style={styles.camera} 
          type={this.state.type} 
          ref={ref => { this.camera = ref; }}
        >
        </Camera>

        {/* Controls */}
        <View style={styles.cameraControlsContainer} >
          <TouchableOpacity style={styles.manualEntryBox} >
            <FontAwesome5 name="pencil-alt" size={20} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onShutterPress} >
            <Ionicons name="ios-radio-button-on" size={90} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({
              type: this.state.type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front : Camera.Constants.Type.back
            });
          }} >
            <Ionicons name="md-reverse-camera" size={40} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: (Dimensions.get('window').height * 2) / 3,
  },
  cameraControlsContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  manualEntryBox: {
    width: 'auto',
    padding: 5,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: 'grey',
  },
});