
export const MEM_SIZE = 1024 * 10; // 10 KiB
const MEMORY: Uint8Array = new Uint8Array(MEM_SIZE);
export const nullptr = -1;
export const USED = 0xffffffffffffffffn;
export const FREE = 0xdadadadadadadadan;

export function derefU64(addr: number): bigint {
  if (addr === nullptr) throw Error("SEGMENTATION FAULT");
  return (
    (BigInt(MEMORY[addr + 7]) << 56n) |
    (BigInt(MEMORY[addr + 6]) << 48n) |
    (BigInt(MEMORY[addr + 5]) << 40n) |
    (BigInt(MEMORY[addr + 4]) << 32n) |
    (BigInt(MEMORY[addr + 3]) << 24n) |
    (BigInt(MEMORY[addr + 2]) << 16n) |
    (BigInt(MEMORY[addr + 1]) << 8n) |
    BigInt(MEMORY[addr])
  );
}

export function setU64(addr: number, u64value: bigint) {
  for (let i = 0; i < 8; i++) {
    MEMORY[addr + i] = Number((u64value >> (8n * BigInt(i))) & 0xffn);
  }
}

function hex(num: number): string {
  let out = num.toString(16);
  if (out.length === 1) {
    out = "." + out;
  }
  return out;
}

export function dumpMem(addr: number, size: number): string {
  let out = "";
  let c = 1;
  for (let i = addr; i < addr + size; i += 8) {
    for (let j = i; j < i + 8; j++) {
      out += hex(MEMORY[j]);
    }
    if (c % 8 === 0) {
      out += "\n";
    } else {
      out += " ";
    }
    c++;
  }
  return out;
}
