import { Camera } from 'expo-camera';
import { askAsync, CAMERA_ROLL, LOCATION } from 'expo-permissions';
import React, { Component } from 'react';
import {  StyleSheet, Button, Dimensions, Platform, View, TextInput, TouchableOpacity, TouchableHighlight, Text, Image, ToastAndroid } from 'react-native';
import { launchCameraAsync } from 'expo-image-picker';
import Constants from 'expo-constants';
import { createAssetAsync, createAlbumAsync } from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';


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
	    borderTopLeftRadius: BORDER_RADIUS,
	    borderBottomLeftRadius: BORDER_RADIUS,
	  },
	  buttonText: {
	    fontWeight: '600',
	    fontSize: 17,
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


class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
        image: null,
        form_ID: null,
        buttonstate: false,
        data: null,
        location: null
    }

  }

  async componentWilllMount() {
    if (Constants.platform.ios) {
      const { status } = await askAsync(CAMERA_ROLL)
      if (status !== 'granted') {
          ToastAndroid.show("Permission Denied!")
      }
    }
  }

  async componentDidMount() {
    // console.log("IN LOCATION LORU")
    if (Platform.OS === 'android' && !Constants.isDevice) {
        ToastAndroid.show("Permission Denied!")
    } else {
        this._getLocationAsync();
    }

  }

  _getLocationAsync = async () => {

    let { status } = await askAsync(LOCATION)
    if (status !== 'granted') {
      ToastAndroid.show("Permission Denied!")
    }

    let loc = await Location.getCurrentPositionAsync({})
    this.setState({ location: loc })
  }

takePictureAndCreateAlbum = async () => {
    if (this.state.form_ID) { 
      const result = await launchCameraAsync({
        allowEditing: false,
        exif: false
      });
      console.log("DONE")
      let options = { encoding: FileSystem.EncodingType.Base64 };
      console.log(options)
      let fileUri = FileSystem.documentDirectory + JSON.stringify(this.state.location["coords"]["latitude"]) + '_' + this.state.location["coords"]["longitude"] + ".jpg";
      console.log(fileUri)

      await FileSystem.moveAsync({
        from: result.uri,
        to: fileUri
      })

      const asset = await createAssetAsync(fileUri);

      formid = (this.state.form_ID.toString())


      createAlbumAsync('Form' + formid, asset, false)
        .then(() => {
          ToastAndroid.show("Image Saved to gallery for form" + formid, ToastAndroid.LONG)
        })
        .catch(error => {
          ToastAndroid.show("An error occured while saving.", ToastAndroid.LONG)
      });


      // FileSystem.readAsStringAsync(result.uri, options).then(data => {
      //       console.log("HERE1")
      //       const base64 = 'data:image/jpg;base64' + data;
      //       this.setState({ data: base64})
      //       // resolve(base64); // are you sure you want to resolve the data and not the base64 string?
      //       console.log("HERE2")
      //   }).catch(err => {
      //       console.log("​getFile -> err", err);
      //       // reject(err) ;
      //   });
      // FileSystem.writeAsStringAsync(fileUri, this.state.data , options).then(() => {
      //   console.log("written successfully!)")
      // }).catch((err) => {
      //   console.log(err)
      // });
      // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'Hello/').then(() => {
      //   console.log("Directory made")
      // }).catch((error) => {
      //   console.log(error)
      // })
      // await FileSystem.moveAsync({
      //   from: result.uri,
      //   to: FileSystem.documentDirectory + 'images/LORA.png'
      // })
      // print("DONE")
      // const asset = await createAssetAsync(result.uri);
      // formid = (this.state.form_ID.toString())
      // createAlbumAsync('Form' + formid, asset, false)
      //   .then(() => {
      //     ToastAndroid.show("Image Saved to gallery for form" + formid, ToastAndroid.LONG)
      //   })
      //   .catch(error => {
      //     ToastAndroid.show("An error occured while saving.", ToastAndroid.LONG)
      //   });
    }
    else
    {
      ToastAndroid.show("Please enter the form ID correctly before proceeding.", ToastAndroid.LONG)
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.container}>
		        <TouchableHighlight
		          style={styles.buttonContainer}
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

