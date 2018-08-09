import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  
  } from "react-native";

const { params} = this.props.navigation.state;
export default class GoodScreen extends React.Component {

  handlePress = (item) => {
    params.alert(item)
    params.delete(item.id)
    this.props.navigation.goBack();
  }  

  renderPrices = (good) => {
    if (good.originalPrice == undefined) {
      return (
        <View style = {{flexDirection: 'row'}}>
          <Text>Цена: </Text><Text style={{}}>{good.currentPrice} тенге</Text>
        </View>
      )
    }
    else {
      return (
        <View>
        <View style = {{ flexDirection:'row'}}>
          <Text>Цена: </Text><Text style={styles.originalPrice}>{good.originalPrice} тенге</Text>
        </View>
        <View style = {{ flexDirection:'row'}}>
        <Text>Цена со скидкой: </Text><Text style={styles.currentPrice}>{good.currentPrice} тенге</Text>
        </View>
        </View>
      )
    }
  }

  render() {
    
    console.log('here nav: ', this.props.navigation)
    const  item = this.props.navigation.getParam('good');
    const deletefunction = (id) => this.props.navigation.getParam('delete')(id)
    console.log('deletefunction',this.props.navigation.getParam('delete'))
    console.log('myitem', item.originalPrice)
    
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image source={{ uri: item.imageURL }}  style={{ width: 165, height: 200, margin: 4 }} ></Image>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: 'row' }}>
          {this.renderPrices(item)}
        </View>
        <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity
            onPress={()=> {
              this.handlePress(item)
            }}
            style={styles.button}
          >
            <Text>Удалить</Text>
          </TouchableOpacity>  
          
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
  },
  button: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    width: 200,

  },
});