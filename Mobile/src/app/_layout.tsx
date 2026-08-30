import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'FixMate Login', 
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ title: 'Create Account' }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'FixMate Dashboard', 
          headerStyle: { backgroundColor: '#f4511e' }, 
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}