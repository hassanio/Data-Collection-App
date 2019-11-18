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
        loading: false,
        r: null,
        image: null,
        location: null,
        firebaseUpload: false,
        text: "",
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


    _pickImage = async () => {
      // console.log("HERE")
      let result = await ImagePicker.launchCameraAsync({quality: 1})
      if (!result.cancelled) {
        const resizedPhoto = await ImageManipulator.manipulateAsync(result.uri, [
          { resize: { width: 1000 }}
        ])
        this.setState({ image: resizedPhoto.uri })
        // console.log(this.state.image)
        // console.log(this.state.location)

        img_type = ((this.state.image).split(".").pop())
        img_type = "jpg"
        const type_ = "image/" + img_type;
        const name_ = "photo." + img_type;

        // console.log(name_)
        // console.log(type_)
        // console.log("-------------")

        const formData = new FormData();
        const photo = {
          uri: this.state.image,
          type: type_,
          name: name_
        }

        formData.append('image', photo)

        this.setState({ text: "Estimating Quality.."})
      
        console.log(formData)


        const res = await axios.post('https://soil-sproj.herokuapp.com/', formData, {
            headers: {
              'content-type': `multipart/form-data`,
            }
        }).then((response) => {
            this.setState({ text: "Uploading Image.."})
            ToastAndroid.show(String(response.data['score']), ToastAndroid.LONG)
            // console.log(this.state.text)
            let lat = String(this.state.location["coords"]["latitude"])
            let long = String(this.state.location["coords"]["longitude"])

            this.uploadImage(this.state.image, lat + "_" + long)
            .then(() => {
              // ToastAndroid.show("Upload Successful!", ToastAndroid.LONG)
              this.setState({firebaseUpload: true})
            })
            .catch((error) => {
              ToastAndroid.show(error.message)
              // console.log(error.message)
            });
        }).catch(function (err) {
          console.log(err);
        });

        this.setState({ loading: false })
        this.setState({ image: null })

        // this._pickImage()
        
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
                                  height: imageHeight,
                                  width: imageWidth,
                                  position: 'absolute',
                                  paddingLeft: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0.8,
                                  backgroundColor: '#808080',
                                }}>
                                <Text style = {{fontSize: 20, color: 'white', paddingBottom: imageHeight/40, fontWeight: 'bold'}}>{this.state.text}</Text>
            <ActivityIndicator style= {{alignSelf: 'center'}} color='#FFFFFF' size='large'/>
            </View>
          </View>}
        </View>
      );
    }
  }
}

export default CameraComponent