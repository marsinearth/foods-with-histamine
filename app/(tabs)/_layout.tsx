import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FilePen, ListFilter, Rows4 } from '@tamagui/lucide-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '히스타민 함유 음식 리스트',
          tabBarIcon: ({ color }) => <Rows4 color={color} size={28} style={{ marginBottom: -3 }} />,
          headerRight: () => (
            <Link href="/search" asChild>
              <Pressable>
                {({ pressed }) => (
                  <ListFilter
                    size={25}
                    color="$accentColor"
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
          // prevent retaining values on upsert form which prevents loading new values of the item previously modified
          unmountOnBlur: true,
        }}
        listeners={({ navigation }) => ({
          // remove params.id to share the same page for insert/update
          blur: () => navigation.setParams({ id: '' }),
        })}
      />
    </Tabs>
  );
}
