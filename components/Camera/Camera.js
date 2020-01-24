import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import {  StyleSheet, Button, ActivityIndicator, Icon, Item, Dimensions, Platform, View, TextInput, TouchableOpacity, TouchableHighlight, Text, KeyboardAvoidingView, Image, ToastAndroid, Alert, CameraRoll } from 'react-native';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
const axios = require('axios')
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import * as firebase from 'firebase';
import ApiKeys from './ApiKeys';
import color from 'color';


import * as MediaLibrary from 'expo-media-library';


const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;
const DESIRED_RATIO = "16:9";



INPUT_HEIGHT = imageHeight/12;
BORDER_RADIUS = 10;

styles = {
	  $buttonBackgroundColorBase: '#FFFFFF',
	  $buttonBackgroundColorModifier: 0.1,
	  container: {
	    backgroundColor: '#F0F0F0',
	    width: imageWidth*0.5,
	    height: INPUT_HEIGHT,
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'center',
	    borderRadius: BORDER_RADIUS,
	    marginVertical: 15,
	    marginHorizontal: imageHeight/10,
	  },

	  buttonContainer: {
	    height: INPUT_HEIGHT,
	    width: imageWidth/5,
	    alignItems: 'center',
	    justifyContent: 'center',
	    //flexDirection: 'row',
	    //backgroundColor: '#F0F0F0',
	    borderTopLeftRadius: BORDER_RADIUS,
	    borderBottomLeftRadius: BORDER_RADIUS,
	  },
	  buttonText: {
	    fontWeight: '600',
	    fontSize: 17,
	    //paddingHorizontal: 10,
	    color: '#4F6D72',
	  },
	  separator: {
	    height: INPUT_HEIGHT,
	    width: StyleSheet.hairlineWidth,
	    backgroundColor: '#000000',
	  },
	  input: {
	    flex: 1,
	    height: INPUT_HEIGHT,
	    borderTopRightRadius: BORDER_RADIUS,
	    paddingHorizontal: 5,
	    color: '#000000',
	    fontSize: 22,
	  },
	};

	 const underlayColor = color(styles.$buttonBackgroundColorBase).darken(
	    styles.$buttonBackgroundColorModifier,
	  );


 


class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
        loading: false,
        r: null,
        image: null,
        location: null,
        firebaseUpload: false,
        text: "",
        form_ID: null,
        buttonstate: false,
    }

    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig) }
  }

  async componentDidMount() {
    // console.log("IN LOCATION LORU")
    if (Platform.OS === 'android' && !Constants.isDevice) {
        ToastAndroid.show("Permission Denied!")
    } else {
        this._getLocationAsync();
    }

  }
  

  async componentWilllMount() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
          ToastAndroid.show("Permission Denied!")
      }
    }
  }


  _getLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      ToastAndroid.show("Permission Denied!")
    }

    let loc = await Location.getCurrentPositionAsync({})
    this.setState({ location: loc })
  }

  uploadImage = async (uri, imageName) => {
      const response = await fetch(uri)
      const blob = await response.blob()

      var ref = firebase.storage().ref().child("images/" + imageName)
      return ref.put(blob)
    }


  // _pickImage = async () => {
  // const result = await ImagePicker.launchCameraAsync({
  //   allowEditing: false,
  //   exif: true
  // });

  // let rename = new Promise((resolve, reject)=>{
  //   if (!result.cancelled) {
  //     console.log("Result uri is:", result.uri)
  //     // result["uri"] = "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FImdad-d8cfbb75-5733-4263-b34b-a5e56de2183a/ImagePicker/test1.jpg" 
  //     resolve("Done")
  //   }
  //   else {
  //     reject("Err")
  //   }
  // }).then((res)=>{
  //   this.setState({ image: result.uri });
  //   console.log("Here")
  //   console.log(this.state.image)
  //   CameraRoll.saveToCameraRoll(this.state.image);
  //   ToastAndroid.show("Image Saved to Gallery.", ToastAndroid.LONG)
  //   console.log(res)
  //   this.setState({ loading: false })
  //   this.setState({ image: null })

  // }).catch((rej)=>{
  //   console.log(rej)
  // })



