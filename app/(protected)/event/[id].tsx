import React, { useState } from 'react';
import { View, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Trophy, Medal, Upload, Camera, Image as ImageIcon, Users, MapPin, Calendar, ArrowLeft, Share2, Clock, X, Info, Check, AlertCircle, Loader2, Coins as CoinsIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';
import { themeConfig } from '~/config/theme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Sheet } from '@tamagui/sheet';
import { TextArea } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { Camera as CameraIcon, Video as VideoIcon, Film } from 'lucide-react-native';
import { MotiView } from 'moti';

// Mock leaderboard data
const leaderboardData = [
  { id: '1', name: 'Sarah K.', points: 450, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Mike R.', points: 380, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'John D.', points: 350, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Jane S.', points: 320, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Emily R.', points: 300, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'David L.', points: 280, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Olivia M.', points: 250, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Daniel H.', points: 220, avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'Sophia T.', points: 200, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '10', name: 'James C.', points: 180, avatar: 'https://i.pravatar.cc/150?img=10' },
];

type SubmissionStatus = 'processing' | 'approved' | 'declined' | null;

type SubmissionData = {
  mediaUri: string;
  mediaType: 'image' | 'video';
  eventId: string;
};

export default function EventDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? themeConfig.dark : themeConfig.light;

  const [showSubmitSheet, setShowSubmitSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const pickMedia = async (type: 'image' | 'video') => {
    setMediaLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'image' ? 
        ImagePicker.MediaTypeOptions.Images : 
        ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60, // 60 seconds max
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
        setMediaType(type);
        }
    } catch (error) {
      console.error('Error picking media:', error);
    } finally {
      setMediaLoading(false);
    }
  };

  const takeMedia = async (type: 'image' | 'video') => {
    setMediaLoading(true);
    try {   
      const result = type === 'image' ?
      await ImagePicker.launchCameraAsync({
        quality: 1,
      }) :
      await ImagePicker.launchCameraAsync({
        quality: 1,
        videoMaxDuration: 60,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType(type);
      }
    } catch (error) {
      console.error('Error taking media:', error);
    } finally {
      setMediaLoading(false);
    }
  };

  const uploadMedia = async (uri: string): Promise<string> => {
    // Simulate upload to storage (e.g., Firebase Storage)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload time
    return 'https://uploaded-media-url.com'; // Would be the actual uploaded URL
  };

  const submitAction = async (data: SubmissionData): Promise<{ success: boolean; points?: number; error?: string }> => {
    try {
      // 1. Upload media
      setSubmissionStatus('processing');
      const uploadedUrl = await uploadMedia(data.mediaUri);

      // 2. Submit action to backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0;
      
      if (isSuccess) {
        return { 
          success: true, 
          points: 300 
        };
      } else {
        throw new Error('Image quality too low or unclear contribution evidence');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  };

  const handleSubmission = async () => {
    if (!mediaUri || !mediaType) return;

    setShowSubmitSheet(false);
    setShowStatusSheet(true);
    setSubmissionStatus('processing');

    try {
      const result = await submitAction({
        mediaUri,
        mediaType,
        eventId: params.id as string,
      });

      if (result.success && result.points) {
        setSubmissionStatus('approved');
        setEarnedPoints(result.points);
      } else {
        setSubmissionStatus('declined');
      }
    } catch (error) {
      setSubmissionStatus('declined');
      console.error('Submission error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section with Parallax */}
        <View className="h-[420px] relative">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5' }}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: isDark ? 0.5 : 0.8 }}
          />
          <LinearGradient
            colors={[
              `${theme.background}00`,
              `${theme.background}80`,
              theme.background
            ]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
            className="absolute inset-0"
          />
          
          {/* Header */}
          <SafeAreaView edges={['top']} className="absolute inset-x-0 top-0 z-10">
            <View className="flex-row items-center justify-between px-6 py-4">
              <Pressable 
                className="w-12 h-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-2xl border border-white/20"
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="white" />
              </Pressable>
              <Pressable className="w-12 h-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-2xl border border-white/20">
                <Share2 size={24} color="white" />
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Event Info */}
          <View className="absolute inset-x-0 bottom-0 p-8 space-y-6">
            <View className="flex-row items-center space-x-3 mb-4">
              <View 
                style={{ backgroundColor: theme.primary }}
                className="px-4 py-2 rounded-full backdrop-blur-xl"
              >
                <Text className="text-white text-sm font-bold tracking-wide">Beach Cleanup</Text>
              </View>
              <View className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/20">
                <Text className="text-white text-sm font-bold">300 Points</Text>
              </View>
            </View>
            <View className="space-y-4 mb-4">
              <Text className="text-white text-4xl font-bold leading-tight">
                Monastir Beach Cleanup
              </Text>
              <View className="flex-row items-center flex-wrap gap-4 ">
                <View className="flex-row items-center bg-black/20 px-4 py-2 rounded-full backdrop-blur-xl">
                  <Calendar size={18} color="white" className="mr-2" />
                  <Text className="text-white text-base">March 25, 2024</Text>
                </View>
                <View className="flex-row items-center bg-black/20 px-4 py-2 rounded-full backdrop-blur-xl">
                  <Clock size={18} color="white" className="mr-2" />
                  <Text className="text-white text-base">09:00 AM</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 -mt-10 pb-8">
          {/* Quick Stats */}
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' }}
            className="flex-row justify-between backdrop-blur-2xl p-8 rounded-3xl mb-10 border border-white/10 shadow-lg"
          >
            <View className="items-center flex-1">
              <Users size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold mb-1">25/50</Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">Participants</Text>
            </View>
            <View className="h-full w-px" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <View className="items-center flex-1">
              <Clock size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold mb-1">2h</Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">Duration</Text>
            </View>
            <View className="h-full w-px" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <View className="items-center flex-1">
              <Trophy size={24} color={theme.primary} className="mb-2" />
              <Text style={{ color: theme.text }} className="text-2xl font-bold mb-1">300</Text>
              <Text style={{ color: theme.mutedText }} className="text-sm">Points</Text>
            </View>
          </Animated.View>

          {/* Leaderboard Section */}
          <Animated.View 
            entering={FadeInDown.delay(300)}
            className="space-y-10 mb-10"
          >
              <Text style={{ color: theme.text }} className="text-2xl font-bold mb-6">
                Top Contributors
              </Text>
         

            {/* Podium */}
            <View className="flex-row justify-between items-end h-56 mb-6">
              {/* Second Place */}
              <View className="items-center flex-1 pb-8">
                <Image
                  source={{ uri: leaderboardData[1].avatar }}
                  className="w-20 h-20 rounded-full mb-3"
                  style={{ borderWidth: 3, borderColor: theme.silver }}
                />
                <View 
                  style={{ backgroundColor: theme.silver }}
                  className="w-10 h-10 rounded-full items-center justify-center mb-2 shadow-lg"
                >
                  <Text className="text-white font-bold text-lg">2</Text>
                </View>
                <Text style={{ color: theme.text }} className="text-xl font-bold mb-1">
                  {leaderboardData[1].points}
                </Text>
                <Text style={{ color: theme.mutedText }} className="text-sm font-medium">
                  {leaderboardData[1].name}
                </Text>
              </View>

              {/* First Place */}
              <View className="items-center flex-1 -mt-8">
                <Image
                  source={{ uri: leaderboardData[0].avatar }}
                  className="w-24 h-24 rounded-full mb-3"
                  style={{ borderWidth: 4, borderColor: theme.gold }}
                />
                <View 
                  style={{ backgroundColor: theme.gold }}
                  className="w-12 h-12 rounded-full items-center justify-center mb-2 shadow-lg"
                >
                  <Trophy size={24} color="white" />
                </View>
                <Text style={{ color: theme.text }} className="text-2xl font-bold mb-1">
                  {leaderboardData[0].points}
                </Text>
                <Text style={{ color: theme.mutedText }} className="text-sm font-medium">
                  {leaderboardData[0].name}
                </Text>
              </View>

              {/* Third Place */}
              <View className="items-center flex-1 pb-12">
                <Image
                  source={{ uri: leaderboardData[2].avatar }}
                  className="w-20 h-20 rounded-full mb-3"
                  style={{ borderWidth: 3, borderColor: theme.bronze }}
                />
                <View 
                  style={{ backgroundColor: theme.bronze }}
                  className="w-10 h-10 rounded-full items-center justify-center mb-2 shadow-lg"
                >
                  <Text className="text-white font-bold text-lg">3</Text>
                </View>
                <Text style={{ color: theme.text }} className="text-xl font-bold mb-1">
                  {leaderboardData[2].points}
                </Text>
                <Text style={{ color: theme.mutedText }} className="text-sm font-medium">
                  {leaderboardData[2].name}
                </Text>
              </View>
            </View>

            {/* Other Participants */}
            <View className="space-y-3">
              {leaderboardData.slice(3, 8).map((user, index) => (
                <Animated.View
                  key={user.id}
                  entering={FadeIn.delay(400 + (index * 100))}
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  }}
                  className="flex-row items-center p-4 rounded-2xl backdrop-blur-xl border border-white/10 mb-1"
                >
                  <Text style={{ color: theme.mutedText }} className="w-8 text-lg font-bold">
                    {index + 4}
                  </Text>
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-12 h-12 rounded-full mx-3"
                  />
                  <View className="flex-1">
                    <Text style={{ color: theme.text }} className="font-semibold text-base">
                      {user.name}
                    </Text>
                    <Text style={{ color: theme.mutedText }} className="text-sm">
                      Active Contributor
                    </Text>
                  </View>
                  <Text style={{ color: theme.primary }} className="font-bold text-lg">
                    {user.points}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Submit Action Button */}
          <Button
            style={{ 
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
              elevation: 10,
            }}
            className="h-16 rounded-2xl mb-8 flex-row items-center justify-center gap-3"
            onPress={() => setShowSubmitSheet(true)}
          >
            <Upload size={24} color="white" className="mr-3" />
            <Text className="text-white font-bold text-lg tracking-wide">
              Submit Action
            </Text>
          </Button>
        </View>
      </ScrollView>
      <Sheet
        open={showSubmitSheet}
        onOpenChange={setShowSubmitSheet}
        snapPoints={[90]}
        dismissOnSnapToBottom
      >
        <Sheet.Frame
          style={{ backgroundColor: theme.sheetBg }}
          className="rounded-t-3xl"
        >
          <Sheet.Handle style={{ backgroundColor: `${theme.mutedText}20` }} className="w-16 h-1.5 rounded-full mx-auto my-4" />
          
          <ScrollView className="flex-1 px-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6 px-2">
              <Text style={{ color: theme.text }} className="text-2xl font-bold">
                Submit Your Action
              </Text>
              <Button
                variant="ghost"
                className="w-12 h-12 rounded-full items-center justify-center bg-transparent border border-white/10"
                onPress={() => setShowSubmitSheet(false)}
              >
                <X size={24} color={theme.mutedText} />
              </Button>
            </View>

            {/* Media Preview */}
            {mediaUri ? (
              <Pressable 
                onPress={() => pickMedia(mediaType || 'image')}
                className="relative mb-8"
              >
                {mediaLoading ? (
                  <View className="absolute inset-0 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.primary} />
                  </View>
                ) : (
                  mediaType === 'image' ? (
                    <Image
                    source={{ uri: mediaUri }}
                    className="w-full aspect-video rounded-3xl"
                    style={{ borderWidth: 1, borderColor: theme.border }}
                  />
                    ) : (
                  <View className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10">
                    <Video
                      source={{ uri: mediaUri }}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      className="w-full h-full"
                    />
                  </View>
                )
            )}     
                <View 
                  style={{ backgroundColor: theme.primary }}
                  className="absolute bottom-4 right-4 p-4 rounded-2xl shadow-lg"
                >
                  {mediaType === 'image' ? (
                    <ImageIcon size={24} color="white" />
                  ) : (
                    <Film size={24} color="white" />
                  )}
                </View>
              </Pressable>
            ) : (
              <View className="mt-4 mb-12">
                {/* Photo Section */}
                <View className="mb-8">
                  <Text style={{ color: theme.text }} className="text-lg font-semibold mb-4">
                    Take Photo
                  </Text>
                  <View className="flex-row gap-4 mb-4 mx-2 mt-6">
                    <Button
                      variant="ghost"
                      className="flex-1 py-6 rounded-3xl"
                      style={{ borderColor: `${theme.primary}30` }}
                      onPress={() => takeMedia('image')}
                    >
                      <View className="items-center space-y-3">
                        <View 
                          style={{ backgroundColor: `${theme.primary}20` }}
                          className="p-4 rounded-2xl mb-2"
                        >
                          <CameraIcon size={28} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text }} className="text-base font-semibold">
                          Camera
                        </Text>
                        <Text style={{ color: theme.mutedText }} className="text-xs">
                          Take photo
                        </Text>
                      </View>
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex-1 py-6 rounded-3xl"
                      style={{ borderColor: `${theme.primary}30` }}
                      onPress={() => pickMedia('image')}
                    >
                      <View className="items-center space-y-3">
                        <View 
                          style={{ backgroundColor: `${theme.primary}20` }}
                          className="p-4 rounded-2xl mb-2"
                        >
                          <ImageIcon size={28} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text }} className="text-base font-semibold">
                          Gallery
                        </Text>
                        <Text style={{ color: theme.mutedText }} className="text-xs">
                          Choose photo
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>

                {/* Video Section */}
                <View>
                  <Text style={{ color: theme.text }} className="text-lg font-semibold mb-4">
                    Record Video
                  </Text>
                  <View className="flex-row gap-4 mb-4 mx-2 mt-6">
                    <Button
                      variant="ghost"
                      className="flex-1 py-6 rounded-3xl"
                      style={{ borderColor: `${theme.primary}30` }}
                      onPress={() => takeMedia('video')}
                    >
                      <View className="items-center space-y-3">
                        <View 
                          style={{ backgroundColor: `${theme.primary}20` }}
                          className="p-4 rounded-2xl mb-2"
                        >
                          <VideoIcon size={28} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text }} className="text-base font-semibold">
                          Record
                        </Text>
                        <Text style={{ color: theme.mutedText }} className="text-xs">
                          Max 60s
                        </Text>
                      </View>
                    </Button>

                    <Button
                      variant="ghost"
                      className="flex-1 py-6 rounded-3xl"
                      style={{ borderColor: `${theme.primary}30` }}
                      onPress={() => pickMedia('video')}
                    >
                      <View className="items-center space-y-3">
                        <View 
                          style={{ backgroundColor: `${theme.primary}20` }}
                          className="p-4 rounded-2xl mb-2"
                        >
                          <Film size={28} color={theme.primary} />
                        </View>
                        <Text style={{ color: theme.text }} className="text-base font-semibold">
                          Gallery
                        </Text>
                        <Text style={{ color: theme.mutedText }} className="text-xs">
                          Max 60s
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
              </View>
            )}

            {/* Guidelines */}
            <View 
              style={{ backgroundColor: `${theme.primary}10` }}
              className="rounded-3xl p-6 mb-8"
            >
              <View className="flex-row items-center mb-4">
                <Info size={20} color={theme.primary} />
                <Text style={{ color: theme.primary }} className="font-semibold text-lg ml-3">
                  Submission Guidelines
                </Text>
              </View>
              <View className="space-y-4">
                {[
                  'Take clear photos of your contribution',
                  'Include before and after shots if possible',
                  'Submit within the event timeframe'
                ].map((guideline, index) => (
                  <View key={index} className="flex-row items-start">
                    <View 
                      style={{ backgroundColor: theme.primary }}
                      className="w-2 h-2 rounded-full mt-2 mr-3"
                    />
                    <Text style={{ color: theme.mutedText }} className="flex-1 text-base leading-relaxed">
                      {guideline}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <Button
              style={{ 
                backgroundColor: theme.primary,
                opacity: !mediaType ? 0.5 : 1,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 10,
              }}
              className="h-16 rounded-2xl mb-8"
              disabled={!mediaUri}
              onPress={handleSubmission}
            >
              <View className="flex-row items-center justify-center">
                <Upload size={24} color="white" className="mr-3" />
                <Text className="text-white font-bold text-lg">
                  Submit Contribution
                </Text>
              </View>
            </Button>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
      <Sheet
        open={showStatusSheet}
        onOpenChange={setShowStatusSheet}
        snapPoints={[45]}
        dismissOnSnapToBottom={submissionStatus !== 'processing'}
      >
        <Sheet.Frame
          style={{ backgroundColor: theme.sheetBg }}
          className="rounded-t-3xl"
        >
          <Sheet.Handle style={{ backgroundColor: `${theme.mutedText}20` }} className="w-16 h-1.5 rounded-full mx-auto my-4" />
          
          <View className="px-6 py-4">
            {submissionStatus === 'processing' && (
              <View className="items-center py-8">
                <MotiView
                  from={{ rotate: '0deg' }}
                  animate={{ rotate: '360deg' }}
                  transition={{
                    loop: true,
                    repeatReverse: false,
                    duration: 1000,
                  }}
                >
                  <Loader2 size={48} color={theme.primary} />
                </MotiView>
                <Text 
                  style={{ color: theme.text }} 
                  className="text-xl font-bold mt-6 mb-2"
                >
                  Processing Your Submission
                </Text>
                <View className="w-full space-y-4">
                  <View className="flex-row items-center justify-between px-4">
                    <Text style={{ color: theme.mutedText }}>Uploading media...</Text>
                    <Check size={20} color={theme.success} />
                  </View>
                  <View className="flex-row items-center justify-between px-4">
                    <Text style={{ color: theme.mutedText }}>Verifying submission...</Text>
                    <MotiView
                      from={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ loop: true }}
                    >
                      <Loader2 size={20} color={theme.primary} />
                    </MotiView>
                  </View>
                </View>
              </View>
            )}
            {submissionStatus === 'approved' && (
              <View className="items-center py-8">
                <MotiView
                  from={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'timing', duration: 500 }}
                >
                  <View 
                    style={{ backgroundColor: `${theme.success}20` }}
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                  >
                    <Check size={40} color={theme.success} />
                  </View>
                </MotiView>
                
                <Text 
                  style={{ color: theme.text }} 
                  className="text-xl font-bold mb-2"
                >
                  Action Approved!
                </Text>
                <Text 
                  style={{ color: theme.mutedText }} 
                  className="text-base text-center mb-8"
                >
                  Thank you for your contribution
                </Text>

                {/* Points Animation */}
                <MotiView
                  from={{ translateY: 20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ type: 'timing', duration: 500, delay: 500 }}
                  className="items-center"
                >
                  <View className="flex-row items-center bg-primary/10 px-6 py-4 rounded-2xl">
                    <CoinsIcon size={24} color={theme.primary} className="mr-3" />
                    <Text style={{ color: theme.primary }} className="text-2xl font-bold">
                      +{earnedPoints}
                    </Text>
                  </View>
                  <Text 
                    style={{ color: theme.mutedText }} 
                    className="text-sm mt-2"
                  >
                    Points earned
                  </Text>
                </MotiView>

                <Button
                  style={{ backgroundColor: theme.primary }}
                  className="w-full h-14 rounded-2xl mt-8"
                  onPress={() => {
                    setShowStatusSheet(false);
                    setSubmissionStatus(null);
                    setMediaUri(null);
                    setMediaType(null);
                  }}
                >
                  <Text className="text-white font-bold text-lg">
                    Done
                  </Text>
                </Button>
              </View>
            )}
            {submissionStatus === 'declined' && (
              <View className="items-center py-8">
                <MotiView
                  from={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'timing', duration: 500 }}
                >
                  <View 
                    style={{ backgroundColor: `${theme.error}20` }}
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                  >
                    <AlertCircle size={40} color={theme.error} />
                  </View>
                </MotiView>
                
                <Text 
                  style={{ color: theme.text }} 
                  className="text-xl font-bold mb-2"
                >
                  Action Declined
                </Text>
                <Text 
                  style={{ color: theme.mutedText }} 
                  className="text-base text-center mb-6"
                >
                  Your submission didn't meet our guidelines
                </Text>

                <View 
                  style={{ backgroundColor: `${theme.error}10` }}
                  className="w-full rounded-2xl p-4 mb-8"
                >
                  <Text style={{ color: theme.error }} className="text-base">
                    Reason: Image quality too low or unclear contribution evidence
                  </Text>
                </View>

                <Button
                  style={{ backgroundColor: theme.primary }}
                  className="w-full h-14 rounded-2xl"
                  onPress={() => {
                    setShowStatusSheet(false);
                    setSubmissionStatus(null);
                    setShowSubmitSheet(true);
                  }}
                >
                  <Text className="text-white font-bold text-lg">
                    Try Again
                  </Text>
                </Button>
              </View>
            )}
          </View>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
} 