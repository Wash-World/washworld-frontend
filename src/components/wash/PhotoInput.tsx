// src/components/wash/PhotoInput.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../constants/colors";

export interface PhotoInputProps {
  uri: string | null;
  onPickImage: () => void;
  onTakePhoto: () => void;
}

const PhotoInput: React.FC<PhotoInputProps> = ({ uri, onPickImage, onTakePhoto }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>Add a photo (optional)</Text>
    <View style={styles.boxWrapper}>
      <TouchableOpacity style={styles.photoBox} onPress={onPickImage}>
        {uri ? <Image source={{ uri }} style={styles.photo} /> : <Feather name="upload-cloud" size={32} color={colors.gray20} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={onTakePhoto}>
        <Feather name="camera" size={24} color={colors.gray20} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    color: colors.gray80,
    marginBottom: 8,
  },
  boxWrapper: {
    position: "relative",
  },
  photoBox: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray20,
    borderStyle: "dashed",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  cameraButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 6,
    elevation: 3,
  },
});

export default PhotoInput;
