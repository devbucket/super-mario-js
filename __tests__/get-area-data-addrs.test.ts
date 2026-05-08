import { describe, expect, it } from 'vitest';
import { createGameRam } from '../src/game/create-game-ram.js';
import { findAreaPointer } from '../src/game/find-area-pointer.js';
import { getAreaDataAddrs } from '../src/game/get-area-data-addrs.js';

describe('getAreaDataAddrs', () => {
  it('parses the world 1-1 header into modern fields', () => {
    const ram = createGameRam();

    ram.worldNumber = 0;
    ram.areaNumber = 0;
    findAreaPointer(ram);
    getAreaDataAddrs(ram);

    expect(ram.areaPointer).toBe(0x25);
    expect(ram.areaType).toBe(1);
    expect(ram.areaObjectBytes[0]).toBe(0x50);
    expect(ram.areaObjectBytes[1]).toBe(0x21);
    expect(ram.foregroundScenery).toBe(0);
    expect(ram.backgroundScenery).toBe(2);
    expect(ram.terrainControl).toBe(1);
    expect(ram.areaStyle).toBe(0);
    expect(ram.cloudTypeOverride).toBe(0);
    expect(ram.areaDataOffset).toBe(2);
  });

  it('resolves distinct area pointers for several worlds', () => {
    const samples = [
      { world: 0, area: 0 },
      { world: 0, area: 1 },
      { world: 1, area: 0 },
      { world: 3, area: 0 },
    ];

    const pointers = samples.map(({ world, area }) => {
      const ram = createGameRam();

      ram.worldNumber = world;
      ram.areaNumber = area;
      findAreaPointer(ram);

      return ram.areaPointer;
    });

    expect(new Set(pointers).size).toBe(samples.length);
  });
});
