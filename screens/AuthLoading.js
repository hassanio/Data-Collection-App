import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Dimensions,Linking, KeyboardAvoidingView,Alert} from 'react-native';
import { connect } from 'react-redux'
import {LoginSuccess} from '../actions'
import { Asset, SplashScreen } from 'expo'

const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    SplashScreen.hide()
    this._bootstrapAsync();
  }


  cacheImages(images) {
    return images.map(img => {
      return Asset.fromModule(img).downloadAsync()
    })
  }

  async _loadAssetsAsync() {
    const imageAssets = this.cacheImages([
      require('../assets/images/background.jpg'),
      require('../assets/images/no_img.png'),
      require('../assets/images/filter.png')
    ])

    await Promise.all(imageAssets)
  }


  async remove_token() {
    await AsyncStorage.removeItem('token');
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    //this.remove_token()

    const userToken = await AsyncStorage.getItem('token');

    if (userToken) {
      this.props.setToken(userToken)
    }

    //Load assets
    this._loadAssetsAsync()

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Main' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style = {{ backgroundColor:'#316538' ,flex: 1, justifyContent: 'center', allignItems:'center'}}>
        <StatusBar barStyle="light-content" backgroundColor = '#316538' />
        <ActivityIndicator color='#CAEEA2' style = {{flex: 1, justifyContent: 'center', allignitems: 'center', height: imageHeight/2}} size='large'/>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setToken: token => dispatch(LoginSuccess(token))
})

export default connect(null, mapDispatchToProps)(AuthLoadingScreen);