import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Timer({ onSessionComplete }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Countdown logic
  useEffect(() => {
    let interval = null;
    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && running) {
      setRunning(false);
      onSessionComplete?.(); // Award points when session ends
    }
    return () => clearInterval(interval);
  }, [running, seconds]);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
      </Text>
      {!running ? (
        <>
          <Button title="Start 5-min Session" onPress={() => { setSeconds(300); setRunning(true); }} />
          <Button title="Start 25-min Session" onPress={() => { setSeconds(1500); setRunning(true); }} />
        </>
      ) : (
        <Button title="Stop" onPress={() => setRunning(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
