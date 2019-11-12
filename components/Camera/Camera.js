import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import { Button, ActivityIndicator, Icon, Item, Dimensions, Platform, View, TextInput, TouchableOpacity, TouchableHighlight, Text, KeyboardAvoidingView, Image, ToastAndroid, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
const axios = require('axios')
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import * as firebase from 'firebase';
import ApiKeys from './ApiKeys';
// import { ImagePicker } from 'expo';


const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;
const DESIRED_RATIO = "16:9";



class CameraComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
		    hasCameraPermission: null,
		    type: Camera.Constants.Type.back,
        loading: false,
        focus: Camera.Constants.AutoFocus.on,
        r: null,
        image: null,
        location: null,
        firebaseUpload: false,
		}

		if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig) };
	}

  async componentDidMount() {
    console.log("IN LOCATION LORU")
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log("ERROR")
    } else {
      this._getLocationAsync();
    }

  }
  

  async componentWilllMount() {
    console.log("IN LOCATION LORU")
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }



    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.log("ERROR")
    } else {
      this._getLocationAsync();
    }

  }

  _getLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log("ERROR")
    }

    let loc = await Location.getCurrentPositionAsync({});
    this.setState({ location: loc });
  };

  uploadImage = async (uri, imageName) => {
	    const response = await fetch(uri);
	    const blob = await response.blob();

	    var ref = firebase.storage().ref().child("images/" + imageName);
	    return ref.put(blob);
  	}


    _pickImage = async () => {
      console.log("HERE")
      let result = await ImagePicker.launchCameraAsync({quality: 1})
      if (!result.cancelled) {
      	const resizedPhoto = await ImageManipulator.manipulateAsync(result.uri, [
	        { resize: { width: 1000 }}
	      ])
        this.setState({ image: resizedPhoto.uri });
        console.log(this.state.image)
        console.log(this.state.location)

        img_type = ((this.state.image).split(".").pop())
        img_type = "jpg"
        const type_ = "image/" + img_type;
        const name_ = "photo." + img_type;

        console.log(name_)
        console.log(type_)
        console.log("-------------")

        const formData = new FormData();
        const photo = {
          uri: this.state.image,
          type: type_,
          name: name_
        }

        formData.append('image', photo)
      
        console.log(formData)


   //      this.uploadImage(result.uri, "test-image")
   //      .then(() => {
   //        Alert.alert("Success");
   //        this.setState({firebaseUpload: true})
   //      })
   //      .catch((error) => {
			// Alert.alert('Error:', error.message)
			// console.log(error.message)
   //      });


        const res = await axios.post('https://soil-sproj.herokuapp.com/', formData, {
            headers: {
              'content-type': `multipart/form-data`,
            }
        }).then(function (response) {
		   //     	this.uploadImage(result.uri, "test-image")
		   //      .then(() => {
		   //        Alert.alert("Success");
		   //        this.setState({firebaseUpload: true})
		   //      })
		   //      .catch((error) => {
					// Alert.alert('Error:', error.message)
					// console.log(error.message)
		   //      });
          console.log(response.data['score']);
        }).catch(function (err) {
          console.log(err);
        });

        this.setState({ loading: false })
        this.setState({ image: null })

        this._pickImage()
        
      }
    }




  render() {

    const { hasCameraPermission } = this.state

    if (0) {
      return <View />
    }
    else if (0) {
      return <Text>No access to camera</Text>
    }
    else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {!this.state.image && <Button
            title="Tap to Launch Camera"
            onPress={this._pickImage}
          />}
          {this.state.image &&
                              <View>
                                <Image
                                  style={{width: imageWidth, height: imageHeight}}
                                  source={{uri: this.state.image}}
                                />
                                <View style = {{
                                  height: imageWidth,
                                  width: imageWidth,
                                  position: 'absolute',
                                  paddingLeft: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  backgroundColor: '#808080',
                                }}>
                                <Text style = {{fontSize: 20, color: 'white', paddingBottom: imageHeight/40, fontWeight: 'bold'}}>Estimating Quality..</Text>
            <ActivityIndicator style= {{alignSelf: 'center'}} color='#FFFFFF' size='large'/>
            </View>
          </View>}
        </View>
      );
    }
  }
}

export default CameraComponent