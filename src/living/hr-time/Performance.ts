import { NativeDocument } from '../../impl-interfaces';

export class PerformanceImpl extends EventTarget implements Performance {
  private _nowAtTimeOrigin: number;
  timeOrigin: number;
  onresourcetimingbufferfull: (this: Performance, ev: Event) => any;

  constructor(
    _hostObject: NativeDocument,
    _args,
    privateData: {
      timeOrigin: number;
      nowAtTimeOrigin: number;
    }
  ) {
    super();
    this.timeOrigin = privateData.timeOrigin;
    this._nowAtTimeOrigin = privateData.nowAtTimeOrigin;
  }

  get eventCounts() {
    return performance.eventCounts;
  }
  get navigation() {
    return performance.navigation;
  }
  get timing() {
    return performance.timing;
  }

  clearMarks(markName?: string): void {
    performance.clearMarks(markName);
  }
  clearMeasures(measureName?: string): void {
    performance.clearMeasures(measureName);
  }
  clearResourceTimings(): void {
    performance.clearResourceTimings();
  }
  getEntries(): PerformanceEntryList {
    return performance.getEntries();
  }
  getEntriesByName(name: string, type?: string): PerformanceEntryList {
    return performance.getEntriesByName(name, type);
  }
  getEntriesByType(type: string): PerformanceEntryList {
    return performance.getEntriesByType(type);
  }
  mark(markName: string, markOptions?: PerformanceMarkOptions): PerformanceMark {
    return performance.mark(markName, markOptions);
  }
  measure(measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions, endMark?: string): PerformanceMeasure {
    return performance.measure(measureName, startOrMeasureOptions, endMark);
  }
  now(): number {
    return performance.now() - this._nowAtTimeOrigin;
  }
  setResourceTimingBufferSize(maxSize: number): void {
    performance.setResourceTimingBufferSize(maxSize);
  }
  toJSON() {
    return {
      timeOrigin: this.timeOrigin,
    };
  }
}
