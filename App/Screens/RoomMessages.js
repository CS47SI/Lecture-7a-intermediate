import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, KeyboardAvoidingView, AlertIOS } from 'react-native';
import { material } from 'react-native-typography';
import { Metrics, Colors } from '../Themes';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';

export default class RoomMessages extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: params.name,
      tabBarIcon: ({ tintColor }) => (
        <Entypo name="home"
          size={Metrics.icons.medium}
          color={tintColor} />
      ),
    };
  };

  state = {
    text: "",
    rooms: []
  }

  proceedWithName = async (name) => {
    this.setState({name});
    //STEP 1:
    /* At this point everything that was sent in to this screen through navigation is still in navigation params.
       We have only acquired a name for the user to join the chat room. The user expects things to start loading
       here since we don't require sign in.
       Using the key that you should have sent from ChatRooms, build a reference to the conversation that corresponds
       to this chat room. The reference then should listen to ALL NEW MESSAGES in this chat room, and not only listen
       once. You know, like a real chat room :-).
       Stuck? Check out how we did ChatRooms listener in ChatRooms. It should help
       TODO: It's time to put ears on and start listening
     */
  }

  getUserName = () => {
    AlertIOS.prompt(
      'Enter name',
      'Enter your name for this channel',
      [
        {
          text: 'Cancel',
          onPress: () => this.props.navigation.goBack(),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (name) => name.length === 0 ? this.getUserName() : this.proceedWithName(name),
        },
      ]
    );
  }

  componentWillMount() {
    //Prompts the user to enter their name. Use "proceedWithName" as your
    //"componentWillMount" function
    this.getUserName();
  }

  componentWillUnmount() {
    //Make sure that you turn off the listeners here. Whatever the reference you used in mounting
    // turn it off here
    //STEP 3:
    /*
      Try opening a chat room. Go back to the main screen, then open the same room again. Did you
      get only the last message? That is because of the way listeners for Firebase works. Firebase
      was not told that your app turned off this specific reference/listener. It's still listening
      even if nothing is showing up. To kill unncessary warnings, and reset pages properly when
      needed (like in this case), Firebase gives you an "off()" function for the references. It's
      very simple. Just do reference.off(), and you should be good to go.
     */
  }

  send = () => {
    //Send message with a sender field
    //Transaction the counter
    //STEP 2:
    /* STOP! We highly recommend doing STEP 1 before this. It is not necessary, but you will have
       though times making sure this works without STEP 1.

       Now we wanna be part of the conversation. We want to push to the "convos/[this room]" reference
       our message. In addition, the server needs to know who is sending the message to allow other
       users to know who is sending what. The object that you push to the "convos/[this room]" reference
       needs to be in the format {message: user's message, sender: user's name}. Pushing here
       is very similar to pushing in the ChatRooms page. Once you get this working and STEP 1 working
       you must be able to see messages pop up as you send them.
       Note: It'd be nice to empty up the textInput as well
     */

     //STEP 4 (Optional):
     /*
       We will go over this as a class in a bit, but if you can't wait, we are not going to hold
       you. We want to update the count of messages for this room. You might think, well, grab
       the count, add one, and send it back. Most likely in-class it'll work, but you are building
       an app to be usable by millions. What if 2 users grabbed the same number of counts, and they
       changed the count at very close times? Your count will be wrong :'(. Transactions is
       how Firebase deals with this issue (aka concurrency). Look into it, and see if you can
       figure it out. It's pretty straightforward
      */
  }

  _renderItem = ({item}) => {
    //Style to make the messages be on the left or right side based on the sender
    const additionalStyle = item.sender === this.state.name ? {justifyContent: 'flex-end', marginRight: Metrics.doubleBaseMargin, marginLeft: Metrics.doubleBaseMargin*2}
                                                            : {justifyContent: 'flex-start', marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin*2};

    return (
      <View style={[{flexDirection: 'row', marginTop: Metrics.marginVertical},additionalStyle]}>
        <View style={{flexDirection: 'column'}}>
          <Text> {item.sender} </Text>
          <View style={styles.chatBubble}>
            <Text style={[material.subheading,{color: Colors.silver}]}> {item.message} </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
        behavior={"padding"}
        keyboardVerticalOffset={Metrics.bottomBarHeight}>
        <FlatList
          data={this.state.rooms}
          renderItem={this._renderItem}
          style={styles.container}
          />
        <View style={styles.sendChatContainer}>
          <TextInput
            style={styles.newRoom}
            value={this.state.text}
            onChangeText={(text) => this.setState({text})}
            placeholder="Be part of the conversation..."/>
          <Button
            title="Send"
            onPress={this.send}/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sendChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    borderTopWidth: Metrics.horizontalLineHeight,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical
  },
  newRoom: {
    borderBottomWidth: Metrics.horizontalLineHeight,
    flex: 1,
    borderBottomColor: Colors.border,
    marginRight: Metrics.marginHorizontal
  },
  chatBubble: {
    paddingLeft: Metrics.marginVertical,
    paddingRight: Metrics.marginVertical,
    paddingBottom: Metrics.marginVertical,
    paddingTop: Metrics.marginVertical,
    borderRadius: Metrics.marginVertical,
    backgroundColor: Colors.terquoise
  }
});
