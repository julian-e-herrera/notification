import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
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
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Schedule Notification" onPress={scheduleNotifHandler} />
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
