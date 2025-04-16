#include "algo.h"

extern void pathFind(BotInstruction *moves, FlameColor *const map) {
  FlameColor(*matrix)[MAP_SIZE] = generate2DArray(map);

  printMap(matrix);

  // Initialize bot struct
  Bot bot;
  bot.x = 2, bot.y = 0, bot.orientation = Bottom;
  for (int i = 0; i < 4; i++) {
    bot.storage[i] = 0;
  }

  uint8_t insIndex = 0;        // Index pointing to next empty slot on array
  uint8_t lookoutMap[5] = {0}; // Array to track availability of lookout
  findAlternateColor(matrix, &bot, moves, &insIndex, lookoutMap);
  findAlternateColor(matrix, &bot, moves, &insIndex, lookoutMap);
  moves[insIndex] = stop;
}

uint8_t findPathToTarget(FlameColor target, uint8_t lookoutFlag,
                         FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
                         Node *targetPos, uint8_t *lookoutMap,
                         BotInstruction *moves, uint8_t *insIndex) {
  uint8_t found = 0;
  Node visited[MAP_SIZE][MAP_SIZE];
  Stack prevNodes;
  initStack(&prevNodes);
  found = BFS(map, bot, target, visited, targetPos, lookoutFlag, lookoutMap);
  traceBackPath(visited, &prevNodes, *targetPos);
  generateInstruction(&prevNodes, bot, moves, insIndex);
  return found;
}

int findAlternateColor(FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
                       BotInstruction *moves, uint8_t *insIndex,
                       uint8_t *lookoutMap) {
  FlameColor mapCopy[MAP_SIZE][MAP_SIZE]; // For restoring
  memcpy(mapCopy, map, sizeof(FlameColor) * MAP_SIZE * MAP_SIZE);
  uint8_t found = 0;
  // TODO: divide into cases, based on the priority, later
  Node targetPos;

  findPathToTarget(Blue, 0, map, bot, &targetPos, lookoutMap, moves, insIndex);
  moves[(*insIndex)++] = take;
  map[targetPos.x][targetPos.y] = Empty;

  // found = BFS(map, bot, Red, visited, &targetPos, 0, lookoutMap);
  // traceBackPath(visited, &prevNodes, targetPos);
  // generateInstruction(&prevNodes, bot, moves, insIndex);
  // moves[(*insIndex)++] = take;
  findPathToTarget(Red, 0, map, bot, &targetPos, lookoutMap, moves, insIndex);
  moves[(*insIndex)++] = take;
  map[targetPos.x][targetPos.y] = Empty;

  findPathToTarget(Blue, 0, map, bot, &targetPos, lookoutMap, moves, insIndex);
  moves[(*insIndex)++] = take;
  map[targetPos.x][targetPos.y] = Empty;

  findPathToTarget(Red, 0, map, bot, &targetPos, lookoutMap, moves, insIndex);
  moves[(*insIndex)++] = take;
  map[targetPos.x][targetPos.y] = Empty;

  // Find lookout
  findPathToTarget(Red, 1, map, bot, &targetPos, lookoutMap, moves, insIndex);
  lookoutMap[targetPos.x] = 1; // Mark as found
  // TODO: what if, we want to diagonally go here, update later
  moves[(*insIndex)++] = movf;
  orientateBot(bot, Bottom, moves, insIndex); // Make the bot face down
  (*insIndex)++;
  // Put flame
  moves[(*insIndex)++] = puth0;
  moves[(*insIndex)++] = puth1;
  moves[(*insIndex)++] = puth2;
  moves[(*insIndex)++] = puth3;

  // TODO: if the route is not found, restore the original map, otherwise, keep
  // it modified
  return found;
}

