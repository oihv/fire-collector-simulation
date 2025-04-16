#pragma once
#include "flameColors.h"
#include "macros.h"
#include "types.h"
#include "utils.h"
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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
