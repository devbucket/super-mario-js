export function createAreaObjectStub(handlerId: number): () => void {
  return function areaObjectStub(): void {
    throw new Error(`Area object handler #${handlerId} is not implemented`);
  };
}
