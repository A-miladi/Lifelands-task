export type IntervalStats = {
  mean: number;
  stdDev: number;
  sampleCount: number;
  isSuspicious: boolean;
  reason: string | null;
};

export type IntervalOptions = {
  minMeanMs?: number;
  minStdDevMs?: number;
  minSamples?: number;
};

export function analyzeIntervals(
  intervals: readonly number[],
  options: IntervalOptions = {},
): IntervalStats {
  const { minMeanMs = 80, minStdDevMs = 20, minSamples = 5 } = options;

  if (intervals.length < minSamples) {
    return {
      mean: 0,
      stdDev: 0,
      sampleCount: intervals.length,
      isSuspicious: false,
      reason: null,
    };
  }

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance =
    intervals.reduce((acc, v) => acc + (v - mean) ** 2, 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  if (mean < minMeanMs) {
    return {
      mean,
      stdDev,
      sampleCount: intervals.length,
      isSuspicious: true,
      reason: "سرعت کلیک غیرطبیعی — سریع‌تر از حد انسان",
    };
  }

  if (stdDev < minStdDevMs) {
    return {
      mean,
      stdDev,
      sampleCount: intervals.length,
      isSuspicious: true,
      reason: "الگوی زمانی یکنواخت — فاصله‌ها تقریباً یکسان",
    };
  }

  return {
    mean,
    stdDev,
    sampleCount: intervals.length,
    isSuspicious: false,
    reason: null,
  };
}

export type ClickPoint = { x: number; y: number };

export type SpatialStats = {
  centerX: number;
  centerY: number;
  stdDevX: number;
  stdDevY: number;
  avgDistanceFromCenter: number;
  sampleCount: number;
  isSuspicious: boolean;
  reason: string | null;
};

export type SpatialOptions = {
  minStdDevPx?: number;
  minAvgDistancePx?: number;
  minSamples?: number;
};

export function analyzeClicks(
  points: readonly ClickPoint[],
  options: SpatialOptions = {},
): SpatialStats {
  const { minStdDevPx = 2, minAvgDistancePx = 1.5, minSamples = 5 } = options;

  const base: SpatialStats = {
    centerX: 0,
    centerY: 0,
    stdDevX: 0,
    stdDevY: 0,
    avgDistanceFromCenter: 0,
    sampleCount: points.length,
    isSuspicious: false,
    reason: null,
  };

  if (points.length < minSamples) return base;

  const centerX = points.reduce((a, p) => a + p.x, 0) / points.length;
  const centerY = points.reduce((a, p) => a + p.y, 0) / points.length;

  const stdDevX = Math.sqrt(
    points.reduce((acc, p) => acc + (p.x - centerX) ** 2, 0) / points.length,
  );
  const stdDevY = Math.sqrt(
    points.reduce((acc, p) => acc + (p.y - centerY) ** 2, 0) / points.length,
  );

  const avgDistanceFromCenter =
    points.reduce((acc, p) => acc + Math.hypot(p.x, p.y), 0) / points.length;

  const result = {
    ...base,
    centerX,
    centerY,
    stdDevX,
    stdDevY,
    avgDistanceFromCenter,
  };

  if (stdDevX < minStdDevPx && stdDevY < minStdDevPx) {
    return {
      ...result,
      isSuspicious: true,
      reason: "نقطه‌ی کلیک تقریباً یکسان — تنوع مکانی ندارد",
    };
  }

  if (avgDistanceFromCenter < minAvgDistancePx) {
    return {
      ...result,
      isSuspicious: true,
      reason: "کلیک‌ها دقیقاً روی مرکز — الگوی بات",
    };
  }

  return result;
}
