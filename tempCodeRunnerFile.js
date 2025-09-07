  return (
    <View style={styles.container}>
      <Text style={styles.header}>⏳ Mental Miner</Text>
      <Text style={styles.points}>Points: {points}</Text>

      <Timer onSessionComplete={handleSessionComplete} />
      <Chest points={points} onOpenChest={handleOpenChest} />
      <OutfitCollection outfits={outfits} />
    </View>
  );