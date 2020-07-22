import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Button } from 'react-native';
import Header from '../components/header';
import Loading from '../components/loading';
import NoAccess from '../components/noAccess';
import ApiKeys from '../constants/ApiKeys';
import ImageModal from '../components/imageModal';
import SuccessModal from '../components/successModal';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import * as firebase from 'firebase';


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
  "September", "October", "November", "December"];

export default class RecordScreen extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
      showImageResultsModal: false,
      showSuccessModal: false,
      imageRecognition: [],
      nutrientList: {},
    }
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  guidGenerator = () => {
    var S4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  onImagePickPress = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        // Upload image to firebase, get image url IBM Watson API
        const response = this.uploadImageToFirebase(result.uri);
      }
    }
    catch (E) {
      console.log(E);
    }
  }

  onShutterPress = async () => {
    let photo;
    if (this.camera) {
      photo = await this.camera.takePictureAsync();
    }
    // Upload image to firebase, get image url IBM Watson API
    const response = this.uploadImageToFirebase(photo.uri);
  }

  uploadImageToFirebase = async (fileUri) => {
    let uid = firebase.auth().currentUser.uid;
    let time = Date.now().toString(); // Name of image will be the time created, in milliseconds since Jan 1, 1970, 00:00:00 UTC
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
        //console.log("Firebase URL: " + url);
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
        //console.log(data);
        //console.log(data.images[0].classifiers[0].classes);
        this.setState({ imageRecognition: data.images[0].classifiers[0].classes.map(obj => (
          {
            id: this.guidGenerator(),
            title: obj.class
          }
          )
        ) });
      
        this.toggleModal();
      })
      .catch(error => {
        Alert.alert("Error in uploading image: " + error);
        return;
      })
  }

  toggleModal = () => {
    this.setState({ showImageResultsModal: !this.state.showImageResultsModal });
  }

  toggleSuccessModal = () => {
    this.setState({ showSuccessModal: !this.state.showSuccessModal });
  }

  getNutritionData = async (quantity, foodName) => {
    // Call nutrition api, replace spaces with %20
    const regex = / /g;
    let percentEncodedFoodName = foodName.replace(regex, '%20'); // Replace spaces in food name with %20
    const response = fetch("https://api.edamam.com/api/nutrition-data?app_id=" + ApiKeys.EdamamNutritionAPI.appID + "&app_key=" + 
                            ApiKeys.EdamamNutritionAPI.appKey + "&ingr=" + quantity + "%20" + percentEncodedFoodName)
      .then(response => response.json())
      .then(data => {
        //console.log(data.totalNutrients);
        this.setState({ nutrientList: data.totalNutrients });
        this.updateNutritionDataInFirebase();
        this.toggleSuccessModal();
      })
      .catch(error => {
        Alert.alert("Error in retrieving nutritional information: " + error);
        return;
      })
  }

  updateNutritionDataInFirebase = () => {
    // Upload nutrition data to firebase database
    let uid = firebase.auth().currentUser.uid;
    let time = new Date();
    let dateStr = time.getMonth() + "-" + time.getDate()
    const databaseRef = firebase.database().ref().child('users').child(uid).child("Nutrient").child(time.getFullYear()).child(monthNames[time.getMonth()]).child(dateStr);
    databaseRef.once("value").then(function(snapshot) {
      if (snapshot.exists()) {
        databaseRef.update(this.state.nutrientList)
          .then(() => {
            console.log('Successful Update of nutrition information in firebase');
          })
          .catch((error) => {
            Alert.alert("Was not able to update nutrition information: " + error);
          })
      }
      else {
        // Need to update/add to values in firebase database, not create new branch
        
      }
    });
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
        <ImageModal {...this.state} toggleModal={this.toggleModal} getNutritionData={this.getNutritionData} />
        <SuccessModal {...this.state} toggleSuccessModal={this.toggleSuccessModal} />

        <Camera 
          style={styles.camera} 
          type={this.state.type} 
          ref={ref => { this.camera = ref; }}
        >
          <Button title="Toggle Modal" onPress={this.toggleModal} />
          <View style={styles.cameraCaptionBox} >
            <Text style={styles.cameraCaptionText} >Please allow several seconds for image processing</Text>
          </View>
        </Camera>

        {/* Controls */}
        <View style={styles.cameraControlsContainer} >
          <TouchableOpacity onPress={this.onImagePickPress} >
            <Feather name="image" size={40} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onShutterPress} >
            <Ionicons name="ios-radio-button-on" size={90} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualEntryBox} >
            <FontAwesome5 name="pencil-alt" size={20} color="grey" />
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