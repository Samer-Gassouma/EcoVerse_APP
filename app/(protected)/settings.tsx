import React, { useState } from 'react';
import { View, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { themeConfig } from '~/config/theme';
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Moon, 
  Shield, 
  Languages, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Wallet,
  Check
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '~/context/theme';
import { Sheet } from '@tamagui/sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '~/context/language';
import { useAuth } from '@clerk/clerk-expo'
type SettingItem = {
  icon: any;
  label: string;
  value?: boolean | string;
  type: 'toggle' | 'select' | 'navigate';
  onPress?: () => void;
  disabled?: boolean;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme, useSystemTheme, setSystemTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const { signOut } = useAuth()

  const languages = [
    'English',
    'Français',
    'العربية',
  ];

  const settingsSections: SettingSection[] = [
    {
      title: 'Preferences',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications', 
          value: true, 
          type: 'toggle',
          onPress: () => {} // Handle notifications
        },
        {
          icon: Moon,
          label: 'Use System Theme',
          value: useSystemTheme,
          type: 'toggle',
          onPress: () => {
            if (useSystemTheme) {
              toggleTheme();
            } else {
              setSystemTheme();
            }
          }
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          value: isDark,
          type: 'toggle',
          onPress: toggleTheme,
          disabled: useSystemTheme
        },
        { 
          icon: Languages, 
          label: 'Language', 
          value: selectedLanguage, 
          type: 'select',
          onPress: () => setShowLanguageSheet(true)
        },
      ]
    },
    {
      title: 'Wallet & Security',
      items: [
        { icon: Wallet, label: 'Connected Wallet', value: '0x1234...5678', type: 'select' },
        { icon: Shield, label: 'Privacy', type: 'navigate' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', type: 'navigate' },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut(); 
      await AsyncStorage.removeItem('userToken');
      router.replace('/(auth)/LandingScreen' as any);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <SafeAreaView edges={['top']} className="z-10">
        <View className="flex-row items-center px-6 py-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl"
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={theme.text} />
          </Button>
          <Text style={{ color: theme.text }} className="text-2xl font-bold ml-4">
            Settings
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} className="mb-8">
            <Text 
              style={{ color: theme.mutedText }} 
              className="text-sm font-semibold mb-4 uppercase tracking-wider px-1"
            >
              {section.title}
            </Text>
            <View 
              style={{ backgroundColor: `${theme.text}05` }}
              className="rounded-3xl overflow-hidden border border-white/5"
            >
              {section.items.map((item, index) => (
                <Animated.View
                  key={item.label}
                  entering={FadeInDown.delay(200 + (index * 50))}
                >
                  <Pressable
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? `${theme.text}10` : 'transparent',
                      opacity: item.disabled ? 0.5 : 1,
                    })}
                    className="flex-row items-center p-4"
                    onPress={item.type !== 'toggle' ? item.onPress : undefined}
                    disabled={item.disabled}
                  >
                    <View 
                      style={{ backgroundColor: `${theme.primary}15` }}
                      className="w-11 h-11 rounded-2xl items-center justify-center mr-4"
                    >
                      <item.icon size={22} color={theme.primary} />
                    </View>
                    
                    <View className="flex-1">
                      <Text 
                        style={{ color: theme.text }} 
                        className="text-base font-medium"
                      >
                        {item.label}
                      </Text>
                      {item.value && typeof item.value === 'string' && (
                        <Text 
                          style={{ color: theme.mutedText }} 
                          className="text-sm mt-0.5"
                        >
                          {item.value}
                        </Text>
                      )}
                    </View>

                    {item.type === 'toggle' && (
                      <Switch 
                        value={item.value as boolean}
                        onValueChange={item.onPress}
                        trackColor={{ 
                          false: `${theme.text}15`, 
                          true: `${theme.primary}50` 
                        }}
                        thumbColor={item.value ? theme.primary : theme.text}
                        disabled={item.disabled}
                        className="ml-2"
                      />
                    )}

                    {(item.type === 'select' || item.type === 'navigate') && (
                      <ChevronRight size={20} color={theme.mutedText} />
                    )}
                  </Pressable>
                  {index < section.items.length - 1 && (
                    <View 
                      style={{ backgroundColor: `${theme.text}10` }}
                      className="h-[1px] mx-4"
                    />
                  )}
                </Animated.View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(600)}
          className="mt-4"
        >
          <Button
            variant="ghost"
            className="flex-row items-center justify-center py-4 rounded-2xl"
            style={{ 
              backgroundColor: `${theme.error}10`,
              borderWidth: 1,
              borderColor: `${theme.error}20`
            }}
            onPress={handleLogout}
          >
            <LogOut size={20} color={theme.error} className="mr-2" />
            <Text style={{ color: theme.error }} className="font-semibold text-base">
              Log Out
            </Text>
          </Button>
        </Animated.View>
      </ScrollView>

      {/* Language Selection Sheet */}
      <Sheet
        open={showLanguageSheet}
        onOpenChange={setShowLanguageSheet}
        snapPoints={[45]}
        dismissOnSnapToBottom
      >
        <Sheet.Frame
          style={{ backgroundColor: theme.sheetBg }}
          className="rounded-t-3xl"
        >
          <Sheet.Handle 
            style={{ backgroundColor: `${theme.mutedText}20` }} 
            className="w-16 h-1.5 rounded-full mx-auto my-4"
          />
          <View className="px-6 pt-4 pb-8">
            <Text style={{ color: theme.text }} className="text-2xl font-bold mb-6">
              Select Language
            </Text>
            <View className="space-y-3">
              {languages.map((lang) => (
                <Pressable
                  key={lang}
                  style={({ pressed }) => ({
                    backgroundColor: pressed 
                      ? `${theme.text}15` 
                      : `${theme.text}08`,
                  })}
                  className="flex-row items-center justify-between p-4 rounded-2xl"
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setLanguage(lang);
                    setShowLanguageSheet(false);
                  }}
                >
                  <Text 
                    style={{ color: theme.text }}
                    className="text-base font-medium"
                  >
                    {lang}
                  </Text>
                  {selectedLanguage === lang && (
                    <View 
                      style={{ backgroundColor: theme.primary }}
                      className="w-7 h-7 rounded-full items-center justify-center"
                    >
                      <Check size={16} color="white" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
} 