import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Check } from 'lucide-react-native';
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const router = useRouter();

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
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
            <Text className="text-3xl font-bold mb-6 text-center">
              {pendingVerification ? 'Verify Email' : 'Create an Account'}
            </Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              {!pendingVerification ? (
                <>
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
                  <Button onPress={onSignUpPress} >
                    <Text className="text-center">Sign Up</Text>
                  </Button>
                  <GoogleSignInButton />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Verification Code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                  />
                  <Button onPress={onPressVerify}>
                    <Check size={18} style={{ marginRight: 8 }} />
                    <Text>Verify Email</Text>
                  </Button>
                </>
              )}
            </View>
          </CardContent>
          {!pendingVerification && (
            <CardFooter>
              <Button variant="ghost" onPress={() => router.push('/(auth)/signin')}>
                <Text>Already have an account? Sign In</Text>
              </Button>
            </CardFooter>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

