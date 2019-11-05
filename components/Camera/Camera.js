import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import { ActivityIndicator, Icon, Item, Dimensions, Platform, View, TextInput, TouchableOpacity, TouchableHighlight, Text, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { ImageManipulator } from 'expo';
const axios = require('axios')

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
        r: null
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

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  async snapPhoto() {     
    console.log('Button Pressed');
    if (this.camera) {
      this.camera.stopRecording()
      this.setState({ loading: true })
      console.log('Taking photo');
      const data = await this.camera.takePictureAsync()
      console.log(data.uri)
      img_type = ((data.uri).split(".").pop())
      if (img_type == "jpg") {
        img_type = "jpeg"
      }
      const type_ = "image/" + img_type;
      const name_ = "photo." + img_type;

      console.log(name_)
      console.log(type_)
      console.log("-------------")

      let formData = new FormData();
      const photo = {
        uri: data.uri,
        type: type_,
        name: name_
      }

      formData.append('image', photo)

      console.log(formData)

      const res = await axios.post('https://127.0.0.1:5000/', formData, {
          headers: {
            'content-type': `multipart/form-data`,
          }
      }).then(function () {
        console.log('SUCCESS!!');
      }).catch(function (err) {
        console.log(err);
      });

      this.setState({ loading: false })

     }
    }

  render() {

    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <View />
    }
    else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    }
    else {
      return (
        <View style={{ 
        	flex: 1,
          height: imageHeight,
          width: imageWidth,
		    flexDirection: 'column',
         }}>
          <Camera ref={ref => {
              this.camera = ref;
            }} 
            type={this.state.type}
            onCameraReady={this.prepareRatio}
            ratio= {this.state.r}
            style = {{
	          	flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center'
          }}>
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}} >
              <TouchableOpacity
                style={{
                  	flex: 0,
                    padding: 15,
                    paddingHorizontal: 20,
                    alignSelf: 'center',
                    margin: 20,
                    borderWidth:8,
                    borderColor:'rgba(0,0,0,0.5)',
                    alignItems:'center',
                    justifyContent:'center',
                    width:75,
                    height:75,
                    backgroundColor:'#fff',
                    borderRadius:75,
                }}
                onPress={this.snapPhoto.bind(this)}
                >
              </TouchableOpacity>
            </View>
          </Camera>
          {this.state.loading && <View style = {{
                                  height: imageHeight,
                                  width: imageWidth,
                                  position: 'absolute',
                                  paddingLeft: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0.6,
                                  backgroundColor: '#808080',
                                }}>
            <ActivityIndicator style= {{paddingBottom: imageHeight/4}} color='#316538' size='large'/>
          </View>}
        </View>
      );
    }
  }
}

export default CameraComponent