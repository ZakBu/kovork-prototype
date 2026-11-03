import { useEffect, useRef } from 'react';
import { init, use as registerECharts, type EChartsCoreOption } from 'echarts/core';
import { BarChart, LineChart, ScatterChart, HeatmapChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

registerECharts([BarChart, LineChart, ScatterChart, HeatmapChart, PieChart, GridComponent, TooltipComponent, LegendComponent, VisualMapComponent, CanvasRenderer]);

/** The container determines geometry; the chart never determines the container size. */
export function Chart({ option, label, className = '' }: { option:EChartsCoreOption; label:string; className?:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<ReturnType<typeof init> | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const instance = init(el, undefined, { renderer:'canvas', devicePixelRatio:Math.min(window.devicePixelRatio || 1, 2) });
    chart.current = instance;
    const observer = new ResizeObserver(() => instance.resize());
    observer.observe(el);
    return () => { observer.disconnect(); instance.dispose(); chart.current = null; };
  }, []);
  useEffect(() => { chart.current?.setOption(option, { notMerge:true }); }, [option]);
  return <div ref={ref} className={'dash-chart '+className} role="img" aria-label={label} />;
}
