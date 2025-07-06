import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function FoodDeliveryTracker() {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [deliveryProgress] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const { t } = useTranslation();

  const statuses = [
    { id: 0, title: 'Order Confirmed', icon: 'checkmark-circle', time: '2:30 PM' },
    { id: 1, title: 'Preparing Food', icon: 'restaurant', time: '2:45 PM' },
    { id: 2, title: 'Out for Delivery', icon: 'bicycle', time: '3:15 PM' },
    { id: 3, title: 'Delivered', icon: 'home', time: '3:30 PM' }
  ];

  useEffect(() => {
    // Animate progress bar
    Animated.timing(deliveryProgress, {
      toValue: (currentStatus / (statuses.length - 1)) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Pulse animation for current status
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Auto progress simulation
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      pulseAnimation.stop();
    };
  }, [currentStatus]);

  const DeliveryMap = () => (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.mapGradient}
      >
        <View style={styles.mapContent}>
          <Animated.View
            style={[
              styles.deliveryPin,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <Ionicons name="bicycle" size={24} color="#fff" />
          </Animated.View>
          <Text style={styles.mapText}>Live Tracking</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground} />
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: deliveryProgress.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );

  const StatusItem = ({ status, index }: any) => (
    <Animated.View
      style={[
        styles.statusItem,
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <View style={styles.statusLeft}>
        <Animated.View
          style={[
            styles.statusIcon,
            {
              backgroundColor: index <= currentStatus ? '#4facfe' : '#e0e0e0',
              transform: index === currentStatus ? [{ scale: pulseAnim }] : [{ scale: 1 }],
            },
          ]}
        >
          <Ionicons
            name={status.icon}
            size={20}
            color={index <= currentStatus ? '#fff' : '#999'}
          />
        </Animated.View>
      </View>
      <View style={styles.statusRight}>
        <Text style={[styles.statusTitle, { color: index <= currentStatus ? '#333' : '#999' }]}>
          {status.title}
        </Text>
        <Text style={styles.statusTime}>{status.time}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Your Order</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        <DeliveryMap />

        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Delicious Pizza Special</Text>
            <Text style={styles.orderNumber}>Order #12345</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryPerson}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#4facfe" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>John Doe</Text>
                <Text style={styles.personRole}>Delivery Partner</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Delivery Status</Text>
          <ProgressBar />

          <View style={styles.statusList}>
            {statuses.map((status, index) => (
              <StatusItem key={status.id} status={status} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.estimateContainer}>
          <Animated.View
            style={[
              styles.estimateCard,
              {
                transform: [
                  {
                    scale: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: slideAnim,
              },
            ]}
          >
            <Ionicons name="time" size={24} color="#4facfe" />
            <Text style={styles.estimateText}>Estimated Delivery</Text>
            <Text style={styles.estimateTime}>15-20 minutes</Text>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContent: {
    alignItems: 'center',
  },
  deliveryPin: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderInfo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    marginBottom: 15,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryPerson: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  personRole: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4facfe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4facfe',
    borderRadius: 3,
  },
  statusList: {
    gap: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLeft: {
    marginRight: 15,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRight: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusTime: {
    fontSize: 14,
    color: '#666',
  },
  estimateContainer: {
    marginTop: 10,
  },
  estimateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  estimateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  estimateTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4facfe',
  },
});