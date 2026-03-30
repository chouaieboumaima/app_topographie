// src/screens/project/CloudsScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const filesData = [
  { id: 1, name: "fichier1.las", status: "pending", percent: 0 },
  { id: 2, name: "fichier2.las", status: "clean", percent: 100 },
  { id: 3, name: "fichier3.las", status: "pending", percent: 20 },
  { id: 4, name: "fichier4.las", status: "error", percent: 0 },
];

const generateParticles = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * 700,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 0.5 + 0.1,
    anim: new Animated.Value(Math.random() * 700),
  }));
};

export default function CloudsScreen() {
  const [files, setFiles] = useState(filesData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [particles] = useState(generateParticles(40));
  const [isPaused, setIsPaused] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  // Animation particules
  useEffect(() => {
    particles.forEach((p) => {
      Animated.loop(
        Animated.timing(p.anim, {
          toValue: -10,
          duration: 15000 / p.speed,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  // Gestion du nettoyage progressif
  useEffect(() => {
    if (!selectedFile || !isCleaning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === selectedFile.id && f.percent < 100) {
              const nextPercent = Math.min(f.percent + 1, 100);
              progressAnim.setValue(nextPercent);
              return {
                ...f,
                percent: nextPercent,
                status: nextPercent === 100 ? "clean" : "pending",
              };
            }
            return f;
          })
        );
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [selectedFile, isCleaning, isPaused]);

  const getStatusColor = (file) => {
    if (file.status === "clean") return "#2ECC71";
    if (file.status === "pending") return "#95A5A6";
    if (file.status === "error") return "#E74C3C";
    return "#7F8C8D";
  };

  const handleClear = () => {
    if (!selectedFile) return;
    setIsCleaning(true);
    setIsPaused(false);
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  const resetFile = () => {
    if (!selectedFile) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === selectedFile.id ? { ...f, status: "pending", percent: 0 } : f
      )
    );
    progressAnim.setValue(0);
    setIsPaused(false);
    setIsCleaning(false);
  };

  const renderFile = ({ item }) => (
    <TouchableOpacity
      style={styles.fileCard}
      onPress={() => {
        setSelectedFile(item);
        setShowModal(true);
        progressAnim.setValue(item.percent);
        setIsCleaning(item.status === "pending" && item.percent > 0);
        setIsPaused(false);
      }}
    >
      <View style={styles.iconBox}>
        <MaterialIcons name="cloud" size={26} color={getStatusColor(item)} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {item.status === "clean"
            ? "Nettoyé"
            : item.status === "pending"
            ? "En cours"
            : item.status === "error"
            ? "Erreur"
            : "Statut inconnu"}
        </Text>
        {item.status === "pending" && (
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) },
              ]}
            />
          </View>
        )}
      </View>
      <Text style={styles.filePercent}>{item.percent}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: "rgba(200, 224, 242, 0.5)",
            transform: [{ translateX: p.x }, { translateY: p.anim }],
          }}
        />
      ))}

      <View style={styles.header}>
        <Text style={styles.title}>Nuages de points</Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFile}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Modal playlist */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFile && (
              <>
                <Text style={styles.modalTitle}>{selectedFile.name}</Text>

                <View style={styles.progressContainer}>
                  <Animated.View style={styles.progressBarBackground}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }) },
                      ]}
                    />
                  </Animated.View>
                  <Text style={styles.percentText}>{selectedFile.percent}%</Text>
                </View>

                <View style={styles.controlsRow}>
                  <TouchableOpacity style={styles.controlButton} onPress={togglePause}>
                    <FontAwesome5 name={isPaused ? "play" : "pause"} size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.controlButton, styles.clearButton]} onPress={handleClear}>
                    <FontAwesome5 name="trash" size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton} onPress={resetFile}>
                    <FontAwesome5 name="redo" size={24} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton} onPress={() => setShowModal(false)}>
                    <FontAwesome5 name="times" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB", paddingHorizontal: 20 },
  header: { marginTop: 50, marginBottom: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#2F4858" },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2F4858",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  iconBox: {
    backgroundColor: "#EEF2F7",
    padding: 12,
    borderRadius: 14,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: { flex: 1 },
  projectName: { fontSize: 17, fontWeight: "600", color: "#2F4858" },
  subtitle: { fontSize: 13, color: "#8A97A6", marginTop: 3 },
  filePercent: { fontSize: 16, fontWeight: "700", color: "#2F4858" },

  progressBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#2ECC71",
    borderRadius: 3,
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", backgroundColor: "#626466", padding: 15, borderRadius: 22, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#ffffff" },

  progressContainer: { width: "100%", alignItems: "center", marginBottom: 25 },
  percentText: { color: "#fff", fontWeight: "700", marginTop: 10 },

  controlsRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  controlButton: {
    backgroundColor: "#34495E",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  clearButton: { backgroundColor: "#E74C3C" },
});