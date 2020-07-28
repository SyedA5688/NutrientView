import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Button } from 'react-native';
import Header from '../components/header';
import Loading from '../components/loading';
import NoAccess from '../components/noAccess';
import ApiKeys from '../constants/ApiKeys';
import ImageModal from '../components/imageModal';
import SuccessModal from '../components/successModal';
import ManualEntryModal from '../components/manualEntryModal';
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
      showManualEntryModal: false,
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

  deleteFirebaseImage = () => {
    // Delete image after a set time interval
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

  getNutritionData = async (quantity, foodName, meal) => {
    // Call nutrition api, replace spaces with %20
    const regex = / /g;
    let percentEncodedFoodName = foodName.replace(regex, '%20'); // Replace spaces in food name with %20
    const response = fetch("https://api.edamam.com/api/nutrition-data?app_id=" + ApiKeys.EdamamNutritionAPI.appID + "&app_key=" + 
                            ApiKeys.EdamamNutritionAPI.appKey + "&ingr=" + quantity + "%20" + percentEncodedFoodName)
      .then(response => response.json())
      .then(data => {
        if (data != null && data["calories"] == 0) {
          Alert.alert("Was not able to find food item in database, unable to log nutrients");
          return;
        }
        // Clean data
        if ("SUGAR.added" in data.totalNutrients) { delete data.totalNutrients["SUGAR.added"]; } // Added sugars
        if ("SUGAR" in data.totalNutrients) { delete data.totalNutrients["SUGAR"]; } // Added sugars
        if ("FAPU" in data.totalNutrients) { delete data.totalNutrients["FAPU"]; } // Polyunsaturated fats 
        if ("FAMS" in data.totalNutrients) { delete data.totalNutrients["FAMS"]; } // Monounsaturated fats
        if ("FATRN" in data.totalNutrients) { delete data.totalNutrients["FATRN"]; } // Trans fats
        if ("WATER" in data.totalNutrients) { delete data.totalNutrients["WATER"]; } // Water
        if ("FOLAC" in data.totalNutrients) { delete data.totalNutrients["FOLAC"]; } // Folic Acid
        if ("FOLDFE" in data.totalNutrients) { delete data.totalNutrients["FOLDFE"]; } // Folate Total (redundant)
        if ("FOLFD" in data.totalNutrients) { data.totalNutrients["FOLFD"].label = "Folate"; } // Folate Total (redundant)
        if ("ENERC_KCAL" in data.totalNutrients) { data.totalNutrients["ENERC_KCAL"].label = "Calories"; } // Folate Total (redundant)

        this.setState({ nutrientList: data.totalNutrients });
        this.toggleSuccessModal();
        this.updateFirebaseData(quantity, foodName, meal);
      })
      .catch(error => {
        Alert.alert("Couldn't retrieve nutritional information, try again: " + error);
        return;
      })
  }

  updateFirebaseData = (quantity, foodName, meal) => {
    // Upload nutrition data to firebase database
    let uid = firebase.auth().currentUser.uid;
    let time = new Date();
    let monthNum = parseInt(time.getMonth()) + 1; // Months are 0-11, change to 1-12
    let dateStr = monthNum.toString() + "-" + time.getDate()
    const databaseRef = firebase.database().ref('users/' + uid + "/NutritionReports/" + time.getFullYear() + "/" + monthNames[time.getMonth()] + "/" + dateStr);
    // Update nutrient info in firebase
    databaseRef.child("Nutrients").once("value").then(snapshot => {
      if (!snapshot.exists()) {
        databaseRef.child("Nutrients").set(this.state.nutrientList);
      }
      else {
        // Update/Add to nutrient values in firebase database, not create new branch
        let newNutrientList = this.state.nutrientList;
        let databaseObj = snapshot.val();
        for (let key in newNutrientList) {
          if (key in databaseObj) {
            newNutrientList[key].quantity += databaseObj[key].quantity;
          }
        }
        databaseRef.child("Nutrients").update(newNutrientList);
      }
      console.log("Updated data in firebase");
    });

    // Update food name and meal in firebase
    databaseRef.child("Meals").child(meal).once('value', (snapshot) => {
      if (snapshot.exists()) {
        // Get next number
        let updates = {};
        let nextNum = Object.keys(snapshot.val()).length + 1;
        updates[nextNum] = foodName;
        databaseRef.child("Meals").child(meal).update(updates);
      } else {
        // First entry for meal, use number 1
        let updates = {};
        updates["1"] = foodName;
        databaseRef.child("Meals").child(meal).update(updates);
      }
    });
  }

  toggleModal = () => {
    this.setState({ showImageResultsModal: !this.state.showImageResultsModal });
  }

  toggleSuccessModal = () => {
    this.setState({ showSuccessModal: !this.state.showSuccessModal });
  }

  toggleManualEntryModal = () => {
    this.setState({ showManualEntryModal: !this.state.showManualEntryModal });
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

        {/* Modals for food entry */}
        <ImageModal {...this.state} toggleModal={this.toggleModal} getNutritionData={this.getNutritionData} />
        <SuccessModal {...this.state} toggleSuccessModal={this.toggleSuccessModal} />
        <ManualEntryModal {...this.state} toggleManualEntryModal={this.toggleManualEntryModal} getNutritionData={this.getNutritionData} />

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
          <TouchableOpacity onPress={this.onImagePickPress} >
            <Feather name="image" size={40} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onShutterPress} >
            <Ionicons name="ios-radio-button-on" size={90} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualEntryBox} onPress={this.toggleManualEntryModal} >
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