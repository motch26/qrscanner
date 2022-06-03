import axios from "axios";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Button,
  Portal,
  Modal,
  RadioButton,
  Text,
  Title,
  Caption,
  Switch,
  Avatar,
  useTheme,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const { colors } = useTheme();

  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#8bc34a",
      backdrop: "rgba(105, 105, 105, 0.7)",
      accent: "#8bc34a",
    },
  };

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");
  const [campus, setCampus] = useState("talisay");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [isIn, setIsIn] = useState(false);
  const [gateType, setGateType] = useState("in");

  const [isLogSuccess, setLogSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isNetworkError, setNetworkError] = useState(false);

  const askCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status == "granted");
    })();
  };

  useEffect(() => {
    askCameraPermission();
  }, []);

  const search = (data) => {
    if (data) {
      axios
        .get(
          `http://gatepath.chmsc.edu.ph/api/search.php?id=${data}&campus=${campus}`
        )
        .then((response) => {
          if (response.data) {
            const { id, name, section } = response.data;
            setName(name);
            setSection(section);
            axios
              .get(
                `http://gatepath.chmsc.edu.ph/api/log.php?id=${id}&type=${gateType}&campus=${campus}`
              )
              .then((logResponse) => {
                setShowSuccess(true);
                if (logResponse.data) setLogSuccess(true);
                else setLogSuccess(false);
              })
              .catch((err) => setNetworkError(true));
          }
        })
        .catch((err) => setNetworkError(true));
    }
  };

  const handleScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    search(data);
  };

  if (hasPermission === null) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text>Requesting camera permission...</Text>
        </View>
      </PaperProvider>
    );
  }

  if (hasPermission === false) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text style={{ margin: 10 }}>No access to camera</Text>
          <Button onPress={() => askCameraPermission()}>Allow Camera</Button>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{ backgroundColor: "white", padding: 10 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <RadioButton
              value="talisay"
              onPress={() => setCampus("talisay")}
              status={campus === "talisay" ? "checked" : "unchecked"}
            />
            <Title style={{ marginLeft: 10 }}>Talisay</Title>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <RadioButton
              value="ft"
              onPress={() => setCampus("ft")}
              status={campus === "ft" ? "checked" : "unchecked"}
            />
            <Title style={{ marginLeft: 10 }}>Fortune Towne</Title>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <RadioButton
              value="binalbagan"
              onPress={() => setCampus("binalbagan")}
              status={campus === "binalbagan" ? "checked" : "unchecked"}
            />
            <Title style={{ marginLeft: 10 }}>Binalbagan</Title>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <RadioButton
              value="alijis"
              onPress={() => setCampus("alijis")}
              status={campus === "alijis" ? "checked" : "unchecked"}
            />
            <Title style={{ marginLeft: 10 }}>Alijis</Title>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          contentContainerStyle={{ backgroundColor: "white", padding: 10 }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            {isLogSuccess ? (
              <>
                <Avatar.Icon size={80} icon="check-circle" />
                <Title style={{ color: "#8bc34a", fontWeight: "800" }}>
                  LOGGED {gateType.toUpperCase()} SUCCESSFULLY!
                </Title>
              </>
            ) : (
              <>
                <Avatar.Icon
                  size={80}
                  icon="alert-circle"
                  style={{ backgroundColor: colors.error }}
                />
                <Title style={{ color: "red", fontWeight: "800" }}>
                  ALREADY LOGGED {gateType.toUpperCase()}!
                </Title>
              </>
            )}
          </View>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <Text style={styles.title}>CHMSU Gate Path</Text>
        <View style={styles.barcodeBox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleScanned}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Title style={{ textAlign: "center" }}>
            Campus: {campus.toUpperCase()}
          </Title>
          <Button
            mode="contained"
            color="#8bc34a"
            onPress={() => setModalVisible(true)}
          >
            Set Campus
          </Button>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Caption>IN</Caption>
            <Switch
              value={isIn}
              color="#8bc34a"
              onChange={() => {
                setIsIn(!isIn);
                setGateType(isIn ? "in" : "out");
              }}
            />
            <Caption>OUT</Caption>
          </View>
        </View>
        {text ? <Text style={styles.mainText}>ID Number: {text}</Text> : null}
        {name ? (
          <>
            <Text style={{ color: "black", fontSize: 18, textAlign: "center" }}>
              Name:{"\n"}{" "}
              <Title style={{ color: "#8bc34a" }}>{name.toUpperCase()}</Title>
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 18,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              Section: {"\n"}{" "}
              <Title style={{ color: "#8bc34a" }}>{section}</Title>
            </Text>
            <Button
              icon="camera"
              onPress={() => {
                setScanned(false);
                setName("");
                setText("");
              }}
              mode="contained"
              color="#8bc34a"
            >
              Scan Again
            </Button>
          </>
        ) : scanned ? (
          <>
            <Text>No record found</Text>
            <Button
              icon="camera"
              onPress={() => {
                setName("");
                setScanned(false);
                setText("");
              }}
              mode="contained"
              color="#8bc34a"
            >
              Scan Again
            </Button>
          </>
        ) : null}
        {isNetworkError ? (
          <Title
            style={{
              color: "white",
              paddingVertical: 1,
              paddingHorizontal: 8,
              borderRadius: 5,
              backgroundColor: "red",
            }}
          >
            Network Error!
          </Title>
        ) : null}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    paddingVertical: 3,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: "#8bc34a",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
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
    margin: 10,
  },
});
