#include <stdio.h>
#include <stdlib.h>

typedef enum {
  // Move right, bottom, left, top
  movr,
  movb,
  movl,
  movt,

  // Rotate to left, right, or back (180 degrees)
  rotl,
  rotr,
  rotb,

  // Take ore in the front grid
  take,

  // Put flame on HIGH lookout on index [0 - 3]
  puth0,
  puth1,
  puth2,
  puth3,

  stop,
} BotInstruction;

typedef enum { Empty, Blue, Red } FlameColor;

extern void pathFind(BotInstruction *moves, FlameColor *const map);
void checkPrime(int *number);
int (*generate2DArray(FlameColor *const map))[5];
