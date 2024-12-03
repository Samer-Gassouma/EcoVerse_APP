import React from 'react';
import { View } from 'react-native';
import { Leaf } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';

export function Logo({ size = 'md' }) {
  const { isDarkColorScheme } = useColorScheme();
  const iconSize = size === 'lg' ? 48 : 32;
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';

  return (
    <View className="flex-row items-center">
      <Leaf size={iconSize} color={isDarkColorScheme ? '#22c55e' : '#15803d'} />
      <Text className={`font-bold ml-2 ${textSize}`}>EcoVerse</Text>
    </View>
  );
}

