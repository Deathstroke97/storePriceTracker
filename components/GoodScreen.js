import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  View
} from "react-native";

export default class StoresScreen extends React.Component {

  renderPrices = (good) => {
    if (good.originalPrice == null) {
      return (
        <View>
          <Text>Цена: </Text><Text style={{}}>{originalPrice} тенге</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text>Цена: </Text><Text style={styles.originalPrice}>{originalPrice} тенге</Text>
          <Text>Цена со скидкой: </Text><Text styles={styles.currentPrice}>{currentPrice} тенге</Text>
        </View>
      )
    }
  }

  render() {
    const { item } = this.props.navigation.getParam('item');
    const imageURL = item.imageURL;
    const title = item.title;
    const currentPrice = item.currentPrice;
    const originalPrice = item.originalPrice;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image source={{ uri: imageURL }}></Image>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {this.renderPrices(item)}
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    color: 'green',
  }
});