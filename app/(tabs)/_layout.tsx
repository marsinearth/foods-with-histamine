import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FilePen, Rows4 } from '@tamagui/lucide-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '히스타민 함량 음식 리스트',
          tabBarIcon: ({ color }) => <Rows4 color={color} size={28} style={{ marginBottom: -3 }} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="mod"
        options={{
          title: '추가/수정',
          tabBarIcon: ({ color }) => (
            <FilePen color={color} size={28} style={{ marginBottom: -3 }} />
          ),
        }}
      />
    </Tabs>
  );
}