int BFS(const FlameColor map[MAP_SIZE][MAP_SIZE], Bot *const bot,
        FlameColor target, Node visited[MAP_SIZE][MAP_SIZE], Node *targetPos,
        uint8_t lookoutFlag, uint8_t *lookoutMap) {
  Queue q; // Auto variable, no need to be cleared
  Queue *qp = &q;
  initQueue(qp);

  initVisitedMatrix(visited); // reset the matrix
  visited[bot->x][bot->y].x = -1,
  visited[bot->x][bot->y].y = -1; // Mark as start

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
        // If in lookout mode, treat all flame as obstacle
        if ((lookoutFlag && map[neighbor.x][neighbor.y] != 0) ||
            (map[neighbor.x][neighbor.y] != 0 &&
             map[neighbor.x][neighbor.y] != target))
          continue;

        // Check visited
        if (visited[neighbor.x][neighbor.y].x > -2)
          continue;

        // Mark this neighbor as visited, and previous node as current
        visited[neighbor.x][neighbor.y].x = curr.x;
        visited[neighbor.x][neighbor.y].y = curr.y;

        // If the neighbor is the target
        // Or if is in lookout mode, the neighbor is on the last row
        // And the lookout is currently empty
        if ((lookoutFlag && neighbor.y == 4 && lookoutMap[neighbor.x] == 0) ||
            map[neighbor.x][neighbor.y] == target) {
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
    temp = visited[temp.x][temp.y];
  }

  popStack(prevNodes); // To pop the targetNode
}

void generateInstruction(Stack *prevNodes, Bot *bot, BotInstruction *moves,
                         uint8_t *insIndex) {
  while (prevNodes->size > 0) {
    Node next = popStack(prevNodes);

    Node dir;
    dir.x = next.x - bot->x, dir.y = next.y - bot->y;

    // Face the target
    if (prevNodes->size == 0) {
      // Right (from watcher pov)
      if (dir.x == 1 && dir.y == 0) {
        orientateBot(bot, Right, moves, insIndex);
      }
      // Bottom
      else if (dir.x == 0 && dir.y == 1) {
        orientateBot(bot, Bottom, moves, insIndex);
      }
      // Left
      else if (dir.x == -1 && dir.y == 0) {
        orientateBot(bot, Left, moves, insIndex);
      }
      // Back
      else if (dir.x == 0 && dir.y == -1) {
        orientateBot(bot, Top, moves, insIndex);
      }
    } else {                // Move
      Node normalDir = dir; // Normalized dir
      normalizeDirection(bot->orientation, &normalDir);
      // Right
      if (normalDir.x == -1 && normalDir.y == 0) {
        moves[*insIndex] = movr;
      }
      // Forward
      else if (normalDir.x == 0 && normalDir.y == 1) {
        moves[*insIndex] = movf;
      }
      // Left
      else if (normalDir.x == 1 && normalDir.y == 0) {
        moves[*insIndex] = movl;
      }
      // Back
      else if (normalDir.x == 0 && normalDir.y == -1) {
        moves[*insIndex] = movb;
      }
      // TODO: implement diagonal movements too
    }

    bot->x += dir.x, bot->y += dir.y;

    (*insIndex)++;
  }
  // moves[*insIndex] = stop;
}

void normalizeDirection(const BotOrientation orientation, Node *dir) {
  int8_t temp = dir->x;
  switch (orientation) {
  case Bottom:
    break;
  case Right:
    dir->x = -dir->y;
    dir->y = temp;
    break;
  case Top:
    dir->x = -dir->x;
    dir->y = -dir->y;
    break;
  case Left:
    dir->x = dir->y;
    dir->y = -temp;
    break;
  }
}

void orientateBot(Bot *bot, BotOrientation orientation, BotInstruction *moves,
                  uint8_t *insIndex) {
  if (bot->orientation == orientation) {
    (*insIndex)--; // Offset, so it don't ruin the indexing
    return;
  }

  if (bot->orientation == Right) {
    if (orientation == Left)
      moves[*insIndex] = rotb;
    else if (orientation == Top)
      moves[*insIndex] = rotl;
    else if (orientation == Bottom)
      moves[*insIndex] = rotr;
  } else if (bot->orientation == Bottom) {
    if (orientation == Top)
      moves[*insIndex] = rotb;
    else if (orientation == Right)
      moves[*insIndex] = rotl;
    else if (orientation == Left)
      moves[*insIndex] = rotr;
  } else if (bot->orientation == Left) {
    if (orientation == Right)
      moves[*insIndex] = rotb;
    else if (orientation == Bottom)
      moves[*insIndex] = rotl;
    else if (orientation == Top)
      moves[*insIndex] = rotr;
  } else if (bot->orientation == Top) {
    if (orientation == Bottom)
      moves[*insIndex] = rotb;
    else if (orientation == Left)
      moves[*insIndex] = rotl;
    else if (orientation == Right)
      moves[*insIndex] = rotr;
  }
  bot->orientation = orientation;
}
