---
title: Flood Fill Algorithm - The Paint Bucket Tool Explained
pubDate: '2025-11-08'
description: 'Master the flood fill algorithm used in paint tools. Learn DFS and BFS approaches, optimize from O(n) space to O(1) by eliminating the seen set, and understand when to use each technique.'
categories:
  - Algorithms
  - DFS
  - BFS
---

## What's the Flood Fill Algorithm?

Ever clicked the paint bucket tool in Photoshop or MS Paint and watched it magically fill an entire region with a new color? That's the flood fill algorithm in action. 

**The Problem:**
Given an image as a 2D grid where each cell represents a pixel color, flood fill starting from position `(sr, sc)` with a new color. All connected pixels of the *original* color should change to the new color.

**Real-world analogy:** Imagine a map with countries of different colors. You pick a country and decide to paint it and all its connected neighbors (sharing a border) with a new color. Keep expanding until you hit a "border" of different colors.

---

## Example: Paint Bucket in Action

```
Original Image:        After Flood Fill with color=2 from (1,1):
┌─────────┐           ┌─────────┐
│1 1 1│3│ │           │2 2 2│3│ │
│1 2 1│1│ │    →      │2 2 2│3│ │
│1 1 1│3│ │           │2 2 2│3│ │
└─────────┘           └─────────┘
 Starting at (1,1)
 (which is color 2)
```

Notice: Only the connected region of color 1 changed to 2. The 3s stayed untouched because they're not adjacent.

---

## Algorithm: Depth-First Search (DFS)

The flood fill is essentially a **graph traversal problem**. We treat each pixel as a node, and edges connect adjacent pixels of the *same original color*.

### How DFS Works for Flood Fill:

1. Start at the seed pixel `(sr, sc)`
2. Change its color to the new color
3. For each of its 4 neighbors (up, down, left, right):
   - If the neighbor has the **original color** AND hasn't been visited
   - Visit it and repeat step 2
4. Stop when no more unvisited neighbors have the original color

### Visual Walkthrough:

```
Image (1=red, 2=blue, 3=green):
┌─────────┐
│1 1 1│3│ │
│1 2 1│1│ │
│1 1 1│3│ │
└─────────┘

DFS traversal starting from (1,1) - original color is 2:
Step 1: Visit (1,1), change 2→3 ✓
Step 2: Check neighbors:
  - Up (0,1): is 1? No, skip
  - Down (2,1): is 1? No, skip
  - Left (1,0): is 1? No, skip
  - Right (1,2): is 1? No, skip
Result: Only pixel (1,1) changed (it was isolated)

If we started from (0,0) with color 3:
Steps would visit: (0,0)→(0,1)→(0,2)→(1,0)→(1,2)→(2,0)→(2,1)→(2,2)
All these pixels connected with color 1 would become 3
```

---

## Solution: Using a Stack (Iterative DFS)

Let's implement the flood fill algorithm using an explicit stack and iterative DFS:

```java
import java.util.Stack;

public class FloodFill {

    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int rows = image.length;
        int cols = image[0].length;
        
        int originalColor = image[sr][sc];
        
        // Edge case: same color means nothing changes
        if (originalColor == color) {
            return image;
        }

        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{sr, sc});

        // Directions: down, up, right, left
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!stack.isEmpty()) {
            int[] pos = stack.pop();
            int x = pos[0];
            int y = pos[1];

            // Skip if out of bounds or not the original color
            if (x < 0 || x >= rows || y < 0 || y >= cols || image[x][y] != originalColor) {
                continue;
            }

            // Change color (marks as visited implicitly)
            image[x][y] = color;

            // Explore all 4 neighbors
            for (int[] dir : directions) {
                stack.push(new int[]{x + dir[0], y + dir[1]});
            }
        }

        return image;
    }
}
```

### Complexity Analysis:
- **Time:** O(rows × cols) - each pixel visited once
- **Space:** O(1) - no auxiliary data structures (excluding stack space for recursion depth)

## Alternative: Recursive DFS

If you prefer recursion over iteration:

```java
public class FloodFill {

    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] != color) {
            dfs(image, sr, sc, image[sr][sc], color);
        }
        return image;
    }

    private void dfs(int[][] image, int x, int y, int originalColor, int newColor) {
        // Base case: out of bounds or not original color
        if (x < 0 || x >= image.length || y < 0 || y >= image[0].length || 
            image[x][y] != originalColor) {
            return;
        }

        // Mark as visited by changing color
        image[x][y] = newColor;

        // Explore all 4 directions
        dfs(image, x + 1, y, originalColor, newColor); // down
        dfs(image, x - 1, y, originalColor, newColor); // up
        dfs(image, x, y + 1, originalColor, newColor); // right
        dfs(image, x, y - 1, originalColor, newColor); // left
    }
}
```

**Trade-off:** Recursive is cleaner but risks stack overflow on very large connected regions.

---

## Future Improvements: Scaling for Massive Images

The basic flood fill works great for typical images, but what about satellite imagery or medical imaging where images can be **gigapixels or terabytes**? Here are optimization strategies:

### 1. **Chunking Strategy**
For extremely large images stored on disk, divide the image into tiles/chunks:
- Only load relevant chunks into memory
- Process flood fill across chunk boundaries
- Save results incrementally

### 2. **Memory-Mapped I/O (mmap)**
Use memory-mapped files to handle images larger than RAM:
```java
// Pseudo-code: Use RandomAccessFile or FileChannel
try (RandomAccessFile file = new RandomAccessFile("huge-image.raw", "rw");
     MappedByteBuffer buffer = file.getChannel().map(FileChannel.MapMode.READ_WRITE, 0, imageSize)) {
    // Access image data as if it's in memory
}
```

### 3. **Parallel Flood Fill**
For multi-threaded environments, split large fills into independent regions:
- Identify separate connected components
- Process each component in parallel
- Requires careful synchronization to avoid race conditions

### 4. **Lossy Compression Pre-processing**
For visualization purposes, compress the image first:
- Reduce resolution to identify fill regions
- Map results back to original resolution
- Useful for real-time visual feedback

### 5. **GPU Acceleration**
For massive datasets, use GPU parallel processing:
- Transfer image to GPU memory
- Use compute shaders for parallel neighborhood checks
- Significantly faster for gigapixel images

---

## Key Takeaways

1. **Flood fill = Graph Traversal:** Treat pixels as nodes, adjacency as edges
2. **DFS is the go-to:** Iterative DFS avoids stack overflow and requires no extra memory
3. **Space Optimization:** Modify the input array to eliminate auxiliary space
4. **Edge Cases:** Handle same color scenario (no-op) to avoid infinite loops
5. **Interview Tip:** Start with the clear solution, mention optimizations if asked
6. **Scalability:** Keep performance improvements in mind for real-world applications
