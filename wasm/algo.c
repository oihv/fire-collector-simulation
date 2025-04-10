#include "algo.h"

extern void pathFind(BotInstruction *moves, FlameColor *const map) {
  int (*matrix)[5] = generate2DArray(map);

  // printf("sebelum cb print\n");
  // for (int j = 0; j < 5; j++) {
  //   for (int i = 0; i < 5; i++) {
  //     printf("%d, ", matrix[i][j]);
  //   }
  //   printf("\n");
  // }
  // printf("\n");
  int i;
  for (i = 0; i < 4; i++) {
    *(moves + i) = movb;
  }
  *(moves + i) = puth0;
  i++;
  *(moves + i) = stop;
}

void checkPrime(int *number) { *number = 160; }

// A pointer that return a pointer to an array of 5 elements
int (*generate2DArray(FlameColor *const map))[5] {
  int (*arr)[5] = malloc(sizeof(int[5][5]));

  int count = 0;
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
      arr[i][j] = map[count];
      count++;
    }
  }

  return arr;
}
