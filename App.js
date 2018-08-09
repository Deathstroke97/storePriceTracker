import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { createStackNavigator } from "react-navigation";
import { Toolbar, ToolbarContent } from "react-native-paper";
import firebase from "react-native-firebase";

import HomeScreen from "./components/HomeScreen";
import StoresScreen from "./components/StoresScreen";
import AddNewOddScreen from "./components/AddNewOddScreen";
import GoodScreen from "./components/GoodScreen";

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Stores: StoresScreen,
    AddNewOdd: AddNewOddScreen,
    Good: GoodScreen,
  },
  {
    initialRouteName: "Home"
  }
);
