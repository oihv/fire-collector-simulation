#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define Q_SIZE 20
#define MAP_SIZE 5

typedef enum {
  // Move right, forward, left, back
  movr,
  movf,
  movl,
  movb,

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

typedef enum { Right, Bottom, Left, Top } BotOrientation;

typedef enum { Empty, Blue, Red } FlameColor;

typedef struct {
  uint8_t x;
  uint8_t y;
  BotOrientation orientation;
  FlameColor storage[4];
} Bot;

typedef struct {
  int8_t x;
  int8_t y;
} Node;

typedef struct {
  Node arr[Q_SIZE];
  uint8_t size;
  uint8_t popIndex; // It can get to -1
  uint8_t pushIndex;
} Queue, Stack; // Since they use the same term

extern void pathFind(BotInstruction *moves, FlameColor *const map);
int findAlternateColor(FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
                       BotInstruction *moves, uint8_t *insIndex,
                       uint8_t *lookoutMap);
// TODO: technical debt here, const in this parameter doesn't really mean that
// the map can't be changed I believe, change later
int BFS(const FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
        FlameColor target, Node visited[MAP_SIZE][MAP_SIZE], Node *targetPos,
        uint8_t lookoutFlag, uint8_t *lookoutMap);
void initVisitedMatrix(Node matrix[5][5]);
void traceBackPath(const Node visited[MAP_SIZE][MAP_SIZE], Stack *prevNodes,
                   const Node targetPos);
void generateInstruction(Stack *prevNodes, Bot *bot, BotInstruction *moves,
                         uint8_t *insIndex);
// Normalize the direction the bot should take, based on the current orientation
void normalizeDirection(const BotOrientation orientation, Node *dir);
void orientateBot(Bot *bot, BotOrientation orientation, BotInstruction *moves,
                  uint8_t *insIndex);
void initQueue(Queue *q);
Node popQueue(Queue *q);
void pushQueue(Queue *q, uint8_t x, uint8_t y);
void initStack(Stack *q);
Node popStack(Stack *q);
void pushStack(Stack *q, uint8_t x, uint8_t y);
FlameColor (*generate2DArray(FlameColor *const map))[5];
void printMap(FlameColor map[MAP_SIZE][MAP_SIZE]);
void transposeMatrix(FlameColor map[MAP_SIZE][MAP_SIZE]);
