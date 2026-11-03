import { memo, useEffect, useRef, useState } from 'react';
import { init, use as registerECharts, type EChartsCoreOption } from 'echarts/core';
import { BarChart, LineChart, ScatterChart, HeatmapChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

registerECharts([BarChart, LineChart, ScatterChart, HeatmapChart, PieChart, GridComponent, TooltipComponent, LegendComponent, VisualMapComponent, CanvasRenderer]);

/** The container determines geometry; the chart never determines the container size. */
export const Chart = memo(function Chart({ option, label, className = '' }: { option:EChartsCoreOption; label:string; className?:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<ReturnType<typeof init> | null>(null);
  const initial = useRef(true);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const instance = init(el, undefined, { renderer:'canvas', devicePixelRatio:Math.min(window.devicePixelRatio || 1, 2) });
    chart.current = instance;
    initial.current = true;
    let frame = 0;
    let width = el.clientWidth;
    let height = el.clientHeight;
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      if (!nextWidth || !nextHeight || (width === nextWidth && height === nextHeight)) return;
      width = nextWidth;
      height = nextHeight;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => instance.resize({ animation:{ duration:0 } }));
    });
    observer.observe(el);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); instance.dispose(); chart.current = null; };
  }, []);
  useEffect(() => {
    chart.current?.setOption({
      ...option,
      animation:reducedMotion ? false : option.animation !== false,
      animationDuration:reducedMotion ? 0 : option.animationDuration ?? 320,
      animationDurationUpdate:reducedMotion ? 0 : option.animationDurationUpdate ?? 220,
    }, {
      notMerge:initial.current,
      ...(initial.current ? {} : { replaceMerge:['series', 'xAxis', 'yAxis', 'grid', 'legend', 'visualMap'] }),
      lazyUpdate:true,
    });
    initial.current = false;
  }, [option, reducedMotion]);
  return <div ref={ref} className={'dash-chart '+className} role="img" aria-label={label} />;
});
