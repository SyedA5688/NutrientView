import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Header from '../components/header';
import Loading from '../components/loading';
import NoAccess from '../components/noAccess';
import ApiKeys from '../constants/ApiKeys';
import { Camera } from 'expo-camera';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import { ImagePicker } from 'expo';
import * as firebase from 'firebase';


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
    let photo;
    if (this.camera) {
      photo = await this.camera.takePictureAsync();
    }
    // Upload image to firebase, get image url IBM Watson API
    let time = Date.now().toString(); // Name of image will be the time created, in milliseconds since Jan 1, 1970, 00:00:00 UTC
    const response = this.uploadImageToFirebase(photo.uri, time);
  }

  uploadImageToFirebase = async (fileUri, time) => {
    let uid = firebase.auth().currentUser.uid;
    const imageRef = firebase.storage().ref().child("users").child(uid).child("images").child(time);

    // Upload Image to firebase, need to use Javascript Blob API*
    const response = await fetch(fileUri);
    const blob = await response.blob();
    return imageRef.put(blob)
      .then(() => {
        console.log("Successful Image Upload to Firebase");
        return imageRef.getDownloadURL();
      })
      .then(url => {
        console.log("Firebase URL: " + url);
        this.callImageRecognition(url);
      })
      .catch(error => {
        Alert.alert("Error in uploading image: " + error);
        return;
      })
  }

  callImageRecognition = async (fileUrl) => {
    const options = {
      headers: {
        Authorization: "Basic " + base64.encode("apiKey:" + ApiKeys.watsonVisualRecognition.apiKey)
      }
    }
    const response = fetch("https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/4c100334-28b1-4090-b07d-7e86a67b005e/v3/classify?url=" 
                            + encodeURIComponent(fileUrl) + "&version=2018-03-19&classifier_ids=food", options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        Alert.alert("Error in uploading image: " + error);
        return;
      })
  }

  onImagePickPress = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync();
  }

  render(){
    if (this.state.hasPermission === null) {
      return (<View><Header /><Loading /></View>)
    }
    if (this.state.hasPermission === false) {
      return (<View><Header /><NoAccess /></View>)
    }
    return (
      <View style={styles.container} >
        <Header />
        <Camera 
          style={styles.camera} 
          type={this.state.type} 
          ref={ref => { this.camera = ref; }}
        >
          <View style={styles.cameraCaptionBox} >
            <Text style={styles.cameraCaptionText} >Please allow several seconds for image processing</Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cameraCaptionBox: {
    backgroundColor: 'transparent',
    paddingVertical: 1,
  },
  cameraCaptionText: {
    color: 'white',
    textAlign: 'center',
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