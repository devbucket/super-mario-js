import { describe, expect, it } from 'vitest';
import {
  statusBarCoinDigitsStartXPx,
  statusBarCoinIconXPx,
  statusBarMarioLabelXPx,
  statusBarMarioLabelYPx,
  statusBarScoreStartXPx,
  statusBarTimeLabelXPx,
  statusBarTimeLabelYPx,
  statusBarTimerStartXPx,
  statusBarValueRowYPx,
  statusBarWorldLabelXPx,
  statusBarWorldLabelYPx,
  statusBarWorldValueStartXPx,
} from '../src/data/status-bar-ppu-layout.js';

describe('statusBarPpuLayout', () => {
  it('maps nametable anchors to pixel positions for the gameplay status bar', () => {
    expect(statusBarMarioLabelXPx).toBe(24);
    expect(statusBarMarioLabelYPx).toBe(16);
    expect(statusBarWorldLabelXPx).toBe(144);
    expect(statusBarWorldLabelYPx).toBe(16);
    expect(statusBarTimeLabelXPx).toBe(192);
    expect(statusBarTimeLabelYPx).toBe(16);
    expect(statusBarScoreStartXPx).toBe(16);
    expect(statusBarCoinIconXPx).toBe(64);
    expect(statusBarCoinDigitsStartXPx).toBe(104);
    expect(statusBarTimerStartXPx).toBe(208);
    expect(statusBarValueRowYPx).toBe(24);
    expect(statusBarWorldValueStartXPx).toBe(160);
  });
});
