import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { ImageData } from "../services/BucketService";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "images"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const imageList: ImageData[] = [];
        querySnapshot.forEach((doc) => {
          imageList.push({
            id: doc.id,
            ...doc.data(),
          } as ImageData);
        });
        setImages(imageList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="refresh-outline" size={36} color="#f97316" />
        <Text style={styles.loadingText}>Loading memories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Ionicons name="camera-outline" size={28} color="#ffffff" />
        <Text style={styles.addButtonText}>Add New Memory</Text>
      </Pressable>

      {images.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={72}
            color="#f97316"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>No memories yet!</Text>
          <Text style={styles.emptySubtext}>
            Start building your collection of beautiful memories.{"\n"}
            Tap the button above to add your first memory.
          </Text>
        </View>
      ) : (
        images.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
              style={styles.img}
              source={{
                uri: item.imageUrl,
              }}
            />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Ionicons name="image-outline" size={20} color="#f97316" />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#dc2626" />
                <Text style={styles.cardDate}>
                  {item.createdAt instanceof Date
                    ? item.createdAt.toLocaleDateString()
                    : (item.createdAt as any)?.toDate?.()
                    ? (item.createdAt as any).toDate().toLocaleDateString()
                    : "Unknown date"}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fef3c7",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fef3c7",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  addButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    padding: 32,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#7c2d12",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 24,
    borderRadius: 25,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: "#fbbf24",
  },
  img: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  cardContent: {
    width: "100%",
    paddingHorizontal: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#fef3c7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#7c2d12",
    textAlign: "center",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fed7aa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  cardDate: {
    fontSize: 14,
    color: "#9a3412",
    textAlign: "center",
    fontWeight: "600",
    marginLeft: 6,
  },
  loadingText: {
    fontSize: 20,
    color: "#dc2626",
    fontWeight: "700",
    marginTop: 16,
  },
});
