import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const userInfo = {kullaniciAdi:'admin',sifre:'12345'};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {kullaniciAdi: '', sifre: ''};
  }

  static navigationOptions = {
    header:null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}> Giriş Yapın! </Text>
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          onChangeText={kullaniciAdi => this.setState({kullaniciAdi})}
          value={this.state.kullaniciAdi}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          onChangeText={sifre => this.setState({sifre})}
          value={this.state.sifre}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this._signin}>
          <Text style={styles.buttonText}>GİRİŞ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _signin = async() => {
    if(userInfo.kullaniciAdi===this.state.kullaniciAdi && userInfo.sifre ===this.state.sifre){
      await AsyncStorage.setItem('logged','1')
      this.props.navigation.navigate('App');
    }
    else{
      alert('Username or password wrong');
    }
  }
}

class HomeScreen extends Component{
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome Logged Page
        </Text>
        <Button onPress={this._logout} title="Logout"/>
      </View>
    );
  }

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
}

class AuthLoadingScreen extends Component{
  constructor(props){
    super(props);
    this._loadData();
  }
  render(){
    return(
      <View style={styles.container}>
        <ActivityIndicator/>
        <StatusBar barStyle="default"/>
      </View>
    )
  }
  _loadData = async() => {
    const logged = await AsyncStorage.getItem('logged');
    this.props.navigation.navigate(logged !== '1'? 'Auth': 'App');
  }
}

const AppStack = createStackNavigator({Home: HomeScreen});
const AuthStack = createStackNavigator({Login: App});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },{
      initialRouteName: 'AuthLoading'
    }
  )
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    margin: 15,
    height: 40,
    padding: 5,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#428AF8',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#424242',
    marginLeft: 15,
    marginRight: 15,
    padding: 20,
  },
  buttonText: {
    color: '#ffffff',
  },
});
