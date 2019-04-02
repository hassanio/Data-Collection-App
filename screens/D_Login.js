import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Linking,StatusBar, KeyboardAvoidingView,Alert} from 'react-native';
import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { TextButton, style } from '../components/TextInput';
import { TextBox } from '../components/TextBox';
import { DeviceEventEmitter } from 'react-native';
const usr = 'Username';
const pwd = 'Password';
const login = 'Login';

const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;

const INPUT_HEIGHT = imageHeight/12;
const BORDER_RADIUS = 10;

class D_Login extends Component {
  componentDidMount(){
    
  }
  componentDidUnmount(){
  }

  handle_Change_usr = () => {

  }

  handle_Change_pswd = () => {
    
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor="grey" barStyle="light-content" />
        <Logo />
        <TextBox
          buttonText={usr}
          onPress={this.handlePressBaseCurrency}
          //defaultValue={TEMP_BASE_PRICE}
          keyboardType="numeric"
          onChangeText={this.handleChangeText}
        />
        <TextBox
          buttonText={pwd}
          onPress={this.handlePressBaseCurrency}
          //defaultValue={TEMP_BASE_PRICE}
          keyboardType="numeric"
          onChangeText={this.handleChangeText}
        />
        <TextButton
          buttonText={login}
          onPress={this.handle_NGO_press}
        />
      </Container>
    );
  }
}

export default D_Login;
