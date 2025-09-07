import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Chest({ points, onOpenChest }) {
  const [reward, setReward] = useState(null);

  const openChest = () => {
    if (points < 10) {
      setReward("⚠️ Not enough points! (Need 10)");
      return;
    }

    const roll = Math.random();
    let item, rarity;
    if (roll < 0.7) {
      item = "👕 Common Outfit";
      rarity = "common";
    } else if (roll < 0.95) {
      item = "🧢 Rare Outfit";
      rarity = "rare";
    } else {
      item = "👑 Legendary Outfit";
      rarity = "legendary";
    }

    setReward({ item, rarity });
    onOpenChest(item, rarity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 Chest</Text>
      <Button title="Open Chest (10 pts)" onPress={openChest} />
      {reward && (
        <Text style={[styles.reward, styles[reward.rarity]]}>{reward.item}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reward: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  common: { color: "green" },
  rare: { color: "blue" },
  legendary: { color: "gold" },
});
