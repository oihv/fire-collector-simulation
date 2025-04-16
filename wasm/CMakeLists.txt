cmake_minimum_required(VERSION 3.14)
project(AlgoProject LANGUAGES C)

# Set C standard
set(CMAKE_C_STANDARD 99)

# Add a debug build rule
set(CMAKE_BUILD_TYPE debug)

# Add the main C library
add_library(algo STATIC algo.c utils.c)

# Enable testing with CTest
enable_testing()

# Add the test executable
add_executable(test_bfs test_bfs.c)
target_link_libraries(test_bfs PRIVATE algo)
add_executable(test_queue test_queue.c)
target_link_libraries(test_queue PRIVATE algo)
add_executable(test_stack test_stack.c)
target_link_libraries(test_stack PRIVATE algo)
add_executable(test_pathfind test_pathfind.c)
target_link_libraries(test_pathfind PRIVATE algo)

# Register the test with CTest
add_test(NAME BfsTests COMMAND test_bfs)
add_test(NAME QueueTests COMMAND test_queue)
add_test(NAME StackTests COMMAND test_stack)
add_test(NAME PathfindTests COMMAND test_pathfind)
