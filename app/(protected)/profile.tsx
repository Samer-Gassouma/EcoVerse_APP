import React from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Theme, themeConfig } from '~/config/theme';
import { ArrowLeft, Settings, Trophy, Medal, Target, Calendar, MapPin, Clock, Share2, Wallet, ChevronRight, Users, TreePine } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data
const userData = {
  name: 'Sarah Johnson',
  username: '@sarahj',
  avatar: 'https://i.pravatar.cc/300',
  level: 24,
  totalPoints: 12580,
  rank: 'Environmental Guardian',
  joinedEvents: 45,
  treesPlanted: 23,
  beachesCleaned: 12,
  following: 234,
  followers: 567,
  achievements: [
    { id: '1', title: 'Beach Guardian', description: '10 Beach Cleanups', icon: '🏖️' },
    { id: '2', title: 'Tree Whisperer', description: '20 Trees Planted', icon: '🌳' },
    { id: '3', title: 'Community Leader', description: 'Led 5 Events', icon: '👑' },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'cleanup',
      title: 'Monastir Beach Cleanup',
      date: '2024-03-20',
      points: 300,
      location: 'Monastir Beach'
    },
    // Add more activities...
  ]
};

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? themeConfig.dark : themeConfig.light;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="h-[300px] relative">
          <LinearGradient
            colors={[theme.primary, `${theme.primary}40`, theme.background]}
            className="absolute inset-0"
          />
          
          {/* Header */}
          <SafeAreaView edges={['top']} className="absolute inset-x-0 top-0">
            <View className="flex-row items-center justify-between px-6 py-4">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl"
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} color="white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl"
                onPress={() => router.push('/(protected)/settings' as any)}
              >
                <Settings size={20} color="white" />
              </Button>
            </View>
          </SafeAreaView>

          {/* Profile Info */}
          <View className="absolute inset-x-0 bottom-0 p-6">
            <View className="flex-row items-end">
              <Image
                source={{ uri: userData.avatar }}
                className="w-24 h-24 rounded-2xl border-4 border-white"
              />
              <View className="flex-1 ml-4 mb-1">
                <Text className="text-white text-2xl font-bold">
                  {userData.name}
                </Text>
                <Text className="text-white/80 text-base">
                  {userData.username}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 -mt-6">
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' }}
            className="flex-row justify-between backdrop-blur-2xl p-6 rounded-3xl border border-white/10"
          >
            <View className="items-center">
              <Trophy size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold">
                {userData.level}
              </Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">
                Level
              </Text>
            </View>
            <View className="h-full w-px bg-white/10" />
            <View className="items-center">
              <Medal size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold">
                {userData.totalPoints}
              </Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">
                Points
              </Text>
            </View>
            <View className="h-full w-px bg-white/10" />
            <View className="items-center">
              <Target size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold">
                {userData.rank}
              </Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">
                Rank
              </Text>
            </View>
          </Animated.View>

          {/* Impact Stats */}
          <View className="mt-8">
            <Text style={{ color: theme.text }} className="text-xl font-bold mb-4">
              Your Impact
            </Text>
            <View className="space-y-4">
              {[
                { icon: Calendar, label: 'Events Joined', value: userData.joinedEvents },
                { icon: TreePine, label: 'Trees Planted', value: userData.treesPlanted },
                { icon: MapPin, label: 'Beaches Cleaned', value: userData.beachesCleaned },
              ].map((stat, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(300 + (index * 100))}
                  style={{ backgroundColor: `${theme.text}08` }}
                  className="flex-row items-center p-4 rounded-2xl"
                >
                  <View 
                    style={{ backgroundColor: `${theme.primary}20` }}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  >
                    <stat.icon size={24} color={theme.primary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: theme.text }} className="text-base font-medium">
                      {stat.label}
                    </Text>
                    <Text style={{ color: theme.mutedText }} className="text-sm">
                      Total count
                    </Text>
                  </View>
                  <Text style={{ color: theme.primary }} className="text-2xl font-bold">
                    {stat.value}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View className="mt-8">
            <Text style={{ color: theme.text }} className="text-xl font-bold mb-4">
              Achievements
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="mx-[-24px] px-6"
            >
              {userData.achievements.map((achievement, index) => (
                <Animated.View
                  key={achievement.id}
                  entering={FadeInDown.delay(400 + (index * 100))}
                  style={{ backgroundColor: `${theme.text}08` }}
                  className="mr-4 p-4 rounded-2xl w-40"
                >
                  <Text className="text-3xl mb-3">{achievement.icon}</Text>
                  <Text style={{ color: theme.text }} className="font-bold mb-1">
                    {achievement.title}
                  </Text>
                  <Text style={{ color: theme.mutedText }} className="text-sm">
                    {achievement.description}
                  </Text>
                </Animated.View>
              ))}
            </ScrollView>
          </View>

          {/* Recent Activity */}
          <View className="mt-8 mb-8">
            <Text style={{ color: theme.text }} className="text-xl font-bold mb-4">
              Recent Activity
            </Text>
            <View className="space-y-4">
              {userData.recentActivity.map((activity, index) => (
                <Animated.View
                  key={activity.id}
                  entering={FadeInDown.delay(500 + (index * 100))}
                  style={{ backgroundColor: `${theme.text}08` }}
                  className="p-4 rounded-2xl"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <View 
                        style={{ backgroundColor: theme[activity.type as keyof Theme] }} 
                        className="w-2 h-2 rounded-full mr-2"
                      />
                      <Text style={{ color: theme.text }} className="font-medium">
                        {activity.title}
                      </Text>
                    </View>
                    <Text style={{ color: theme.primary }} className="font-bold">
                      +{activity.points}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="flex-row items-center mr-4">
                      <Calendar size={16} color={theme.mutedText} className="mr-1" />
                      <Text style={{ color: theme.mutedText }} className="text-sm">
                        {new Date(activity.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MapPin size={16} color={theme.mutedText} className="mr-1" />
                      <Text style={{ color: theme.mutedText }} className="text-sm">
                        {activity.location}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 