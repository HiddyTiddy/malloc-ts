import { free, malloc } from "./malloc";
import { dumpMem, setU64 } from "./mem";

const sizeof_int = 8;

function main() {
  {
    let arr_pointer = malloc(2 * sizeof_int);
    setU64(arr_pointer, 0xddn);
    setU64(arr_pointer + 1, 0xabn);
    console.log(dumpMem(0, 100));
    // -------------------------------------------------
  }
  {
    let arr_pointer = malloc(2 * sizeof_int);
    setU64(arr_pointer, 0xeen);
    setU64(arr_pointer + 1, 0x11n);
    console.log(dumpMem(0, 100));
    // -------------------------------------------------
  }
  {
    malloc(4 * sizeof_int);
    console.log(dumpMem(0, 100));
    // -------------------------------------------------
  }
  let arrays = [malloc(10), malloc(10), malloc(10), malloc(10)];

  free(arrays[2]);
  free(arrays[1]);
  free(arrays[3]);
  console.log(dumpMem(0, 200));
}

main();
