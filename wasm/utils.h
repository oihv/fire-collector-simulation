#pragma once
#include "algo.h"
#include "flameColors.h"
#include "macros.h"
#include "types.h"
#include <stdint.h>

void initQueue(Queue *q);
Node popQueue(Queue *q);
void pushQueue(Queue *q, uint8_t x, uint8_t y);
void initStack(Stack *q);
Node popStack(Stack *q);
void pushStack(Stack *q, uint8_t x, uint8_t y);
FlameColor (*generate2DArray(FlameColor *const map))[5];
void printMap(FlameColor map[MAP_SIZE][MAP_SIZE]);
void transposeMatrix(FlameColor map[MAP_SIZE][MAP_SIZE]);