// file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FImdad-d8cfbb75-5733-4263-b34b-a5e56de2183a/ImagePicker/a0874fae-70ad-4535-873f-066f844ac84c.jpg



takePictureAndCreateAlbum = async () => {
    if (this.state.form_ID) { 
      const result = await ImagePicker.launchCameraAsync({
        allowEditing: false,
        exif: false
      });
      console.log(result)
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      formid = (this.state.form_ID.toString())
      console.log(formid)
      MediaLibrary.createAlbumAsync('Form' + formid, asset, false)
        .then(() => {
          ToastAndroid.show("Image Saved to gallery for form" + formid, ToastAndroid.LONG)
          console.log('Album created!');
        })
        .catch(error => {
          ToastAndroid.show("An error occured while saving.", ToastAndroid.LONG)
          console.log('err', error);
        });
    }
    else
    {
      ToastAndroid.show("Please enter the form ID correctly before proceeding.", ToastAndroid.LONG)
    }
  }

    // _pickImage = async () => {
      // console.log("HERE")
      // let result = await ImagePicker.launchCameraAsync({quality: 1})
      // if (!result.cancelled) {
      //   const resizedPhoto = await ImageManipulator.manipulateAsync(result.uri, [
      //     { resize: { width: 1000 }}
      //   ])
      //   this.setState({ image: resizedPhoto.uri })
      //   // console.log(this.state.image)
      //   // console.log(this.state.location)

      //   img_type = ((this.state.image).split(".").pop())
      //   img_type = "jpg"
      //   const type_ = "image/" + img_type;
      //   const name_ = "photo." + img_type;

      //   // console.log(name_)
      //   // console.log(type_)
      //   // console.log("-------------")

      //   const formData = new FormData();
      //   const photo = {
      //     uri: this.state.image,
      //     type: type_,
      //     name: name_
      //   }

      //   formData.append('image', photo)

      //   this.setState({ text: "Saving photo.."})
      
      //   console.log(formData)

      // CameraRoll.saveToCameraRoll(this.state.image)

        // const res = await axios.post('https://soil-sproj.herokuapp.com/', formData, {
        //     headers: {
        //       'content-type': `multipart/form-data`,
        //     }
        // }).then((response) => {
        //     this.setState({ text: "Uploading Image.."})
        //     ToastAndroid.show(String(response.data['score']), ToastAndroid.LONG)
        //     // console.log(this.state.text)
        //     let lat = String(this.state.location["coords"]["latitude"])
        //     let long = String(this.state.location["coords"]["longitude"])

        //     this.uploadImage(this.state.image, lat + "_" + long)
        //     .then(() => {
        //       // ToastAndroid.show("Upload Successful!", ToastAndroid.LONG)
        //       this.setState({firebaseUpload: true})
        //     })
        //     .catch((error) => {
        //       ToastAndroid.show(error.message)
        //       // console.log(error.message)
        //     });
        // }).catch(function (err) {
        //   console.log(err);
        // });

        // this.setState({ loading: false })
        // this.setState({ image: null })

        // // this._pickImage()
        
    //   }
    // }




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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.container}>
		        <TouchableHighlight
		          //onPress={props.onPress}
		          style={styles.buttonContainer}
		          underlayColor={underlayColor}
		        >
		          <Text style={styles.buttonText}>FormID</Text>
		        </TouchableHighlight>
		        <View style={styles.separator} />
		        <TextInput 
		        	onChangeText={(form_ID) => this.setState({form_ID})}
               		value={this.state.form_ID}
               		keyboardType = "numeric"
               		style={styles.input}
               		underlineColorAndroid="transparent"
               	/>
	      	</View>
            <Button 
            	style = {{ paddingTop: imageHeight/ 2}}
	            title="Tap to Launch Camera"
	            onPress={this.takePictureAndCreateAlbum}
            />         
        </View>
      );
    }
  }
}

export default CameraComponent

