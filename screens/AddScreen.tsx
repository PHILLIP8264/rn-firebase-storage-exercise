import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { uploadImageToStorage } from "../services/BucketService";

const AddScreen = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (uploading) {
      const rotation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();
      return () => rotation.stop();
    }
  }, [uploading, rotateValue]);

  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddMemory = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your memory");
      return;
    }

    if (!image) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    setUploading(true);
    try {
      await uploadImageToStorage(image, title);
      Alert.alert("Success", "Memory added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setImage(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Create a Beautiful Memory</Text>
        <Text style={styles.screenSubtitle}>
          Capture and save your special moments
        </Text>
      </View>

      <TextInput
        style={styles.inputField}
        placeholder="Enter your memory title..."
        placeholderTextColor="#9a3412"
        onChangeText={(newText) => setTitle(newText)}
        value={title}
      />

      {/* Image Upload Section */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <View style={styles.buttonContent}>
          <Ionicons
            name={image ? "refresh-outline" : "camera-outline"}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.buttonText}>
            {image ? "Change Image" : "Pick an Image from Camera Roll"}
          </Text>
        </View>
      </TouchableOpacity>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.selectedImage} />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleAddMemory}
        disabled={uploading}
      >
        <View style={styles.buttonContent}>
          {uploading ? (
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotateValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <MaterialCommunityIcons
                name="loading"
                size={20}
                color="#ffffff"
              />
            </Animated.View>
          ) : (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color="#ffffff"
            />
          )}
          <Text style={styles.buttonText}>
            {uploading ? "Uploading..." : "Add Memory"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fef3c7",
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
  },
  screenSubtitle: {
    fontSize: 17,
    color: "#7c2d12",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
  },
  inputField: {
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#fbbf24",
    borderRadius: 16,
    marginTop: 24,
    padding: 18,
    fontSize: 17,
    color: "#7c2d12",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    fontWeight: "600",
  },
  imageButton: {
    backgroundColor: "#f97316",
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fbbf24",
  },
  selectedImage: {
    width: "100%",
    height: 240,
    borderRadius: 18,
  },
  button: {
    backgroundColor: "#dc2626",
    borderRadius: 18,
    padding: 20,
    marginTop: 36,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#fed7aa",
    shadowOpacity: 0.2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginLeft: 10,
  },
});
