import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

export default class StoresScreen extends React.Component {
  static navigationOptions = {
    title: "Онлайн магазины",
    headerStyle: {
      backgroundColor: "#DBC5BF",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    stores: []
  };

  componentDidMount() {
    fetch('http://store-price-tracker.herokuapp.com/api/db/stores')
      .then(res => res.json())
      .then(json => {
        this.setState({ stores: json })
      });
  }

  render() {
    console.log("storesScreen", this.state.stores);
    return (
      <FlatList
        contentContainerStyle={{ margin: 10 }}
        numColumns={2}
        horizontal={false}
        data={this.state.stores}
        renderItem={({ item }) => {
          console.log('item: ', item)

          return (
            <TouchableOpacity
              onPress={() => {
                console.log('here', this.props.navigation)
                this.props.navigation.navigate("AddNewOdd", {
                  info: item
                });
              }}
            >
              <Image source={{ uri: item.logoURL }} style={{ width: 150, height: 150, margin: 10, resizeMode: 'contain' }} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => {
          return item.name;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
