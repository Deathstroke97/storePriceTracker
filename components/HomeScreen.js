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

const { width } = Dimensions.get("window");
const db = firebase.database();
const notifs = firebase.notifications();




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
    stores : [
      {
        imageURL:
          "https://i.pinimg.com/originals/4b/3e/cc/4b3ecc09e3b4fb647b0e8ff66b6312dd.jpg",
        id: 41,
        title: 'dkafdkaf afdafdfa kxjnckjdxc sdkfjsdkj',
        originalPrice: "12 000 tg",
        currentPrice: '10 000 tg',
      },
      {
        imageURL:
          "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/092016/untitled-1_17.jpg?itok=PMxwI3X0",
        id: 26,
        title: 'dkafdkaf afdafdfa',
        originalPrice: "12 000 tg",
        currentPrice: '10 006 tg',
      },
      { imageURL: "https://image.ibb.co/i4eHtH/ww.png", id: 1, title: 'dkafdkaf afdafdfa', currentPrice: '10 000 tg', },
      {
        imageURL:
          "https://yt3.ggpht.com/a-/ACSszfFZuuqkGPSjOiHwDrLNvM53iJm5TK54CrA7gg=s900-mo-c-c0xffffffff-rj-k-no",
        id: 7,
        title: 'dkafdkaf afdafdfa',
        currentPrice: '10 002 tg',
      },
      { imageURL: "https://colibri.org.kz/storage/boutiques/tekhnodom/logo.png", id: 6, title: 'dkafdkaf afdafdfa', currentPrice: '10 000 tg', },
      {
        imageURL:
          "https://image.isu.pub/150210012900-10151cf6131f67d8bf0c77df2803a909/jpg/page_1_thumb_large.jpg",
        id: 4,
        title: 'dkafdkaf afdafdfa',
        originalPrice: "12 004 tg",
        currentPrice: '10 003 tg',
      }
    ],
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
    let newGoods = this.state.trackers.filter(other => {
      return other.id != id;
    });
    console.log("deletedID:", id);
    console.log("newGoods", newGoods);

    db.ref(`TRACKERS/${USERID}/${id}`).set(null);

    this.setState({ trackers: newGoods });


  }

  deleteGood2 = async (id) => {
    console.log('i am here to delete', id)
    const USERID = await AsyncStorage.getItem("userID");
    let newGoods = this.state.stores.filter(other => {
      return other.id != id;
    });
    console.log("deletedID:", id);
    console.log("newGoods", newGoods);

    //db.ref(`TRACKERS/${USERID}/${id}`).set(null);

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

  _alert = item => {
    Alert.alert("", "Удалить товар?", [
      { text: "Нет", onPress: () => {return false}},
      {
        text: "Да",
        onPress: () => {
          // console.log('deleting', item)
          // this.deleteGood(item.id) &&
          //   this.props.navigation.goBack() &&
          //   console.log("successfull");
          return true;
        }
      }
    ]);
  }

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

  render() {
    console.log('check', this.props.navigation)

    if (this.state.isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    console.log('mytrackers', this.state.trackers);
    return (

      <View style={styles.container}>

        {this.state.trackers.length !== 0 ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text>Добавьте товар в список</Text>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
        ) : (

            <FlatList
              contentContainerStyle={{ margin: 4 }}
              horizontal={false}
              numColumns={2}
              data={this.state.stores}
              extraData = {this.state.stores}
              
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Good", {
                    good: item,
                    delete: this.deleteGood2.bind(this),
                    alert: this._alert.bind(this)
                    
                  })}>
                    <View style={styles.oddView}>
                      <Image
                        style={{ width: width / 2, height: 200, margin: 4 }}
                        source={{ uri: item.imageURL }}
                      />
                      <Text>
                        Товар:<Text style={{ fontWeight: "bold" }}>
                          {item.title}
                        </Text>
                      </Text>
                      <Text style={{ paddingBottom: 50 }}>Цена: {item.currentPrice} тенге</Text>
                      <TouchableOpacity
                        style={styles.buttonDelete}
                        onPress={() => this._alert(item)}
                      >
                        <Text>Удалить</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => item.id}
            />
          )}
        <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('Stores')}>
          <Image style={styles.myAddBtn} source={require('./img/myplus.png')} />
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
    width: 70,
    height: 70,
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
