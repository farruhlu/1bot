import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Atmosphere } from '../../components/Atmosphere';
import { SetRow } from '../../components/SetRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useData } from '../../store/DataContext';
import { colors } from '../../theme/colors';
import { type } from '../../theme/typography';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { data, resetDemo } = useData();
  const [filterId, setFilterId] = useState<string | 'all'>('all');

  const exercises = data?.exercises ?? [];
  const sets = useMemo(() => {
    const all = data?.sets ?? [];
    if (filterId === 'all') return all;
    return all.filter((s) => s.exerciseId === filterId);
  }, [data, filterId]);

  return (
    <Atmosphere>
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>История</Text>
          <Text style={styles.sub}>Отдельно по каждому упражнению</Text>
        </Animated.View>

        <FlatList
          horizontal
          data={[{ id: 'all', name: 'Все' }, ...exercises]}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => {
            const active = filterId === item.id;
            return (
              <Pressable
                onPress={() => setFilterId(item.id)}
                style={[styles.filter, active && styles.filterActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
          style={{ maxHeight: 56 }}
        />

        <FlatList
          data={sets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>Пока пусто — запишите первый подход</Text>
          }
          ListFooterComponent={
            <View style={{ marginTop: 24, gap: 10 }}>
              {filterId !== 'all' ? (
                <PrimaryButton
                  label="Открыть прогресс упражнения"
                  variant="ghost"
                  onPress={() => router.push(`/exercise/${filterId}`)}
                />
              ) : null}
              <PrimaryButton
                label="Сбросить демо-данные"
                variant="ghost"
                onPress={() => void resetDemo()}
              />
            </View>
          }
          renderItem={({ item }) => (
            <SetRow
              item={item}
              showExercise={filterId === 'all'}
              onPress={() => router.push(`/exercise/${item.exerciseId}`)}
            />
          )}
        />
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 12, gap: 6 },
  title: { ...type.title, color: colors.sand },
  sub: { ...type.body, color: colors.inkMuted },
  filters: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  filter: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
    marginRight: 8,
  },
  filterActive: {
    borderColor: colors.copper,
    backgroundColor: 'rgba(214,106,46,0.18)',
  },
  filterText: { ...type.caption, color: colors.inkMuted },
  filterTextActive: { color: colors.sand, fontFamily: 'Manrope_700Bold' },
  empty: {
    ...type.body,
    color: colors.inkFaint,
    marginTop: 40,
    textAlign: 'center',
  },
});
