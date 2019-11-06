import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import { Button, ActivityIndicator, Icon, Item, Dimensions, Platform, View, TextInput, TouchableOpacity, TouchableHighlight, Text, KeyboardAvoidingView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { ImageManipulator } from 'expo';
const axios = require('axios')
import * as ImagePicker from 'expo-image-picker';

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
		  }
	}

  prepareRatio = async () => {
        if (Platform.OS == 'android' && this.camera) {
            console.log("here")
            const ratios = await this.camera.getSupportedRatiosAsync();
            const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
            console.log(ratio)
             
            this.setState({ r: ratio });
        }
    }

  async componentWilllMount() {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

    _pickImage = async () => {
      console.log("HERE")
      let result = await ImagePicker.launchCameraAsync({})
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        console.log(this.state.image)

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

        const res = await axios.post('http://10.130.96.240:5000/', formData, {
            headers: {
              'content-type': `multipart/form-data`,
            }
        }).then(function (response) {
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
                                  height: imageHeight,
                                  width: imageWidth,
                                  position: 'absolute',
                                  paddingLeft: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0.7,
                                  backgroundColor: '#808080',
                                }}>
            <ActivityIndicator style= {{alignSelf: 'center'}} color='#FFFFFF' size='large'/>
            </View>
          </View>}
        </View>
      );
    }
  }
}

export default CameraComponent