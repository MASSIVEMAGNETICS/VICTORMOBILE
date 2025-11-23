import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Threat } from '../types';

export default function SecurityScreen() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/victor/threats');
      if (response.ok) {
        const data = await response.json();
        setThreats(
          data.map((threat: any) => ({
            id: threat.id,
            type: threat.type,
            location: threat.location,
            severity: threat.severity,
            status: threat.status,
            description: threat.description,
            timestamp: new Date(threat.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching threats:', error);
    }
  };

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert('Scan Complete', 'No new threats detected. Empire is secure.');
    }, 3000);
  };

  const neutralizeThreat = (threatId: number) => {
    Alert.alert(
      'Neutralize Threat',
      'Are you sure you want to neutralize this threat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Neutralize',
          style: 'destructive',
          onPress: () => {
            setThreats(threats.filter(t => t.id !== threatId));
            Alert.alert('Success', 'Threat neutralized. Empire secure.');
          },
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'warning';
      case 'low':
        return 'information-circle';
      default:
        return 'shield';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield" size={32} color="#60a5fa" />
        <Text style={styles.headerTitle}>DNA Sentinel</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security Status</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <Ionicons name="shield-checkmark" size={48} color="#34d399" />
            <Text style={styles.statusText}>Protected</Text>
          </View>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonActive]}
            onPress={runScan}
            disabled={scanning}
          >
            <Ionicons
              name={scanning ? 'sync' : 'scan'}
              size={24}
              color="#fff"
              style={scanning ? styles.spinning : undefined}
            />
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Run Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Active Threats</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{threats.length}</Text>
          </View>
        </View>

        {threats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark" size={64} color="#34d399" />
            <Text style={styles.emptyStateText}>No active threats</Text>
            <Text style={styles.emptyStateSubtext}>Your empire is secure</Text>
          </View>
        ) : (
          threats.map((threat) => (
            <View key={threat.id} style={styles.threatCard}>
              <View style={styles.threatHeader}>
                <Ionicons
                  name={getSeverityIcon(threat.severity)}
                  size={24}
                  color={getSeverityColor(threat.severity)}
                />
                <View style={styles.threatInfo}>
                  <Text style={styles.threatType}>{threat.type}</Text>
                  <Text style={styles.threatLocation}>{threat.location}</Text>
                </View>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(threat.severity) },
                  ]}
                >
                  <Text style={styles.severityText}>{threat.severity}</Text>
                </View>
              </View>

              {threat.description && (
                <Text style={styles.threatDescription}>{threat.description}</Text>
              )}

              <View style={styles.threatFooter}>
                <Text style={styles.threatTime}>
                  {new Date(threat.timestamp).toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.neutralizeButton}
                  onPress={() => neutralizeThreat(threat.id)}
                >
                  <Text style={styles.neutralizeButtonText}>Neutralize</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security Features</Text>
        <View style={styles.featureRow}>
          <Ionicons name="finger-print" size={20} color="#60a5fa" />
          <Text style={styles.featureText}>DNA Pattern Recognition</Text>
          <View style={styles.featureStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.featureStatusText}>Active</Text>
          </View>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="eye" size={20} color="#a78bfa" />
          <Text style={styles.featureText}>24/7 Monitoring</Text>
          <View style={styles.featureStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.featureStatusText}>Active</Text>
          </View>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="lock-closed" size={20} color="#34d399" />
          <Text style={styles.featureText}>Automatic Threat Response</Text>
          <View style={styles.featureStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.featureStatusText}>Active</Text>
          </View>
        </View>
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
    color: '#60a5fa',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34d399',
    marginTop: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  scanButtonActive: {
    backgroundColor: '#6d28d9',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  spinning: {
    // Note: React Native doesn't support CSS animations like web
    // In a real app, you'd use Animated API for rotation
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  threatCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  threatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  threatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  threatType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  threatLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  severityBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  threatDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 12,
  },
  threatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threatTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  neutralizeButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  neutralizeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    marginLeft: 12,
  },
  featureStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
  },
  featureStatusText: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
  },
});
