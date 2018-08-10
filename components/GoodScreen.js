import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";

// const { params} = this.props.navigation.state;
export default class GoodScreen extends React.Component {

  static navigationOptions = {
    title: "Доп.информация",
    headerStyle: {
      backgroundColor: "#DBC5BF",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  openExternalLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }




  handlePress = (item) => {
    const { params } = this.props.navigation.state;

    _alert = () => {
      Alert.alert("", "Удалить товар?", [
        {
          text: "Нет", onPress: () => {
          }
        },
        {
          text: "Да",
          onPress: () => {
            params.delete(item.id);
            this.props.navigation.goBack();
          }
        }
      ]);
    }
    _alert();
  }

  renderPrices = (good) => {
    if (good.originalPrice == undefined) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text>Цена: </Text><Text style={{}}>{good.currentPrice} тенге</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Цена: </Text><Text style={styles.originalPrice}>{good.originalPrice} тенге</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Цена со скидкой: </Text><Text style={styles.currentPrice}>{good.currentPrice} тенге</Text>
          </View>
        </View>
      )
    }
  }

  render() {
    const item = this.props.navigation.getParam('good');


    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 3, marginTop: 20 }}>
          <Image source={{ uri: item.imageURL }} style={{ width: 165, height: 200, margin: 4, resizeMode: 'contain' }} ></Image>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', justifyContent: "center", alignItems: "center", fontSize: 15, marginBottom: 15, fontSize: 18, marginTop: 15 }}>{item.title}</Text>
          {this.renderPrices(item)}
          {/* {this.renderStore(item)} */}
        </View>
        <View style={{ flex: 1, paddingTop: 80, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              this.handlePress(item)
            }}
            style={styles.button}
          >
            <Text>Удалить</Text>
          </TouchableOpacity>

        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              this.openExternalLink(item.link)
            }}
            style={styles.button2}
          >
            <Text>Перейти на сайт</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
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
    fontSize: 15
  },
  currentPrice: {
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold'

  },

  button: {
    alignItems: "center",
    backgroundColor: "#D15660",
    padding: 10,
    width: 200,
    borderRadius: 10

  },
  button2: {
    alignItems: "center",
    backgroundColor: "#569ED1",
    padding: 10,
    width: 200,
    borderRadius: 10

  },

});