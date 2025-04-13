#include "algo.h"
#include <assert.h>
#include <stdio.h>

int main() {
  {
    Stack q;
    initStack(&q);
    for (int i = 0; i < 5; i++) {
      pushStack(&q, i, i); // 0-4
    }
    Node n;
    n = popStack(&q);
    assert(n.x == 4);
    assert(n.y == 4);
    n = popStack(&q);
    assert(n.x == 3);
    assert(n.y == 3);
    n = popStack(&q);
    assert(n.x == 2);
    assert(n.y == 2);
    n = popStack(&q);
    assert(n.x == 1);
    assert(n.y == 1);
    n = popStack(&q);
    assert(n.x == 0);
    assert(n.y == 0);
  }
  {
    Stack q;
    initStack(&q);
    for (int i = 1; i <= 20; i++) {
      pushStack(&q, i, i);
    }
    Node n;
    for (int i = 1; i <= 5; i++) {
      popStack(&q);
    }
    n = popStack(&q);
    assert(n.x == 15);
    assert(n.y == 15);
    for (int i = 21; i <= 25; i++) {
      pushStack(&q, i, i);
    }
    for (int i = 1; i <= 15; i++) {
      popStack(&q);
    }
    n = popStack(&q);
    assert(n.x == 4);
    assert(n.y == 4);
  }
  printf("Stack test passed!\n");
  return 0;
}
