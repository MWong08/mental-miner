import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OutfitCollection({ outfits }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👗 Your Outfit Collection</Text>
      {outfits.length === 0 ? (
        <Text style={styles.empty}>No outfits yet. Open some chests!</Text>
      ) : (
        outfits.map((item, index) => (
          <Text
            key={index}
            style={[
              styles.item,
              item.includes("Common") && styles.common,
              item.includes("Rare") && styles.rare,
              item.includes("Legendary") && styles.legendary,
            ]}
          >
            • {item}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  empty: { fontStyle: "italic", color: "gray" },
  item: { fontSize: 18, marginVertical: 4 },
  common: { color: "green" },
  rare: { color: "blue" },
  legendary: { color: "gold" },
});
