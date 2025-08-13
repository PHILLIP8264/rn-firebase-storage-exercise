import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export interface ImageData {
  id?: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
}

export const uploadImageToStorage = async (
  uri: string,
  title: string
): Promise<void> => {
  try {
    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to the storage location
    const fileName = `images/${Date.now()}_${title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}`;
    const storageRef = ref(storage, fileName);

    // Upload the image
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save to Firestore
    await addDoc(collection(db, "images"), {
      title,
      imageUrl: downloadURL,
      createdAt: new Date(),
    });

    console.log("Image uploaded successfully!");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
