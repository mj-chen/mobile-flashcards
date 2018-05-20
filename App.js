import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, StatusBar, Platform } from "react-native"
import CardList from "./components/CardList"
import { createMaterialTopTabNavigator, createStackNavigator, } from "react-navigation"
import AddDeck from './components/AddDeck'
import { Constants } from 'expo'
import CardDetail from './components/CardDetail'
import Quiz from './components/Quiz'
import AddCard from './components/AddCard'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { createStore } from 'redux'
import { setLocalNotifications, clearLocalNotifications } from './utils/helpers'

const UdaciStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const navigator = {
  Decks: {
    screen: CardList,
    navigationOptions: {
      tabBarLabel: "DECKS",
    }
  },
  NewDeck: {
    screen: AddDeck,
    navigationOptions: {
      tabBarLabel: "NewDeck",
    }
  }
}

const options = {
  navigationOptions: {
    header: null,
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? "#e6b405" : "white",
    labelStayle: {
      fontSize: 30
    },
    tabStyle: {
      height: 60
    },
    style: {
      backgroundColor: Platform.OS === 'ios' ? 'white' : "#e6b405"
    }
  }
}

const TopTabs = createMaterialTopTabNavigator(navigator, options)

const BottomTabs = createMaterialBottomTabNavigator(navigator)

const MainNavigator = createStackNavigator({
  Home: {
    screen: Platform.OS === 'ios' ? BottomTabs : TopTabs,
    navigationOptions: {
      header: null,
    }
  },
  Detail: {
    screen: CardDetail,
  },
  Quiz: {
    screen: Quiz
  },
  AddCard: {
    screen: AddCard
  }
})

export default class App extends React.Component {

  componentDidMount() {
    clearLocalNotifications()
    setLocalNotifications()
  }

  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={styles.container}>
          <UdaciStatusBar backgroundColor="#093052c7" barStyle="light-content" />
          <MainNavigator />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})
