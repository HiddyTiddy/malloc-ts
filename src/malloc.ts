import { derefU64, setU64, FREE, USED, nullptr, MEM_SIZE } from "./mem";

class LinkedListAllocator {
  startHeap: number;
  endHeap: number;

  constructor(startHeap: number, sizeHeap: number) {
    this.startHeap = startHeap;
    this.endHeap = startHeap + sizeHeap;

    setU64(startHeap, FREE);
    setU64(startHeap + 8, BigInt(sizeHeap));
  }

  /**
   * Finds a suitable region in memory and marks it as used
   * @param size in bytes
   * @returns pointer to allocated memory region
   */
  alloc(size: number): number {
    let current = this.startHeap;
    while (current <= this.endHeap) {
      let isFree = derefU64(current) === FREE;
      let sz = Number(derefU64(current + 8));
      if (isFree && size + 16 <= sz) {
        setU64(current, USED);
        setU64(current + 8, BigInt(size));
        setU64(current + 16 + size, FREE);
        setU64(current + 16 + size + 8, BigInt(sz - size - 16));
        return current + 16;
      }
      current += 16 + sz;
    }
    return nullptr;
  }

  /**
   * Frees Memory region starting at `ptr'. Must be valid address
   * @param ptr pointer to chunk
   */
  free(ptr: number) {
    if (derefU64(ptr - 16) != USED) {
      // invalid or already freed
      // DOES NOT RELIABLY CATCH ERRORS
      return;
    }

    setU64(ptr - 16, FREE);

    {
      let size = Number(derefU64(ptr - 8));
      if (derefU64(ptr + size) === FREE) {
        let new_size = size + 16 + Number(derefU64(ptr + size + 8));
        // size + other header + other size
        setU64(ptr - 16, FREE);
        setU64(ptr - 8, BigInt(new_size));
      }
    }

    let current = this.startHeap;
    let next = current + Number(derefU64(current + 8)) + 16;
    while (next < ptr - 16) {
      current = next;
      next = current + Number(derefU64(current + 8)) + 16;
    }
    console.log(current);

    if (derefU64(current) === FREE) {
      let size = Number(derefU64(current + 8));
      let new_size = size + 16 + Number(derefU64(ptr + size + 8));
      setU64(current + 8, BigInt(new_size));
    }
  }
}

let lla = new LinkedListAllocator(0, MEM_SIZE);

/**
 * allocates array in memory, padded to nearest 64 bits
 * @param size amount of bytes to allocate
 * @returns pointer to first byte
 */
export function malloc(size: number): number {
  let remainder = size % 8;

  if (remainder != 0) {
      size += 8 - remainder;
  }
  return lla.alloc(size + 8 - remainder);
}

/**
 * Frees a given memory region
 * @param addr pointer to the region to be freed. must be a valid region
 */
export function free(addr: number) {
  lla.free(addr);
}

