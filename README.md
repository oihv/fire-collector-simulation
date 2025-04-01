# fire-collector-simulation
A game simulation made in Javascript as a mean to simulate the competition situation of fire 
collection contest.

## Features
- [ ] Benchmarks for each simulation
    including time, moves made, total score
- [ ] Manual mode
- [ ] Speed control (x1, x2, etc)

## Purpose
To test algorithms for determining the best moves for the robot, and/or train
"AI" to make the best model to complete this task.

## Main Idea
A robot that arranges "fires" in a wall with different height, and to arrange
them in a so called "pairs" to achieve maximum score.
pairs are when fires not the same colored are placed adjacent to each other.

## Rules
### Arena information
Each side have 4200mm x 3200mm size
Surface is paved with 600mm x 600mm x 12mm green crawling mat, and have a white line with a width of 30 mm
There are 15 intersections numbered A, B, C... N, O.

### Goal
There are 8 "fires" randomly scatterred around in the intersections.
Take fires, arrange them in the lookout, so that they make pairs.

### Points
Manual -> 10 on high, 5 on low 
Auto -> 15 on high, 10 on low
each pair x1.5 of the original score
| Working Mode | Description | Score |
| ------------ | ----------- | ----- |
| Manual robot | 1 flame placed on low platform | 5 |
| | 1 flame placed on high platform | 10 |
| | pair flame placed on low platform | (5+5)*1.5 = 15 |
| | pair flame placed on high platform | (10+10)*1.5 = 30 |
| | two flame with same color placed on low platform | 5 + 5 = 10 |
| | two flame with same color placed on high platform | 10 + 10 = 20 |
| Automatic Robot | 1 flame placed on low platform | 10 |
| | 1 flame placed on high platform | 15 |
| | pair flame placed on low platform | (10+10)*1.5 = 30 |
| | pair flame placed on high platform | (15+15)*1.5 = 45 |
| | two flame with same color placed on low platform | 10 + 10 = 15 |
| | two flame with same color placed on high platform | 15 + 15 = 30 |

### Constraint
1 minute for analyzing the fire location
2 minutes for the game.

## Robot Specification
Since this is only a simulation, we will have an estimate for the robot speed,
for now we are assuming the robot have these benchmarks:
- Forward speed *1 m/s*
- Backward speed
- Rotation speed
    - 90 Degree
    - 180 Degree
- Fire take
- Fire put
    - For high lookout
    - For low lookout
- Store fire
