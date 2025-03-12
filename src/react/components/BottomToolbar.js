import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const BottomToolbar = ({ navigation }) => {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomePage")}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SalesOrdersPage")}
      >
        <Text style={styles.buttonText}>Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#007AFF",
  },
});

export default BottomToolbar;