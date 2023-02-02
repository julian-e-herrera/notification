import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configPushNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (!finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notification need the appropiate permissions."
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configPushNotification();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notifucation recieved");
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );
    const subResponse = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification responded");
        console.log(response);
      }
    );
    return () => {
      subscription.remove();
      subResponse.remove();
    };
  }, []);

  const scheduleNotifHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My fisrt local notification",
        body: "body of nt itself",
        data: {
          userName: "Juli4n",
        },
      },
      trigger: { seconds: 5 },
    });
  };

  async function sendPushNotificationhandler() {
    const message = {
      to: "ExponentPushToken[7YPUN1I8FW2xCAWvm0_GYd]", //TODO: should be a variable stored on db
      sound: "default",
      title: "Original Title sent from a device!!",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Schedule Notification" onPress={scheduleNotifHandler} />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationhandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
