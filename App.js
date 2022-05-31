import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");

  const askCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  useEffect(() => {
    askCameraPermission();
  }, []);

  const handleScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log(`Type: ${type} \n Data: ${data}`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title="Allow Camera" onPress={() => askCameraPermission()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHMSU</Text>
      <View style={styles.barcodeBox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.mainText}>{text}</Text>

      {scanned && (
        <Button
          title="Scan Again"
          onPress={() => setScanned(false)}
          color="#8bc34a"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: "#8bc34a",
    marginBottom: 30,
    fontWeight: "bold",
  },
  barcodeBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "#8bc34a",
  },
  mainText: {
    fontSize: 16,
    margin: 20,
    color: "white",
  },
});
