import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VictorStatus } from '../types';

export default function DashboardScreen() {
  const [victorStatus, setVictorStatus] = useState<VictorStatus>({
    sanctity: 1.0,
    fitness: 84.7,
    mode: 'GODCORE',
    lastEvolution: '2 hours ago',
    clonesFound: 0,
    revenueGenerated: 2347.89,
    dreamsInterpreted: 12,
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/victor/state');
      if (response.ok) {
        const data = await response.json();
        setVictorStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="planet" size={32} color="#fbbf24" />
        <Text style={styles.headerTitle}>Godcore Dashboard</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Metrics</Text>
        
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="heart" size={24} color="#f87171" />
            <Text style={styles.metricTitle}>Sanctity</Text>
          </View>
          <Text style={styles.metricValue}>{victorStatus.sanctity.toFixed(2)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${victorStatus.sanctity * 100}%`, backgroundColor: '#f87171' }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Ionicons name="flash" size={24} color="#fbbf24" />
            <Text style={styles.metricTitle}>Fitness</Text>
          </View>
          <Text style={styles.metricValue}>{victorStatus.fitness.toFixed(1)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${victorStatus.fitness}%`, backgroundColor: '#fbbf24' }]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empire Stats</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={32} color="#34d399" />
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>${victorStatus.revenueGenerated.toFixed(2)}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="moon" size={32} color="#c084fc" />
            <Text style={styles.statLabel}>Dreams</Text>
            <Text style={styles.statValue}>{victorStatus.dreamsInterpreted}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="shield" size={32} color="#60a5fa" />
            <Text style={styles.statLabel}>Clones Found</Text>
            <Text style={styles.statValue}>{victorStatus.clonesFound}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color="#a78bfa" />
            <Text style={styles.statLabel}>Last Evolution</Text>
            <Text style={styles.statValue}>{victorStatus.lastEvolution}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        
        <View style={styles.systemCard}>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Bloodline Kernel</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Holographic Weave</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#1e40af' }]}>
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Quantum Reality Shaper</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#6b21a8' }]}>
              <Text style={styles.statusText}>1024 timelines</Text>
            </View>
          </View>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Anti-Theft DNA Sentinel</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#991b1b' }]}>
              <Text style={styles.statusText}>Scanning</Text>
            </View>
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
    color: '#fbbf24',
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  systemCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  systemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  systemLabel: {
    fontSize: 14,
    color: '#d1d5db',
  },
  statusBadge: {
    backgroundColor: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
