import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Timer from "./components/Timer";
import Chest from "./components/Chest";
import OutfitCollection from "./components/OutfitCollection";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [points, setPoints] = useState(null); // Start with null to detect if data loaded
  const [outfits, setOutfits] = useState([]);
  const [streak, setStreak] = useState(null); // Start with null
  const [lastSessionDate, setLastSessionDate] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Debug function to clear storage and reset (remove this in production)
  const resetApp = async () => {
    await AsyncStorage.clear();
    setPoints(50);
    setStreak(15);
    setOutfits([]);
    setLastSessionDate(null);
    console.log("App reset to defaults");
  };

  // Load saved data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data...");
        
        const savedPoints = await AsyncStorage.getItem("points");
        const savedOutfits = await AsyncStorage.getItem("outfits");
        const savedStreak = await AsyncStorage.getItem("streak");
        const savedDate = await AsyncStorage.getItem("lastSessionDate");

        console.log("Loaded from storage:", {
          points: savedPoints,
          outfits: savedOutfits,
          streak: savedStreak,
          date: savedDate
        });

        // Set points: use saved value ONLY if it's greater than 0, otherwise use default 50
        const pointsValue = (savedPoints !== null && parseInt(savedPoints) > 0) ? parseInt(savedPoints) : 50;
        setPoints(pointsValue);
        console.log("Setting points to:", pointsValue);

        // Set outfits
        setOutfits(savedOutfits ? JSON.parse(savedOutfits) : []);

        // Set streak: use saved value ONLY if it's greater than 0, otherwise use default 15
        const streakValue = (savedStreak !== null && parseInt(savedStreak) > 0) ? parseInt(savedStreak) : 15;
        setStreak(streakValue);
        console.log("Setting streak to:", streakValue);

        // Set last session date
        setLastSessionDate(savedDate || null);

        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        // Set defaults if loading fails
        setPoints(50);
        setStreak(15);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save data whenever state changes (only after data is loaded)
  useEffect(() => {
    const saveData = async () => {
      if (!dataLoaded) return; // Don't save until we've loaded initial data

      try {
        console.log("Saving data:", { points, outfits, streak, lastSessionDate });
        
        await AsyncStorage.setItem("points", points.toString());
        await AsyncStorage.setItem("outfits", JSON.stringify(outfits));
        await AsyncStorage.setItem("streak", streak.toString());
        
        if (lastSessionDate) {
          await AsyncStorage.setItem("lastSessionDate", lastSessionDate);
        }
        
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [points, outfits, streak, lastSessionDate, dataLoaded]);

  // Award points when session finishes
  const handleSessionComplete = () => {
    console.log("Session completed, adding 10 points");
    setPoints((prev) => {
      const newPoints = prev + 10;
      console.log("Points updated from", prev, "to", newPoints);
      return newPoints;
    });

    const today = new Date().toDateString();
    if (lastSessionDate !== today) {
      setStreak((prev) => {
        const newStreak = prev + 1;
        console.log("Streak updated from", prev, "to", newStreak);
        return newStreak;
      });
      setLastSessionDate(today);
    }
  };

  // Deduct points + add reward
  const handleOpenChest = (reward) => {
    console.log("Opening chest, current points:", points);
    if (points >= 10) {
      setPoints((prev) => {
        const newPoints = prev - 10;
        console.log("Points deducted from", prev, "to", newPoints);
        return newPoints;
      });
      setOutfits((prev) => [...prev, reward]);
      console.log("Added outfit:", reward);
    } else {
      console.log("Not enough points to open chest");
    }
  };

  // Show loading while data is being loaded
  if (!dataLoaded || points === null || streak === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⏳ Mental Miner</Text>
      <Text style={styles.points}>⭐ Points: {points}</Text>
      <Text style={styles.streak}>🔥 Streak: {streak} days</Text>
      
      {/* Debug info - remove in production */}
      {/* <Text style={styles.debug}>Debug: Points={points}, Loaded={dataLoaded ? 'Yes' : 'No'}</Text> */}
      {/* <Text style={styles.resetButton} onPress={resetApp}>🔄 Reset App (Debug)</Text> */}

      <Timer onSessionComplete={handleSessionComplete} />
      <Chest points={points} onOpenChest={handleOpenChest} />
      <OutfitCollection outfits={outfits} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#f2f2f2" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  points: { fontSize: 20, marginBottom: 5 },
  streak: { fontSize: 18, color: "orange", marginBottom: 20 },
  centered: { justifyContent: "center" },
  loadingText: { fontSize: 18, color: "#666" },
  debug: { fontSize: 12, color: "#999", marginBottom: 10 },
  resetButton: { fontSize: 14, color: "red", marginBottom: 10, textDecorationLine: "underline" },
});