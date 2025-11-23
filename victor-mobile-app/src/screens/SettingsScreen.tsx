import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function SettingsScreen() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationEnabled(status === 'granted');
  };

  const toggleLocation = async () => {
    if (!locationEnabled) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationEnabled(true);
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      } else {
        Alert.alert('Permission Denied', 'Location permission is required for this feature.');
      }
    } else {
      setLocationEnabled(false);
      setLocation(null);
    }
  };

  const syncData = () => {
    Alert.alert('Syncing...', 'Data synchronization in progress', [
      {
        text: 'OK',
        onPress: () => {
          setTimeout(() => {
            Alert.alert('Sync Complete', 'All data has been synchronized');
          }, 2000);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color="#a78bfa" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="location" size={24} color="#60a5fa" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Location Services</Text>
              <Text style={styles.settingDesc}>Enable GPS tracking</Text>
            </View>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={toggleLocation}
            trackColor={{ false: '#334155', true: '#7c3aed' }}
            thumbColor={locationEnabled ? '#a78bfa' : '#9ca3af'}
          />
        </View>

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              Current: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
            </Text>
          </View>
        )}

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color="#fbbf24" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDesc}>Push notifications and alerts</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#334155', true: '#7c3aed' }}
            thumbColor={notificationsEnabled ? '#a78bfa' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="cloud-offline" size={24} color="#f97316" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Offline Mode</Text>
              <Text style={styles.settingDesc}>Work without internet connection</Text>
            </View>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#334155', true: '#7c3aed' }}
            thumbColor={offlineMode ? '#a78bfa' : '#9ca3af'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity style={styles.actionButton} onPress={syncData}>
          <Ionicons name="sync" size={24} color="#34d399" />
          <Text style={styles.actionButtonText}>Sync Data</Text>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Clear Cache', 'Cache cleared successfully')}
        >
          <Ionicons name="trash" size={24} color="#ef4444" />
          <Text style={styles.actionButtonText}>Clear Cache</Text>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.11.23</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Server</Text>
            <Text style={styles.infoValue}>localhost:3000</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive' },
              ]
            )
          }
        >
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Victor Mobile</Text>
        <Text style={styles.footerSubtext}>Godcore Companion</Text>
        <Text style={styles.footerCopyright}>© 2024 Bando Empire</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    color: '#a78bfa',
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  locationInfo: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  locationText: {
    fontSize: 12,
    color: '#60a5fa',
    fontFamily: 'monospace',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  footerCopyright: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 12,
  },
});
