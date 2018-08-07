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
import { Notification } from 'react-native-firebase';

const { width, height } = Dimensions.get("window");
const db = firebase.database();
const messaging = firebase.messaging();


const stores = [
  {
    url:
      "https://i.pinimg.com/originals/4b/3e/cc/4b3ecc09e3b4fb647b0e8ff66b6312dd.jpg",
    id: 41
  },
  {
    url:
      "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/092016/untitled-1_17.jpg?itok=PMxwI3X0",
    id: 26
  },
  { url: "https://image.ibb.co/i4eHtH/ww.png", id: 1 },
  {
    url:
      "https://yt3.ggpht.com/a-/ACSszfFZuuqkGPSjOiHwDrLNvM53iJm5TK54CrA7gg=s900-mo-c-c0xffffffff-rj-k-no",
    id: 7
  },
  { url: "https://colibri.org.kz/storage/boutiques/tekhnodom/logo.png", id: 6 },
  {
    url:
      "https://image.isu.pub/150210012900-10151cf6131f67d8bf0c77df2803a909/jpg/page_1_thumb_large.jpg",
    id: 4
  }
];

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Мои товары",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    isLoading: true,
    trackers: [],
    trackersRef: null,
    goods: [
      {
        imageURL:
          "https://a.lmcdn.ru/pi/img236x341/R/A/RA084AMAISF6_6203977_1_v2.jpg",
        title: "Кроссовки Wicked One",
        currentPrice: "14 500 тг",
        id: 4
      },
      {
        imageURL:
          "https://a.lmcdn.ru/pi/img389x562/D/I/DI028AMPQX33_4487223_1_v2.jpg",
        title: "Кроссовки Wicked One",
        currentPrice: "21 500 тг",
        id: 5
      },
      {
        imageURL:
          "https://lanita.ru/images/offer/5820/2/su789emvcd22/su789emvcd22.jpg",
        title: "Мужская Одежда SuperDRY 2018",
        currentPrice: "44 500 тг",
        id: 6
      },
      {
        imageURL:
          "https://a.lmcdn.ru/pi/img236x341/J/H/JH001EMAYSW0_6987647_1_v1.jpg",
        title: "Футболкa s.Oliver",
        currentPrice: "9 500 тг",
        id: 7
      },
      {
        imageURL:
          "https://a.lmcdn.ru/pi/img236x341/S/O/SO917EMBWNW7_6951739_1_v1.jpg",
        title: "Футболкa s.Oliver",
        currentPrice: "10 500 тг",
        id: 8
      },
      {
        imageURL:
          "https://a.lmcdn.ru/pi/img236x341/W/I/WI015EMWOB33_5188808_1_v3.jpg",
        title: "Футболкa s.Oliver",
        currentPrice: "24 100 тг",
        id: 9
      }
    ],
  };


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
    let newGoods = this.state.goods.filter(other => {
      return other.id != id;
    });
    console.log("deletedID:", id);
    console.log("newGoods", newGoods);

    db.ref(`TRACKERS/${USERID}/${id}`).set(null);

    this.setState({ goods: newGoods });


  };


  requestNotificationPermission = async () => {
    console.log('here');
    try {
      const enabled = await firebase.messaging().hasPermission();

      if (enabled) {
        const token = await firebase.messaging().getToken();
        ;
        if (!token) {
          const res = await fetch('http://192.168.88.19:3000/api/db/register')   //"https://store-price-tracker.herokuapp.com/api/db/register"
          const result = await res.json();
          await AsyncStorage.setItem("userID", result);
          await AsyncStorage.setItem("userToken", token);
        }
      }
      else {
        // ask for permission again
        await firebase.messaging().requestPermission();
      }

      return Promise.resolve();

    } catch (e) {
      return Promise.reject();
    }
  };


  retrieveData = async () => {
    try {
      console.log('s')

      const ID = await AsyncStorage.getItem("userID");
      console.log('ID', ID)
      if (!ID) {
        await this.requestNotificationPermission()
      }
      else {
        
        this.state.trackersRef = db.ref(`TRACKERS/${ID}`).on('value', snapshot => {
          
          var trackers = [];

          snapshot.forEach(dataSnapshot => {
            trackers.push(dataSnapshot.val())
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

  alert = item => {
    Alert.alert("", "Удалить товар?", [
      { text: "Нет", onPress: () => console.log("отмена") },
      {
        text: "Да",
        onPress: () => {
          this.deleteGood(item.id) &&
            this.props.navigation.goBack() &&
            console.log("successfull");
        }
      }
    ]);
  };

  beginListeningForMessages(){

    console.log("begin listening for messages")

    firebase.notifications().onNotification(notif => {
      console.log(notif)
    })
  }

  componentDidMount() {
    this.beginListeningForMessages();
    this.retrieveData();
  }

  componentWillUnmount(){
    this.state.trackersRef()
  }

  render() {

    if (this.state.isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
      <View style={styles.container}>
        {this.state.trackers.length !== 0 ? (
          <View style={{ flex: 1 }}>
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Text>Добавьте товар в список</Text>
            </View>
            
          </View>
          
          
        ) : (
            
              <FlatList
                contentContainerStyle={{ margin: 4 }}
                horizontal={false}
                numColumns={2}
                data={this.state.goods}
                horizontal={false}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.oddView}>
                      <Image
                        style={{ width: 150, height: 150, margin: 4 }}
                        source={{ uri: item.imageURL }}
                      />
                      <Text>
                        Товар:<Text style={{ fontWeight: "bold" }}>
                          {item.title}
                        </Text>
                      </Text>
                      <Text style={{ paddingBottom: 50 }}>Цена: {item.currentPrice}</Text>
                      <TouchableOpacity
                        style={styles.buttonDelete}
                        onPress={() => this.alert(item)}
                      >
                        <Text>Удалить</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => {
                  item.id;
                }}
              />
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Stores')}>
                <Image style={styles.myAddBtn} source={require('./img/myplus.png')} />
              </TouchableOpacity>
            
            
          )}
            
              
           
      </View>
    );
  }
}

const styles = StyleSheet.create({
  goodContainer: {
    flex: 8,
  },
  myAddBtn: {
    width: 70,
    height: 70,
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  container: {
    flex: 1
  },
  oddView: {
    backgroundColor: "pink",
    width: width / 2,
    borderColor: "green",
    borderBottomColor: "green",
    borderWidth: 2
  },

  addBtn: {

    position: "absolute",
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
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
    width: 50,
    height: 50,
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
