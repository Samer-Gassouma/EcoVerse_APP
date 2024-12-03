import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn } from 'lucide-react-native';
import { GoogleSignInButton } from '~/components/GoogleSignInButton';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/(protected)/home');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ padding: 16 }}>
        <Card>
          <CardHeader>
            <Text className="text-3xl font-bold mb-6 text-center">Sign In</Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <Input
                placeholder="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button onPress={onSignInPress} className="flex-row items-center">
                <Text>Sign In</Text>
              </Button>
              <GoogleSignInButton />
            </View>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onPress={() => router.push('/(auth)/signup')}>
              <Text>Don't have an account? Sign Up</Text>
            </Button>
          </CardFooter>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

