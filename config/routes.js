import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation'
import Cam from '../screens/Cam'


export default createAppContainer(createStackNavigator({
  home: {
		screen: Cam,
        path:'login/:user',
	},
},
	{
	  headerMode: 'none',
	  navigationOptions: {
	    headerVisible: false,
	  }
	},
))

