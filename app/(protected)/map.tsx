import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, ScrollView, Pressable, Linking, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Search, Eye, EyeOff, Filter, MapPin, Calendar, Users, Minus, Plus, Navigation2, MapPinOff, List, Map as MapIcon, ArrowUpRight, Coins, Clock, UserCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Sheet } from '@tamagui/sheet';
import * as Location from 'expo-location';
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from 'tamagui'

const { width } = Dimensions.get('window');

// Event type configuration with colors
const eventTypeConfig = {
  cleanup: { color: '#22c55e', label: 'Cleanup' },
  planting: { color: '#3b82f6', label: 'Planting' },
  recycling: { color: '#f59e0b', label: 'Recycling' },
  workshop: { color: '#8b5cf6', label: 'Workshop' }
};

// Theme configuration
const themeConfig = {
  light: {
    cardBg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: '#666',
    overlay: 'rgba(255, 255, 255, 0.3)',
    text: '#000000',
    mutedText: '#666666',
    primary: '#0ea5e9',
    background: '#ffffff',
    card: '#f8fafc',
    markerBorder: '#ffffff',
    sheetBg: '#ffffff',
    searchBarBg: 'rgba(255, 255, 255, 0.9)',
    buttonBg: 'rgba(255, 255, 255, 0.9)',
    gradientOverlay: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)']
  },
  dark: {
    cardBg: 'rgba(30, 41, 59, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '#000',
    overlay: 'rgba(0, 0, 0, 0.3)',
    text: '#ffffff',
    mutedText: '#94a3b8',
    primary: '#38bdf8',
    background: '#0f172a',
    card: '#1e293b',
    markerBorder: '#1e293b',
    sheetBg: '#1e293b',
    searchBarBg: 'rgba(30, 41, 59, 0.9)',
    buttonBg: 'rgba(30, 41, 59, 0.9)',
    gradientOverlay: ['rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.3)']
  }
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  type: keyof typeof eventTypeConfig;
  participants: number;
  maxParticipants: number;
  reward: number;
}

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? themeConfig.dark : themeConfig.light;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [searchRadius, setSearchRadius] = useState(1000); // meters
  const [showLegend, setShowLegend] = useState(true);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);

  // Mock events in Monastir
  const events: Event[] = [
    {
      id: '1',
      title: 'Monastir Beach Cleanup',
      description: 'Join us for a community beach cleanup at Monastir\'s famous beach.',
      date: '2024-03-25T09:00:00',
      location: {
        latitude: 35.7772,
        longitude: 10.8259,
        address: 'Monastir Public Beach'
      },
      type: 'cleanup',
      participants: 25,
      maxParticipants: 50,
      reward: 300
    },
    {
      id: '2',
      title: 'Tree Planting at Ribat',
      description: 'Help green our historic city by planting trees near the Ribat.',
      date: '2024-03-28T08:00:00',
      location: {
        latitude: 35.7785,
        longitude: 10.8324,
        address: 'Ribat of Monastir'
      },
      type: 'planting',
      participants: 15,
      maxParticipants: 30,
      reward: 400
    },
    // Add more events with different types
  ];

  const adjustRadius = (increase: boolean) => {
    const step = 500; // 500 meters per step
    const minRadius = 500;
    const maxRadius = 5000;

    setSearchRadius(current => {
      const newRadius = increase ? current + step : current - step;
      return Math.min(Math.max(newRadius, minRadius), maxRadius);
    });
  };

  const centerOnUser = async () => {
    if (!userLocation) return;

    mapRef.current?.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      await getCurrentLocation();

      // Artificial delay for smooth loading
      setTimeout(() => {
        setIsLoading(false);
        // Show markers with a slight delay after loading
        setTimeout(() => setShowMarkers(true), 500);
      }, 1500);
    };

    initializeMap();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      setUserLocation(userCoords);

      mapRef.current?.animateToRegion({
        ...userCoords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Event marker styles
  const markerStyle = (type: keyof typeof eventTypeConfig) => ({
    backgroundColor: eventTypeConfig[type].color,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.markerBorder,
    elevation: 5,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {viewMode === 'map' ? (
        <>
          <MapView
            ref={mapRef}
            style={{ flex: 1, width: '100%', height: '100%' }}
            provider="google"
            initialRegion={{
              latitude: 35.7785,
              longitude: 10.8324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            customMapStyle={isDark ? darkMapStyle : []}
          >
            {userLocation && showMarkers && (
              <Animated.View entering={FadeIn.delay(200)}>
                <Circle
                  center={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                  }}
                  radius={searchRadius}
                  fillColor={`${theme.primary}20`}
                  strokeColor={`${theme.primary}80`}
                  strokeWidth={2}
                />
              </Animated.View>
            )}

            {showMarkers && events.map((event, index) => (
              <Animated.View
                key={event.id}
                entering={FadeInUp.delay(200 + (index * 100))}
              >
                <Marker
                  coordinate={{
                    latitude: event.location.latitude,
                    longitude: event.location.longitude
                  }}
                  onPress={() => {
                    setSelectedEvent(event);
                    setShowEventSheet(true);
                  }}
                >
                  <View style={markerStyle(event.type)}>
                    <MapPin size={20} color={theme.markerBorder} />
                  </View>
                </Marker>
              </Animated.View>
            ))}
          </MapView>

          {/* Loading Overlay */}
          {isLoading && (
            <Animated.View
              entering={FadeIn}
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: theme.background }}
            >
              <ActivityIndicator size="large" color={theme.primary} />
              <Text
                style={{ color: theme.text }}
                className="mt-4 text-lg font-medium"
              >
                Loading Map...
              </Text>
            </Animated.View>
          )}

          {/* Search Bar with improved animation */}
          <SafeAreaView className="absolute w-full" edges={['top']}>
            <Animated.View
              entering={SlideInDown.delay(isLoading ? 1500 : 200)}
              className="flex-row items-center mx-4 mt-4 space-x-4"
            >
              <View
                style={{ backgroundColor: theme.searchBarBg }}
                className="flex-1 flex-row items-center backdrop-blur-xl rounded-full px-4 h-12"
              >
                <Search size={20} color={theme.text} className="mr-2" />
                <Text style={{ color: theme.mutedText }}>Search events...</Text>
              </View>
              <Button
                variant="ghost"
                size="icon"
                style={{ backgroundColor: theme.buttonBg }}
                className="w-12 h-12 rounded-full backdrop-blur-xl"
                onPress={() => setShowLegend(!showLegend)}
              >
                {showLegend ? <Eye size={20} color={theme.text} /> : <EyeOff size={20} color={theme.text} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                style={{ backgroundColor: theme.buttonBg }}
                className="w-12 h-12 rounded-full backdrop-blur-xl"
                onPress={() => router.push('/(protected)/profile')}
              >
                <UserCircle2 size={20} color={theme.text} />
              </Button>
            </Animated.View>
          </SafeAreaView>

          {/* Update other controls with animations */}
          <Animated.View
            entering={FadeInUp.delay(isLoading ? 1700 : 400)}
            className="absolute right-4 top-32"
          >
            <View
              style={{ backgroundColor: theme.buttonBg }}
              className="space-y-2 backdrop-blur-xl rounded-2xl p-2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onPress={() => adjustRadius(true)}
              >
                <Plus size={20} color={theme.text} />
              </Button>
              <Text style={{ color: theme.text }} className="text-center text-xs font-medium">
                {(searchRadius / 1000).toFixed(1)}km
              </Text>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onPress={() => adjustRadius(false)}
              >
                <Minus size={20} color={theme.text} />
              </Button>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(isLoading ? 1800 : 500)}
            className="absolute right-4 bottom-32 space-y-4"
          >
            <Button
              variant="ghost"
              size="icon"
              style={{ backgroundColor: theme.buttonBg }}
              className="w-12 h-12 rounded-full backdrop-blur-lg"
              onPress={centerOnUser}
            >
              <Navigation2 size={20} color={theme.text} />
            </Button>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(isLoading ? 1900 : 600)}
            className="absolute left-4 bottom-32 space-y-4"
          >
            <Button
              variant="ghost"
              size="icon"
              style={{ backgroundColor: theme.buttonBg }}
              className="w-12 h-12 rounded-full backdrop-blur-lg"
              onPress={() => setViewMode('list')}
            >
              <List size={20} color={theme.text} />
            </Button>
          </Animated.View>

          {/* Legend with animation */}
          {showLegend && (
            <Animated.View
              entering={FadeInUp.delay(200)}
              style={{ backgroundColor: theme.cardBg }}
              className="absolute left-4 bottom-48 backdrop-blur-lg rounded-2xl p-4"
            >
              <Text style={{ color: theme.text }} className="font-medium mb-2">Event Types</Text>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <View key={type} className="flex-row items-center py-2">
                  <View
                    style={{ backgroundColor: config.color }}
                    className="w-3 h-3 rounded-full mr-2"
                  />
                  <Text style={{ color: theme.text }} className="capitalize">
                    {config.label}
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}
        </>
      ) : (
        // List View with improved cards
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          {/* Header */}
          <View style={{ backgroundColor: theme.cardBg }} className="flex-row items-center justify-between p-4">
            <Text style={{ color: theme.text }} className="text-lg font-semibold">
              Nearby Events ({events.length})
            </Text>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full"
              onPress={() => setViewMode('map')}
            >
              <MapIcon size={20} color={theme.text} />
            </Button>
          </View>

          {/* Search Bar */}
          <View style={{ backgroundColor: theme.cardBg }} className="px-4 py-2">
            <View style={{ backgroundColor: theme.searchBarBg }} className="flex-row items-center rounded-full px-4 h-12">
              <Search size={20} color={theme.text} className="mr-2" />
              <Text style={{ color: theme.mutedText }}>Search events...</Text>

            </View>
          </View>

          {/* Events List */}
          <ScrollView className="flex-1 px-4 pt-4">
            {events.map((event) => (
              <Animated.View
                key={event.id}
                entering={FadeIn}
                className="mb-4"
              >
                <Pressable
                  onPress={() => {
                    setSelectedEvent(event);
                    setShowEventSheet(true);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.cardBg,
                      borderColor: theme.border,
                      shadowColor: theme.shadow,
                    }}
                    className="rounded-2xl p-4 border backdrop-blur-xl"
                  >
                    {/* Event Type Badge */}
                    <View className="flex-row items-center mb-2">
                      <View
                        style={{ backgroundColor: eventTypeConfig[event.type].color }}
                        className="w-2 h-2 rounded-full mr-2"
                      />
                      <Text style={{ color: theme.primary }} className="text-sm">
                        {eventTypeConfig[event.type].label}
                      </Text>
                    </View>

                    {/* Event Title */}
                    <Text style={{ color: theme.text }} className="text-lg font-semibold mb-2">
                      {event.title}
                    </Text>

                    {/* Event Details */}
                    <View className="space-y-2">
                      <View className="flex-row items-center">
                        <Calendar size={16} color={theme.mutedText} className="mr-2" />
                        <Text style={{ color: theme.mutedText }}>
                          {new Date(event.date).toLocaleDateString()}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <MapPin size={16} color={theme.mutedText} className="mr-2" />
                        <Text style={{ color: theme.mutedText }}>
                          {event.location.address}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center">
                          <Users size={16} color={theme.mutedText} className="mr-2" />
                          <Text style={{ color: theme.mutedText }}>
                            {event.participants}/{event.maxParticipants} joined
                          </Text>
                        </View>
                        <View style={{ backgroundColor: `${theme.primary}20` }} className="px-3 py-1 rounded-full">
                          <Text style={{ color: theme.primary }} className="text-sm">
                            +{event.reward} coins
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </SafeAreaView>
      )}

      {/* Enhanced Event Details Sheet */}
      <Sheet
        open={showEventSheet}
        onOpenChange={setShowEventSheet}
        snapPoints={[45, 92]}
        dismissOnSnapToBottom
      >
        <Sheet.Frame
          style={{ backgroundColor: theme.sheetBg }}
          className="rounded-t-3xl"
        >
          <Sheet.Handle style={{ backgroundColor: `${theme.mutedText}20` }} className="w-16 h-1.5 rounded-full mx-auto my-4" />
          {selectedEvent && (
            <ScrollView showsVerticalScrollIndicator={false} className="pb-8">
              {/* Hero Section */}
              <View className="h-64 w-full relative mb-8">
                <LinearGradient
                  colors={[
                    eventTypeConfig[selectedEvent.type].color,
                    `${eventTypeConfig[selectedEvent.type].color}20`,
                    theme.sheetBg
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="absolute inset-0"
                />
                <View className="absolute inset-x-0 bottom-0 p-8 space-y-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <View
                      style={{ backgroundColor: `${eventTypeConfig[selectedEvent.type].color}CC` }}
                      className="px-4 py-2 rounded-full backdrop-blur-md"
                    >
                      <Text className="text-white text-sm font-bold tracking-wide">
                        {eventTypeConfig[selectedEvent.type].label.toUpperCase()}
                      </Text>
                    </View>
                    <View
                      style={{ backgroundColor: `${theme.text}15` }}
                      className="backdrop-blur-xl px-4 py-2 rounded-full border border-white/10"
                    >
                      <View className="flex-row items-center">
                        <Coins size={16} color={theme.primary} className="mr-1.5" />
                        <Text style={{ color: theme.text }} className="text-sm font-bold">
                          {selectedEvent.reward}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{ color: theme.text }} className="text-3xl font-bold leading-tight">
                    {selectedEvent.title}
                  </Text>
                </View>
              </View>

              <View className="px-8 space-y-10">
                {/* Stats Row */}
                <View className="flex-row space-x-6">
                  {[
                    {
                      icon: Users,
                      value: `${selectedEvent.participants}/${selectedEvent.maxParticipants}`,
                      label: 'Participants'
                    },
                    {
                      icon: Clock,
                      value: new Date(selectedEvent.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      }),
                      label: 'Start Time'
                    },
                    {
                      icon: Calendar,
                      value: new Date(selectedEvent.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      }),
                      label: 'Date'
                    }
                  ].map((stat, index) => (
                    <View
                      key={index}
                      style={{ backgroundColor: `${theme.text}08` }}
                      className="flex-1 backdrop-blur-xl p-4 mx-2 rounded-3xl border border-white/5"
                    >
                      <stat.icon color={theme.primary} className="mb-5" size={28} />
                      <Text style={{ color: theme.text }} className="text-2xl font-bold mb-3">
                        {stat.value}
                      </Text>
                      <Text style={{ color: theme.mutedText }} className="text-sm font-medium">
                        {stat.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Location Card */}
                <View
                  style={{ backgroundColor: `${theme.text}08` }}
                  className="backdrop-blur-xl rounded-3xl border border-white/5 p-8 space-y-5 mt-4"
                >
                  <Text style={{ color: theme.text }} className="font-bold text-xl mb-2">
                    Location
                  </Text>
                  <View className="flex-row items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-4">
                        <MapPin size={24} color={theme.primary} className="mr-5 flex-shrink-0" />
                        <Text style={{ color: theme.text }} className="font-medium leading-relaxed text-base">
                          {selectedEvent.location.address}
                        </Text>
                      </View>
                      <Button
                        variant="ghost"
                        className="h-10 px-0 flex-row items-center justify-center rounded-full bg-primary/10 border border-white/10 gap-2"
                        onPress={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${selectedEvent.location.latitude},${selectedEvent.location.longitude}`;
                          Linking.openURL(url);
                        }}
                      >
                        <Text style={{ color: theme.primary }} className="text-base font-semibold">
                          Open in Maps
                        </Text>
                        <ArrowUpRight size={18} color={theme.primary} className="ml-3" />
                      </Button>
                    </View>
                  </View>
                </View>

                {/* Description Card */}
                <View
                  style={{ backgroundColor: `${theme.text}08` }}
                  className="backdrop-blur-xl rounded-3xl border border-white/5 p-6 mt-4"
                >
                  <Text style={{ color: theme.text }} className="font-bold text-xl mb-5">
                    About This Event
                  </Text>
                  <Text style={{ color: theme.mutedText }} className="leading-relaxed text-base">
                    {selectedEvent.description}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View className="space-y-4 py-8">
                  <Button
                    style={{
                      backgroundColor: theme.primary,
                      shadowColor: theme.primary,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.35,
                      shadowRadius: 12,
                      elevation: 10,
                    }}
                    className="w-full h-16 rounded-2xl"
                    onPress={() => {
                      router.push(`/(protected)/event/${selectedEvent.id}`); 
                    }}
                  >
                    <Text className="text-white font-bold text-lg tracking-wide">
                      Join Event
                    </Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          )}
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}

// Dark map style
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  }
];