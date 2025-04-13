#include "algo.h"
#include <stdint.h>

extern void pathFind(BotInstruction *moves, FlameColor *const map) {
  FlameColor(*matrix)[MAP_SIZE] = generate2DArray(map);

  // Initialize bot struct
  Bot bot;
  bot.x = 2, bot.y = 0, bot.orientation = Bottom;
  for (int i = 0; i < 4; i++) {
    bot.storage[i] = 0;
  }

  // TODO: divide into cases, based on the priority, later
  Node visited[MAP_SIZE][MAP_SIZE];
  Node targetPos;
  Stack prevNodes;
  uint8_t insIndex = 0; // Index pointing to next empty slot on array
  BFS(matrix, &bot, Blue, visited, &targetPos);
  traceBackPath(visited, &prevNodes, targetPos);
  generateInstruction(&prevNodes, &bot, moves, &insIndex);
  // TODO: implement take to moveForward, relative to current position
  // moves[insIndex++] = take;
  // BFS(matrix, &bot, Red, visited, &targetPos);
  // traceBackPath(visited, &prevNodes, targetPos);
  // generateInstruction(&prevNodes, &bot, moves, &insIndex);
  // moves[insIndex++] = take;
  // BFS(matrix, botPos, Blue, visited, &targetPos);
  // traceBackPath(visited, &prevNodes, targetPos);
  // generateInstruction(&prevNodes, &bot, moves, &insIndex);
  // moves[insIndex++] = take;
  // BFS(matrix, botPos, Red, visited, &targetPos);
  // traceBackPath(visited, &prevNodes, targetPos);
  // generateInstruction(&prevNodes, &bot, moves, &insIndex);
  // moves[insIndex++] = take;
  moves[insIndex] = stop;
  printf("%d\n", insIndex);
}

int BFS(const FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
        FlameColor target, Node visited[MAP_SIZE][MAP_SIZE], Node *targetPos) {
  Queue q; // Auto variable, no need to be cleared
  Queue *qp = &q;
  initQueue(qp);

  initVisitedMatrix(visited); // reset the matrix
  visited[bot->y][bot->x].x = -1,
  visited[bot->y][bot->x].y = -1; // Mark as start

  pushQueue(qp, bot->x, bot->y);

  int endReached = 0;
  while (q.size > 0) {
    Node curr = popQueue(qp);
    for (int dx = -1; dx <= 1; dx++) {
      for (int dy = -1; dy <= 1; dy++) {
        // TODO: actually, we want to use diagonals too
        if (dx != 0 && dy != 0)
          continue;

        Node neighbor;
        neighbor.x = curr.x + dx, neighbor.y = curr.y + dy;

        // Outside of map
        if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= MAP_SIZE ||
            neighbor.y >= MAP_SIZE)
          continue;

        // Check if it's flame that we don't want, i.e. an obstacle
        if (map[neighbor.y][neighbor.x] != 0 &&
            map[neighbor.y][neighbor.x] != target)
          continue;

        // Check visited
        if (visited[neighbor.y][neighbor.x].x > -2)
          continue;

        // Mark this neighbor as visited, and previous node as current
        visited[neighbor.y][neighbor.x].x = curr.x;
        visited[neighbor.y][neighbor.x].y = curr.y;

        if (map[neighbor.y][neighbor.x] == target) {
          endReached = 1;
          targetPos->x = neighbor.x;
          targetPos->y = neighbor.y;
          break;
        }

        pushQueue(qp, neighbor.x, neighbor.y);
      }
      if (endReached)
        break;
    }
    if (endReached)
      break;
  }
  return endReached;
}

// visitedMatrix is global
void traceBackPath(const Node visited[MAP_SIZE][MAP_SIZE], Stack *prevNodes,
                   const Node targetPos) {
  Node temp;
  temp.x = targetPos.x, temp.y = targetPos.y;

  // While temp is not the start node
  while (temp.x != -1 && temp.y != -1) {
    pushStack(prevNodes, temp.x, temp.y);
    temp = visited[temp.y][temp.x];
  }
}

