import React, { Component } from "react";
import Navigator from "./config/routes"
import {Alert} from "react-native";
import { DeviceEventEmitter } from 'react-native';
import { SplashScreen } from 'expo'

class HelloWorldApp extends Component {
  componentDidMount(){ 
    SplashScreen.hide()
  }
  render(){
      return (
          <Navigator />
      )
    }
}

export default HelloWorldApp