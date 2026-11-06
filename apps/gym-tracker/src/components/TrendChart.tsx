import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline, Line } from 'react-native-svg';
import { colors } from '../theme/colors';
import { type } from '../theme/typography';
import type { TrendKind } from '../lib/types';

type Point = { date: string; value: number };

type Props = {
  points: Point[];
  trend: TrendKind;
  unit?: string;
  height?: number;
};

const trendColor: Record<TrendKind, string> = {
  gain: colors.success,
  plateau: colors.warning,
  regression: colors.danger,
  new: colors.inkMuted,
};

export function TrendChart({ points, trend, unit = 'кг', height = 140 }: Props) {
  const width = 320;
  const pad = 16;

  const { polyline, dots, min, max } = useMemo(() => {
    if (points.length === 0) {
      return { polyline: '', dots: [] as { x: number; y: number }[], min: 0, max: 0 };
    }
    const values = points.map((p) => p.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = Math.max(maxV - minV, 1);
    const coords = points.map((p, i) => {
      const x =
        pad + (points.length === 1 ? width / 2 - pad : (i / (points.length - 1)) * (width - pad * 2));
      const y = height - pad - ((p.value - minV) / span) * (height - pad * 2);
      return { x, y };
    });
    return {
      polyline: coords.map((c) => `${c.x},${c.y}`).join(' '),
      dots: coords,
      min: minV,
      max: maxV,
    };
  }, [points, height]);

  if (points.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>Пока нет точек</Text>
      </View>
    );
  }

  const stroke = trendColor[trend];

  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {min.toFixed(1)}–{max.toFixed(1)} {unit}
        </Text>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line
          x1={pad}
          y1={height - pad}
          x2={width - pad}
          y2={height - pad}
          stroke={colors.line}
          strokeWidth={1}
        />
        {polyline ? (
          <Polyline
            points={polyline}
            fill="none"
            stroke={stroke}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
        {dots.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={4.5} fill={stroke} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  meta: {
    marginBottom: 4,
  },
  metaText: {
    ...type.caption,
    color: colors.inkFaint,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...type.caption,
    color: colors.inkFaint,
  },
});
