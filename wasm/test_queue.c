#include "algo.h"
#include <assert.h>
#include <stdio.h>

int main() {
  {
    Queue q;
    initQueue(&q);
    for (int i = 0; i < 5; i++) {
      pushQueue(&q, i, i); // 0-4
    }
    Node n;
    n = popQueue(&q);
    assert(n.x == 0);
    assert(n.y == 0);
    n = popQueue(&q);
    assert(n.x == 1);
    assert(n.y == 1);
    n = popQueue(&q);
    assert(n.x == 2);
    assert(n.y == 2);
    n = popQueue(&q);
    assert(n.x == 3);
    assert(n.y == 3);
    n = popQueue(&q);
    assert(n.x == 4);
    assert(n.y == 4);
  }
  {
    Queue q;
    initQueue(&q);
    for (int i = 1; i <= 20; i++) {
      pushQueue(&q, i, i);
    }
    Node n;
    for (int i = 1; i <= 5; i++) {
      popQueue(&q);
    }
    n = popQueue(&q);
    assert(n.x == 6);
    assert(n.y == 6);
    for (int i = 21; i <= 25; i++) {
      pushQueue(&q, i, i);
    }
    for (int i = 1; i <= 15; i++) {
      popQueue(&q);
    }
    n = popQueue(&q);
    assert(n.x == 22);
    assert(n.y == 22);
  }
  printf("Yay, queue test passed!\n");
  return 0;
}
