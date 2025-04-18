#include "algo.h"
#include <assert.h>
#include <stdint.h>
#include <stdio.h>

int main() {
  // Blue is 1
  // Red is 2
  // Empty is 0
  Node visited[5][5];
  Node botPos;
  Node targetPos;
  Stack prevNodes;
  BotInstruction moves[50];
  uint8_t insIndex = 0;
  Bot bot;
  uint8_t lookoutMap[4] = {0};
  bot.x = 2, bot.y = 0;
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {2, 2, 2, 0, 2},
                            {0, 0, 1, 0, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);
    assert(map[2][3] == 1);

    // Test BFS function
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 2);
    assert(targetPos.y == 3);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 2);
    assert(targetPos.y == 2);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {2, 2, 2, 2, 2},
                            {0, 0, 1, 0, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) ==
           0); // Can't find blue
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 2);
    assert(targetPos.y == 2);
  }
  {
    FlameColor map[5][5] = {{0, 2, 0, 2, 0},
                            {0, 0, 2, 0, 0},
                            {2, 2, 2, 2, 2},
                            {0, 0, 1, 0, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) ==
           0); // Can't find blue
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {1, 0, 0, 0, 2}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 0);
    assert(targetPos.y == 4);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 4);
    assert(targetPos.y == 4);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {0, 0, 0, 0, 0},
                            {0, 0, 0, 1, 1},
                            {0, 0, 0, 1, 2}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 3);
    assert(targetPos.y == 3);
    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 0);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 2, 2, 0, 2},
                            {1, 2, 0, 0, 1},
                            {1, 0, 0, 1, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) == 1);
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {1, 2, 0, 1, 1},
                            {0, 0, 0, 1, 2},
                            {2, 0, 2, 0, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    bot.orientation = Bottom;
    assert(BFS(map, &bot, Blue, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 3);
    assert(targetPos.y == 1);

    bot.x = 3, bot.y = 1;
    bot.orientation = Right;
    assert(BFS(map, &bot, Red, visited, &targetPos, 0, lookoutMap) == 1);
    assert(targetPos.x == 1);
    assert(targetPos.y == 1);
  }
  printf("BFS test passed!\n");
  return 0;
}