void generateInstruction(Stack *prevNodes, Bot *bot, BotInstruction *moves,
                         uint8_t *insIndex) {
  while (prevNodes->size > 0) {
    Node next = popStack(prevNodes);

    if (next.x == bot->x && next.y == bot->y)
      continue;

    Node dir;
    dir.x = next.x - bot->x, dir.y = next.y - bot->y;

    // Face the target
    // if (prevNodes->size == 0) {
    //   // Right
    //   if (dir.x == 1 && dir.y == 0) {
    //     orientateBot(bot, Right, moves, insIndex);
    //   }
    //   // Bottom
    //   else if (dir.x == 0 && dir.y == 1) {
    //     orientateBot(bot, Bottom, moves, insIndex);
    //   }
    //   // Left
    //   else if (dir.x == 1 && dir.y == 0) {
    //     orientateBot(bot, Left, moves, insIndex);
    //   }
    //   // Top
    //   else if (dir.x == 0 && dir.y == -1) {
    //     orientateBot(bot, Top, moves, insIndex);
    //   }
    // }
    // Right
    if (dir.x == 1 && dir.y == 0) {
      moves[*insIndex] = movr;
    }
    // Bottom
    else if (dir.x == 0 && dir.y == 1) {
      moves[*insIndex] = movb;
    }
    // Left
    else if (dir.x == -1 && dir.y == 0) {
      moves[*insIndex] = movl;
    }
    // Top
    else if (dir.x == 0 && dir.y == -1) {
      moves[*insIndex] = movt;
    }
    // TODO: implement diagonal movements too

    bot->x += dir.x, bot->y += dir.y;

    printf("curr insIndex: %d\n", *insIndex);
    (*insIndex)++;
  }
}

void orientateBot(Bot *bot, BotOrientation orientation, BotInstruction *moves,
                  uint8_t *insIndex) {
  if (bot->orientation == orientation)
    return;

  if (bot->orientation == Right) {
    if (orientation == Left)
      moves[*insIndex] = rotb;
    else if (orientation == Top)
      moves[*insIndex] = rotr;
    else if (orientation == Bottom)
      moves[*insIndex] = rotl;
  } else if (bot->orientation == Bottom) {
    if (orientation == Top)
      moves[*insIndex] = rotb;
    else if (orientation == Right)
      moves[*insIndex] = rotr;
    else if (orientation == Left)
      moves[*insIndex] = rotl;
  } else if (bot->orientation == Left) {
    if (orientation == Right)
      moves[*insIndex] = rotb;
    else if (orientation == Bottom)
      moves[*insIndex] = rotr;
    else if (orientation == Top)
      moves[*insIndex] = rotl;
  } else if (bot->orientation == Top) {
    if (orientation == Bottom)
      moves[*insIndex] = rotb;
    else if (orientation == Left)
      moves[*insIndex] = rotr;
    else if (orientation == Right)
      moves[*insIndex] = rotl;
  }
}

void initVisitedMatrix(Node matrix[MAP_SIZE][MAP_SIZE]) {
  for (int i = 0; i < MAP_SIZE; i++) {
    for (int j = 0; j < MAP_SIZE; j++) {
      // Mark for unvisited as -2
      matrix[i][j].x = -2;
      matrix[i][j].y = -2;
    }
  }
}

void initQueue(Queue *q) {
  q->size = 0;
  q->popIndex = 0;
  q->pushIndex = 0;
}

Node popQueue(Queue *q) {
  if (q->size == 0)
    printf("Error: queue is currently empty and tried to be pop.");
  if (q->popIndex >= 20)
    q->popIndex -= Q_SIZE;
  Node temp;
  temp.x = q->arr[q->popIndex].x;
  temp.y = q->arr[q->popIndex].y;
  q->size--;
  q->popIndex++;
  return temp;
}

void pushQueue(Queue *q, uint8_t x, uint8_t y) {
  if (q->size > Q_SIZE)
    printf("Error: trying to push to FULL queue");
  if (q->pushIndex >= 20)
    q->pushIndex -= Q_SIZE;
  q->arr[q->pushIndex].x = x;
  q->arr[q->pushIndex].y = y;
  q->size++;
  q->pushIndex++;
}

void initStack(Stack *q) {
  q->size = 0;
  q->popIndex = 0;
  q->pushIndex = 0;
}

Node popStack(Stack *q) {
  if (q->size == 0)
    printf("Error: stack is currently empty and tried to be pop.");
  Node temp;
  temp.x = q->arr[q->popIndex].x;
  temp.y = q->arr[q->popIndex].y;
  q->size--;
  q->popIndex--;
  q->pushIndex--;
  return temp;
}

void pushStack(Stack *q, uint8_t x, uint8_t y) {
  if (q->size > Q_SIZE)
    printf("Error: trying to push to FULL stack");
  q->arr[q->pushIndex].x = x;
  q->arr[q->pushIndex].y = y;
  q->size++;
  q->pushIndex++;
  q->popIndex = q->pushIndex - 1; // Pops the element on top
}

// A pointer that return a pointer to an array of 5 elements
// Generate 2d matrix from flattened array passed from WASM
FlameColor (*generate2DArray(FlameColor *const map))[MAP_SIZE] {
  FlameColor(*arr)[MAP_SIZE] = malloc(sizeof(int[MAP_SIZE][MAP_SIZE]));

  int count = 0;
  for (int i = 0; i < MAP_SIZE; i++) {
    for (int j = 0; j < MAP_SIZE; j++) {
      arr[i][j] = map[count];
      count++;
    }
  }

  return arr;
}
