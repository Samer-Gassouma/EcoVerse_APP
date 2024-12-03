import { View, Text, StatusBar, Dimensions, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowRight, Globe2, Leaf, TreePine } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated'
import { ThemeToggle } from '~/components/ThemeToggle'
const { width } = Dimensions.get('window')
const BLUR_CIRCLES = Array(3).fill(null)

const LandingScreen = () => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)
  const floatY = useSharedValue(0)

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 20000,
        easing: Easing.linear 
      }), 
      -1
    )

    // Floating animation
    floatY.value = withRepeat(
      withTiming(10, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin)
      }),
      -1,
      true
    )

    // Breathing animation
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin)
      }),
      -1,
      true
    )
  }, [])

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
      { translateY: floatY.value }
    ]
  }))

  const gradientColors = isDark 
    ? ['#0F172A', '#1E293B', '#0F172A']
    : ['#F8FAFC', '#EEF2FF', '#F8FAFC']

  const blurCircleColors = [
    isDark ? '#22C55E' : '#4ADE80',
    isDark ? '#3B82F6' : '#60A5FA',
    isDark ? '#6366F1' : '#818CF8'
  ]

  return (
    <LinearGradient
      colors={gradientColors as [string, string, string]}
      className="flex-1"
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Animated blur circles in background */}
      {BLUR_CIRCLES.map((_, i) => (
        <Animated.View
          key={i}
          entering={FadeInDown.delay(i * 300).springify()}
          className="absolute opacity-30"
          style={{
            width: width * 0.8,
            height: width * 0.8,
            borderRadius: width * 0.4,
            backgroundColor: blurCircleColors[i],
            left: -width * 0.2 + (i * 100),
            top: -width * 0.4 + (i * 200),
            transform: [{ scale: 1 }],
            filter: 'blur(80px)',
          }}
        />
      ))}

      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between py-10">
          {/* Top Section */}
          <View className="flex-row justify-between items-center">
            <ThemeToggle />
          </View>
          <Animated.View 
            entering={FadeInUp.delay(200).springify()} 
            className="items-center pt-10"
          >
            <View className="bg-primary/10 p-6 rounded-full mb-4 overflow-hidden">
              <View className="absolute inset-0 backdrop-blur-xl" />
              <Animated.View style={logoStyle}>
                <Leaf 
                  size={36} 
                  color={isDark ? "#4ADE80" : "#22C55E"}
                  strokeWidth={1.5}
                />
              </Animated.View>
            </View>
            <Text className="text-foreground/90 text-2xl font-medium">
              EcoVerse
            </Text>
            <View className="flex-row items-center mt-2 space-x-1 gap-2 m-2">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2"/>
              <Text className="text-primary text-sm">Live Network</Text>
            </View>
          </Animated.View>

          {/* Middle Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify()} 
            className="space-y-8 px-4 py-2"
          >
            <View className="space-y-4 px-4 py-2 ">
              <Text className="text-foreground text-5xl font-bold text-center leading-tight">
                Your Actions.{'\n'}Real Impact.
              </Text>
              <Text className="text-muted-foreground text-base text-center px-4">
                Join the movement to make our planet better, one action at a time
              </Text>
            </View>

            {/* Stats Cards */}
            <View className="flex-row justify-between px-2 mb-4 mt-4">
              {[
                { number: '10K+', label: 'Active Users', icon: Leaf ,fill: 'green'},
                { number: '50K+', label: 'Actions Taken', icon: Globe2 ,fill: 'blue'},
                { number: '100+', label: 'Communities', icon: TreePine ,fill: 'purple'},
              ].map((stat) => (
                <Animated.View 
                  entering={FadeInUp.delay(600).springify()}
                  key={stat.label} 
                  className="items-center bg-card p-4 rounded-2xl flex-1 mx-1"
                >
                  <stat.icon size={20} color={stat.fill} />
                  <Text className="text-primary text-xl font-bold mt-2">
                    {stat.number}
                  </Text>
                  <Text className="text-muted-foreground text-xs text-center">
                    {stat.label}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Bottom Section */}
          <Animated.View 
            entering={FadeInUp.delay(800).springify()} 
            className="space-y-8 px-4 py-2" // Increased space-y from 4 to 8
          >
            <Link href="/signin" asChild>
              <Button 
                variant="default"
                className="w-full h-14 rounded-2xl flex-row justify-center items-center text-center mb-4" // Added mb-4
              >
                <Text className="text-primary-foreground font-semibold text-lg mr-2 text-center">
                  Get Started
                </Text>
                <ArrowRight size={20} className="text-primary-foreground text-center"
                 fill={isDark ? 'black' : 'white'} />
              </Button>
            </Link>

            <Link href="/signup" asChild>
              <Button 
                variant="outline"
                className="w-full h-14 rounded-2xl mb-4" 
              >
                <Text className="text-foreground font-semibold text-lg text-center">
                  Create Account
                </Text>
              </Button>
            </Link>

            <Text className="text-muted-foreground text-center text-sm mt-8"> 
              By continuing, you agree to our{' '}
              <Text className="text-primary">Terms of Service</Text>
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default LandingScreen