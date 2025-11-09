---
title: Flood Fill Algorithm - The Paint Bucket Tool Explained
pubDate: '2025-11-08'
description: 'Implement flood fill using DFS. Learn the key optimization: use color changes as implicit visited marking to eliminate the need for a separate Set. Includes iterative and recursive solutions with real trade-offs.'
categories:
  - Algorithms
  - Interview
  - DFS
---

## The Problem

Given a 2D grid representing an image, perform a flood fill starting from pixel `(sr, sc)`: change that pixel and all connected pixels of the same *original* color to a new color.

Think of it as the paint bucket tool in Photoshop—click on a region, and everything connected with that color changes.

**Example:**
```
Before:                After Flood Fill to color=5 from (1,1):
0 0 0 3                5 5 5 3
0 1 0 1       →        5 5 5 3
0 0 0 3                5 5 5 3

All 0s connected to (1,1) became 5. The 1s and 3s stayed because they're not connected to (1,1).
```

---

## Algorithm: DFS (Depth-First Search)

Imagine you're exploring a maze, and you decide to always go as deep as possible down one path before trying another. That's DFS in a nutshell, Depth-First Search. In flood fill, we're not wandering aimlessly; we're methodically painting a connected region, like filling a bucket of paint in Photoshop.

Think of each pixel as a room in that maze. We start in the room at `(sr, sc)`, paint it our new color, and then check its four neighbors (up, down, left, right). If a neighbor has the same original color, we "enter" that room, paint it, and repeat. We keep going deep into one direction until we hit a dead end (no more matching neighbors), then backtrack and try other paths.

The beauty of DFS for flood fill is that we don't need a separate "visited" list. By changing the pixel's color as we visit it, we mark it as done, any future check will see it's no longer the original color and skip it. It's like leaving a trail of paint behind you so you don't revisit the same spot.

**The approach:**
1. Start at `(sr, sc)`
2. Change its color to the new color
3. Recursively (or via stack) visit each unvisited neighbor that has the original color
4. Stop when no neighbors match the original color

---

## Solution 1: Iterative DFS with Stack

The cleanest, safest approach for most use cases:

```java
import java.util.Stack;

public class FloodFill {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int rows = image.length, cols = image[0].length;
        int original = image[sr][sc];
        
        if (original == color) return image; // No-op
        
        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{sr, sc});
        
        int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        
        while (!stack.isEmpty()) {
            int[] p = stack.pop();
            int x = p[0], y = p[1];
            
            if (x < 0 || x >= rows || y < 0 || y >= cols || image[x][y] != original) {
                continue;
            }
            
            image[x][y] = color;
            
            for (int[] d : dirs) {
                stack.push(new int[]{x + d[0], y + d[1]});
            }
        }
        
        return image;
    }
}
```

**Key insight:** When we change `image[x][y] = color`, we're marking it as visited. The next time this pixel is popped, the `image[x][y] != original` check fails, so we skip it. **No separate visited set needed.**

**Complexity:**
- Time: O(rows × cols) — each pixel processed once
- Space: O(1) auxiliary (stack depth is worst-case rows×cols but we're not allocating that upfront)

---

## Solution 2: Recursive DFS

Cleaner syntax, but risks stack overflow on large fills:

```java
public class FloodFill {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] != color) {
            dfs(image, sr, sc, image[sr][sc], color);
        }
        return image;
    }
    
    private void dfs(int[][] img, int x, int y, int orig, int color) {
        if (x < 0 || x >= img.length || y < 0 || y >= img[0].length || 
            img[x][y] != orig) {
            return;
        }
        
        img[x][y] = color;
        
        dfs(img, x+1, y, orig, color);
        dfs(img, x-1, y, orig, color);
        dfs(img, x, y+1, orig, color);
        dfs(img, x, y-1, orig, color);
    }
}
```

**Trade-off:** Very clean code, but 4 recursive calls per pixel means stack depth of ~rows×cols in worst case. For a 1000×1000 image filling most pixels, you risk StackOverflowError.

**When to use:** Small to medium images (< 1000×1000), or when code clarity is more important than robustness.

### Complexity Analysis:
- **Time:** O(rows × cols) - each pixel visited once
- **Space:** O(1) - no auxiliary data structures (excluding stack space for recursion depth)

---

## Future Improvements: Scaling for Massive Images

The basic flood fill works great for typical images, but what about satellite imagery or medical imaging where images can be **gigapixels or terabytes**? Here are two optimization strategies:

### 1. **Chunking Strategy**
For extremely large images stored on disk, divide the image into tiles/chunks:
- Only load relevant chunks into memory
- Process flood fill across chunk boundaries
- Save results incrementally

```java
public class ChunkedFloodFill {
    private static final int CHUNK_SIZE = 1024;
    
    public void floodFill(String imagePath, int sr, int sc, int color) {
        int startChunkX = sr / CHUNK_SIZE;
        int startChunkY = sc / CHUNK_SIZE;
        
        Queue<int[]> chunkQueue = new LinkedList<>();
        Set<String> visitedChunks = new HashSet<>();
        
        chunkQueue.add(new int[]{startChunkX, startChunkY});
        visitedChunks.add(startChunkX + "," + startChunkY);
        
        while (!chunkQueue.isEmpty()) {
            int[] chunkCoord = chunkQueue.poll();
            int cx = chunkCoord[0], cy = chunkCoord[1];
            
            int[][] chunk = loadChunkFromDisk(imagePath, cx, cy, CHUNK_SIZE);
            
            // Convert global start coords to chunk-local
            int localSr = (cx == startChunkX) ? sr % CHUNK_SIZE : -1; // -1 means "not in this chunk"
            int localSc = (cy == startChunkY) ? sc % CHUNK_SIZE : -1;
            
            // Flood fill this chunk, tracking boundary crossings
            boolean[] boundariesReached = floodFillChunk(chunk, localSr, localSc, color, CHUNK_SIZE);
            
            saveChunkToDisk(imagePath, cx, cy, chunk);
            
            // Queue adjacent chunks if boundaries were reached
            int[][] dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
            for (int d = 0; d < 4; d++) {
                if (boundariesReached[d]) {
                    int nx = cx + dirs[d][0], ny = cy + dirs[d][1];
                    String key = nx + "," + ny;
                    if (!visitedChunks.contains(key)) {
                        chunkQueue.add(new int[]{nx, ny});
                        visitedChunks.add(key);
                    }
                }
            }
        }
    }
    
    // Flood fill within a single chunk, return boundary flags
    private boolean[] floodFillChunk(int[][] chunk, int sr, int sc, int color, int chunkSize) {
        // Similar to basic flood fill, but check for chunk boundaries
        // Return array indicating which edges were reached during fill
        // [right, left, down, up]
    }
}
```

### 2. **Memory-Mapped I/O (mmap)**
Use memory-mapped files to handle images larger than RAM:
```java
// Use RandomAccessFile or FileChannel in java
// Use mmap in C/C++
try (RandomAccessFile file = new RandomAccessFile("huge-image.raw", "rw");
     MappedByteBuffer buffer = file.getChannel().map(FileChannel.MapMode.READ_WRITE, 0, imageSize)) {
    // Access image data as if it's in memory
}
```
