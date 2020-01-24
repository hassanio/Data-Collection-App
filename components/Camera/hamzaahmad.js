import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableHighlight,
  Image,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  DatePickerAndroid,
  CameraRoll,
  // Button,
} from 'react-native';
// import Icon from 'react-native-ionicons'
import { TextInput, Button, } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from 'expo-constants';
// import { FloatingAction } from "react-native-floating-action";
import ActionButton from 'react-native-action-button';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
// import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from "react-native-view-shot";
// import QRCode from 'react-native-qrcode-svg';
import QRCode from 'react-native-qrcode';
import { createIconSet } from 'react-native-vector-icons';
// import RNViewShot from "react-native-view-shot";

export default class Qrcode extends React.Component{
  dothis = () => {
      this.refs.viewShot.capture().then(uri => {
        console.log("do something with ", uri);
        CameraRoll.saveToCameraRoll(uri)
      });
  }
  render() {
    return (
      <View>
      <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
        <QRCode
        value="http://facebook.github.io/react-native/"
        size={200}
        bgColor='black'
        fgColor='white'/>
      </ViewShot>
      <View>
      <Button icon="content-save" mode="contained" onPress={()=>{this.dothis()}} >Save QR code to gallery</Button>
      </View>
      </View>
  );
  }
}
  
const styles = StyleSheet.create({
inputsContainer: {
    flex: 1
},
fullWidthButton: {
    marginTop: "10%",
    marginRight: "5%",
    marginLeft: "5%",
    backgroundColor: '#017745',
    height: "140%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
},
fullWidthButtonText: {
    textAlignVertical: "center",
    paddingBottom: "10%",
    fontSize:24,
    color: 'gold'
}
})