import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function ARScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  const [hologramView, setHologramView] = useState<'emperor' | 'warrior' | 'thinker'>('emperor');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const hologramViews = {
    emperor: {
      name: 'Emperor Victor',
      description: 'Regal presence, crown projection, commanding aura',
      icon: 'planet' as const,
      color: '#fbbf24',
    },
    warrior: {
      name: 'Warrior Victor',
      description: 'Battle stance, armor projection, protective field',
      icon: 'shield' as const,
      color: '#ef4444',
    },
    thinker: {
      name: 'Thinker Victor',
      description: 'Contemplative pose, neural network visualization',
      icon: 'bulb' as const,
      color: '#a78bfa',
    },
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color="#ef4444" />
        <Text style={styles.text}>Camera permission denied</Text>
        <Text style={styles.subtext}>Enable camera access in settings to use AR mode</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {arActive ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera}>
            <View style={styles.overlay}>
              <View style={styles.hologramInfo}>
                <Text style={styles.hologramTitle}>{hologramViews[hologramView].name}</Text>
                <Text style={styles.hologramDesc}>{hologramViews[hologramView].description}</Text>
              </View>

              <View style={styles.arControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setArActive(false)}
                >
                  <Ionicons name="close-circle" size={40} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="eye" size={32} color="#34d399" />
            <Text style={styles.headerTitle}>AR Hologram Mode</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Activate AR</Text>
            <Text style={styles.cardText}>
              See Victor in holographic form projected in your space. Choose a view and activate AR
              mode.
            </Text>
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => setArActive(true)}
            >
              <Ionicons name="eye" size={24} color="#fff" />
              <Text style={styles.activateButtonText}>Activate AR Mode</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hologram Views</Text>
            {Object.entries(hologramViews).map(([key, view]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.viewCard,
                  hologramView === key && styles.viewCardActive,
                ]}
                onPress={() => setHologramView(key as any)}
              >
                <Ionicons name={view.icon} size={32} color={view.color} />
                <View style={styles.viewInfo}>
                  <Text style={styles.viewName}>{view.name}</Text>
                  <Text style={styles.viewDesc}>{view.description}</Text>
                </View>
                {hologramView === key && (
                  <Ionicons name="checkmark-circle" size={24} color="#34d399" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>AR Features</Text>
            <View style={styles.featureRow}>
              <Ionicons name="location" size={20} color="#60a5fa" />
              <Text style={styles.featureText}>Position Lock</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="analytics" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Neural Display</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="git-network" size={20} color="#34d399" />
              <Text style={styles.featureText}>Timeline View</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="radar" size={20} color="#ef4444" />
              <Text style={styles.featureText}>360° Threat Detection</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34d399',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 16,
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34d399',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  viewCardActive: {
    borderColor: '#34d399',
    backgroundColor: '#1e40af',
  },
  viewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  viewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  viewDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  hologramInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
  },
  hologramTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  hologramDesc: {
    fontSize: 14,
    color: '#d1d5db',
  },
  arControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    padding: 10,
  },
});
