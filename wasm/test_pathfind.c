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
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 2, 2, 0, 2},
                            {1, 2, 0, 0, 1},
                            {1, 0, 0, 1, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    bot.orientation = Bottom;
    findAlternateColor(map, &bot, moves);

    int i = 0;
    assert(moves[i++] == movr);
    assert(moves[i++] == movr);
    assert(moves[i++] == movf);
    assert(moves[i++] == take);
    assert(moves[i++] == rotl);
    assert(moves[i++] == take);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {2, 1, 0, 0, 0},
                            {2, 1, 0, 2, 1},
                            {0, 2, 1, 0, 0},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    bot.orientation = Bottom;
    findAlternateColor(map, &bot, moves);

    int i = 0;
    assert(moves[i++] == movr);
    assert(moves[i++] == take);
    assert(moves[i++] == rotr);
    assert(moves[i++] == take);
  }
  {
    FlameColor map[5][5] = {{0, 0, 0, 0, 0},
                            {0, 0, 2, 0, 1},
                            {2, 2, 0, 0, 2},
                            {0, 0, 1, 1, 1},
                            {0, 0, 0, 0, 0}};
    transposeMatrix(map);

    bot.x = 2, bot.y = 0;
    bot.orientation = Bottom;
    findAlternateColor(map, &bot, moves);

    int i = 0;
    assert(moves[i++] == movl);
    assert(moves[i++] == movf);
    assert(moves[i++] == rotl);
    assert(moves[i++] == take);
    assert(moves[i++] == rotr);
    assert(moves[i++] == take);
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
    findAlternateColor(map, &bot, moves);

    int i = 0;
    assert(moves[i++] == movf);
    assert(moves[i++] == rotl);
    assert(moves[i++] == take);
    assert(moves[i++] == movb);
    assert(moves[i++] == rotb);
    assert(moves[i++] == take);
    assert(moves[i++] == take);
    assert(moves[i++] == movl);
    assert(moves[i++] == rotl);
    assert(moves[i++] == take);
    assert(moves[i++] == movf);
    assert(moves[i++] == puth0);
    assert(moves[i++] == puth1);
    assert(moves[i++] == puth2);
    assert(moves[i++] == puth3);
    assert(moves[i++] == stop);
  }

  printf("PathFind test passed!\n");
  return 0;
}
