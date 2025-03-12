import React from "react";
import { View, StyleSheet } from "react-native";
import BottomToolbar from "./BottomToolbar";

const ScreenWithToolbar = ({ children, navigation, route }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomToolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWithToolbar;