import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { AsyncStorage, Alert } from "react-native";
import firebase from "react-native-firebase";
import {
  Card,
  Title,
  Paragraph
} from 'react-native-paper';

const { width, height } = Dimensions.get("window");
const db = firebase.database();
const notifs = firebase.notifications();




export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Мои товары",
    headerStyle: {
      backgroundColor: "#DBC5BF"//"#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    isLoading: true,
    trackers: [],
    stores: [
      {
        imageURL:
          "https://i.pinimg.com/originals/4b/3e/cc/4b3ecc09e3b4fb647b0e8ff66b6312dd.jpg",
        id: 41,
        title: 'Кроссовки от Adidas Originals 2016 ',
        originalPrice: "12 000",
        currentPrice: '10 000',
      },
      {
        imageURL:
          "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/092016/untitled-1_17.jpg?itok=PMxwI3X0",
        id: 26,
        title: 'Кроссовки от Adidas Originals 2016 ',
        originalPrice: "12 000",
        currentPrice: '10 250',
      },
      { imageURL: "https://image.ibb.co/i4eHtH/ww.png", id: 1, title: 'Кроссовки от Adidas Originals 2016 ', currentPrice: '10 000', },
      {
        imageURL:
          "https://yt3.ggpht.com/a-/ACSszfFZuuqkGPSjOiHwDrLNvM53iJm5TK54CrA7gg=s900-mo-c-c0xffffffff-rj-k-no",
        id: 7,
        title: 'Кроссовки от Adidas Originals 2016 ',
        currentPrice: '24500',
      },
      { imageURL: "https://colibri.org.kz/storage/boutiques/tekhnodom/logo.png", id: 6, title: 'dkafdkaf afdafdfa', currentPrice: '9800', },
      {
        imageURL:
          "https://image.isu.pub/150210012900-10151cf6131f67d8bf0c77df2803a909/jpg/page_1_thumb_large.jpg",
        id: 4,

        originalPrice: "12 250",
        currentPrice: '11 000 ',
      }
    ],
    confirmForDelete: false,
  }


  alertForNotification = () => {
    Alert.alert("", "Уведомления важны для работы приложения. Включить уведомления?", [
      { text: "Нет", onPress: () => console.log("отмена") },
      {
        text: "Да",
        onPress: async () => {
          await firebase.messaging().requestPermission()
          console.log("successfull");
        }
      }
    ]);
  };


  deleteGood = async (id) => {
    const USERID = await AsyncStorage.getItem("userID");
    const newGoods = this.state.stores.filter(other => {
      return other.id != id;
    });
    db.ref(`TRACKERS/${USERID}/${id}`).set(null);
    this.setState({ stores: newGoods });
  };



  requestNotificationPermission = async () => {
    try {
      const enabled = await firebase.messaging().hasPermission();

      if (enabled) {
        const userID = await AsyncStorage.getItem("userID");

        if (!userID) {
          const res = await fetch('https://store-price-tracker.herokuapp.com/api/db/register')
          const result = await res.json();

          const token = await firebase.messaging().getToken()

          await AsyncStorage.setItem("userID", result);
          await AsyncStorage.setItem("userToken", token);

          // this.retrieveData()
        }
      } else {
        // ask for permission again
        await firebase.messaging().requestPermission();
        // this.requestNotificationPermission()
      }
    } catch (e) {
    }
  };


  retrieveData = async () => {
    try {

      const ID = await AsyncStorage.getItem("userID");
      const token = await firebase.messaging().getToken()
      console.log(ID, token)
      if (!ID) {
        await this.requestNotificationPermission()
      }
      else {

        this.state.trackersRef = db.ref(`TRACKERS/${ID}`).on('value', snapshot => {

          var trackers = [];

          snapshot.forEach(dataSnapshot => {
            var item = dataSnapshot.val()
            item.id = dataSnapshot.key;
            trackers.push(item)
          })

          console.log(trackers)
          this.setState({
            trackers: trackers,
            isLoading: false
          })
        })

      }
    } catch (error) {
      console.log('error', error)
    }
  };



  beginListeningForMessages() {
    console.log('begin listening for notifications')
    notifs.onNotification(notif => {
      console.log(notif)
    })

  }

  componentDidMount() {
    this.beginListeningForMessages();
    this.retrieveData();
  }

  componentWillUnmount() {
    this.state.trackersRef()
  }

  renderPrices = (good) => {
    if (good.originalPrice == undefined) {
      return (
        <View style={{ width: width / 2, padding: 10 }}>
          <Text>
            Товар:  <Text style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
              {good.title}
            </Text>
          </Text>
          <Text style={{ paddingBottom: 50, fontWeight: 'bold' }}>Цена: {good.currentPrice} тенге</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <View style={{ width: width / 2, padding: 10 }}>
            <Text>
              Товар:  <Text style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                {good.title}
              </Text>
            </Text>
            <Text style={{ fontWeight: 'bold' }}>Цена: </Text><Text style={styles.originalPrice}>{good.originalPrice} тенге</Text>
            <Text style={{ fontWeight: 'bold' }}>Цена со скидкой: </Text><Text style={styles.currentPrice}>{good.currentPrice} тенге</Text>
          </View>



        </View>
      )
    }
  }

  render() {
    console.log('check', this.props.navigation)

    if (this.state.isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    console.log('mytrackers', this.state.trackers);
    return (

      <View style={styles.container}>

        {this.state.trackers.length == 0 ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>Добавьте товар в список</Text>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
        ) : (

            <FlatList
              contentContainerStyle={{ margin: 5 }}
              horizontal={false}
              numColumns={2}
              data={this.state.stores}
              extraData={this.state.stores}

              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Good", {
                    good: item,
                    delete: this.deleteGood.bind(this),


                  })}>
                    <View style={styles.oddView}>
                      <Image
                        style={{ width: width / 2, height: height / 5, margin: 4, resizeMode: 'contain' }}
                        source={{ uri: item.imageURL }}
                      />
                      {this.renderPrices(item)}

                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => item.id}
            />
          )}
        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('Stores')}>
          <Image style={styles.myAddBtn} source={require('./img/lastPlus.png')} />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  goodContainer: {
    flex: 8,
  },
  myAddBtn: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 50,

  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  oddView: {
    width: width / 2,
  },

  addBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 60,
    justifyContent: "center",
    elevation: 8
  },
  buttonDelete: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    position: "absolute",
    bottom: 0,
    padding: 10,
    borderColor: "red"
  },
  actionButtonIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 40,
    height: 40,
    fontSize: 20,
    height: 22,
    color: "white"
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    color: 'green',
    fontWeight: 'bold'
  },
});
