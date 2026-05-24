import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { 
  Layers, 
  GitBranch, 
  List, 
  Binary, 
  Hash, 
  TreeDeciduous, 
  Network, 
  Link2, 
  ArrowRight,
  ArrowLeft,
  Code,
  Zap,
  Brain,
  ChevronRight,
  ChevronDown,
  Minimize2,
  Box,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Cpu,
  Database,
  FileCode,
  Puzzle
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
}

interface SubSubTopic {
  id: string;
  name: string;
  description: string;
  problems: Problem[];
}

interface SubTopic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  subTopics?: SubSubTopic[];
}

interface MainTopic {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  subTopics: SubTopic[];
}

const dsaTopics: MainTopic[] = [
  {
    id: "arrays",
    name: "Arrays & Hashing",
    description: "Contiguous memory storage and key-value mappings",
    icon: <Layers className="h-5 w-5" />,
    subTopics: [
      {
        id: "two-pointers",
        name: "Two Pointers",
        description: "Use two pointers moving in opposite directions",
        icon: <Minimize2 className="h-4 w-4" />,
        subTopics: [
          {
            id: "tp-opposite",
            name: "Opposite Direction",
            description: "Two pointers starting from both ends",
            problems: [
              { name: "Valid Palindrome", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/" },
              { name: "Reverse String", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-string/" },
              { name: "Two Sum II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
            ]
          },
          {
            id: "tp-same",
            name: "Same Direction",
            description: "Fast and slow pointers for cycle detection",
            problems: [
              { name: "Remove Duplicates", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
              { name: "Max Consecutive Ones", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones/" },
            ]
          }
        ]
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        description: "Maintain a window that slides through the array",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "sw-fixed",
            name: "Fixed Window",
            description: "Window of fixed size sliding through array",
            problems: [
              { name: "Maximum Sum Subarray", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/" },
              { name: "Average of Subarray", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/" },
            ]
          },
          {
            id: "sw-variable",
            name: "Variable Window",
            description: "Window size changes based on conditions",
            problems: [
              { name: "Longest Substring Without Repeating", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
              { name: "Minimum Window Substring", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/" },
              { name: "Fruit Into Baskets", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/fruit-into-baskets/" },
            ]
          }
        ]
      },
      {
        id: "prefix-sum",
        name: "Prefix Sum",
        description: "Precompute cumulative sums for O(1) range queries",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "ps-1d",
            name: "1D Prefix Sum",
            description: "Cumulative sum array for range queries",
            problems: [
              { name: "Subarray Sum Equals K", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/" },
              { name: "Continuous Subarray Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/continuous-subarray-sum/" },
            ]
          },
          {
            id: "ps-2d",
            name: "2D Prefix Sum",
            description: "Matrix prefix sum for region queries",
            problems: [
              { name: "Range Sum Query 2D", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/range-sum-query-2d-immutable/" },
              { name: "Matrix Block Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/matrix-block-sum/" },
            ]
          }
        ]
      },
      {
        id: "binary-search",
        name: "Binary Search",
        description: "Divide and conquer on sorted arrays",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "bs-basic",
            name: "Basic Binary Search",
            description: "Find element in sorted array",
            problems: [
              { name: "Binary Search", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/binary-search/" },
              { name: "Search Insert Position", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/search-insert-position/" },
            ]
          },
          {
            id: "bs-modified",
            name: "Modified Binary Search",
            description: "Find boundaries and rotated arrays",
            problems: [
              { name: "Search in Rotated Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
              { name: "Find Minimum in Rotated Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
              { name: "Search in Rotated Array II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/" },
            ]
          },
          {
            id: "bs-boundary",
            name: "Binary Search on Answer",
            description: "Find boundary using binary search",
            problems: [
              { name: "Kth Missing Positive", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-missing-positive-number/" },
              { name: "Find Peak Element", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-peak-element/" },
            ]
          }
        ]
      },
      {
        id: "hash-table",
        name: "Hash Table",
        description: "Key-value storage with O(1) average access",
        icon: <Hash className="h-4 w-4" />,
        subTopics: [
          {
            id: "ht-frequency",
            name: "Frequency Counter",
            description: "Count occurrences of elements",
            problems: [
              { name: "Valid Anagram", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-anagram/" },
              { name: "Find All Duplicates", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
            ]
          },
          {
            id: "ht-mapping",
            name: "Key-Value Mapping",
            description: "Use hash maps for relationships",
            problems: [
              { name: "Two Sum", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/two-sum/" },
              { name: "Longest Consecutive Sequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/" },
              { name: "Isomorphic Strings", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/isomorphic-strings/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "strings",
    name: "Strings",
    description: "Character sequences and pattern matching",
    icon: <FileCode className="h-5 w-5" />,
    subTopics: [
      {
        id: "string-anagram",
        name: "Anagram Problems",
        description: "Check if strings are rearrangements",
        icon: <Puzzle className="h-4 w-4" />,
        subTopics: [
          {
            id: "anagram-basic",
            name: "Basic Anagram",
            description: "Simple anagram validation",
            problems: [
              { name: "Valid Anagram", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-anagram/" },
              { name: "Find the Difference", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/find-the-difference/" },
            ]
          },
          {
            id: "anagram-group",
            name: "Group Anagrams",
            description: "Group strings by anagram relationship",
            problems: [
              { name: "Group Anagrams", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/" },
              { name: "Find Anagrams in String", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
            ]
          }
        ]
      },
      {
        id: "string-palindrome",
        name: "Palindrome Problems",
        description: "Find and manipulate palindromes",
        icon: <Circle className="h-4 w-4" />,
        subTopics: [
          {
            id: "pal-basic",
            name: "Basic Palindrome",
            description: "Simple palindrome checking",
            problems: [
              { name: "Valid Palindrome", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/" },
              { name: "Reverse String", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-string/" },
            ]
          },
          {
            id: "pal-substring",
            name: "Palindromic Substring",
            description: "Find palindromes in strings",
            problems: [
              { name: "Longest Palindromic Substring", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/" },
              { name: "Palindromic Substrings", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/palindromic-substrings/" },
              { name: "Longest Palindromic Subsequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-subsequence/" },
            ]
          }
        ]
      },
      {
        id: "string-matching",
        name: "String Matching",
        description: "Pattern matching algorithms",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "sm-kmp",
            name: "KMP Algorithm",
            description: "Knuth-Morris-Pratt pattern matching",
            problems: [
              { name: "Implement strStr", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/implement-strstr/" },
              { name: "Repeated String Match", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/repeated-string-match/" },
            ]
          },
          {
            id: "sm-z",
            name: "Z Algorithm",
            description: "Z-function for pattern matching",
            problems: [
              { name: "Longest Prefix Suffix", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-prefix-of-string/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    description: "Node-based linear data structures",
    icon: <Link2 className="h-5 w-5" />,
    subTopics: [
      {
        id: "ll-basic",
        name: "Basic Operations",
        description: "Traversal, insertion, deletion",
        icon: <List className="h-4 w-4" />,
        subTopics: [
          {
            id: "ll-traversal",
            name: "Traversal",
            description: "Iterate through linked list",
            problems: [
              { name: "Reverse Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/" },
              { name: "Merge Two Sorted Lists", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/" },
            ]
          },
          {
            id: "ll-modification",
            name: "Modification",
            description: "Add, remove, modify nodes",
            problems: [
              { name: "Delete Node in Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/delete-node-in-a-linked-list/" },
              { name: "Odd Even Linked List", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/odd-even-linked-list/" },
            ]
          }
        ]
      },
      {
        id: "ll-fast-slow",
        name: "Fast & Slow Pointers",
        description: "Two pointers at different speeds",
        icon: <Zap className="h-4 w-4" />,
        subTopics: [
          {
            id: "fs-cycle",
            name: "Cycle Detection",
            description: "Detect cycles in linked list",
            problems: [
              { name: "Linked List Cycle", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/" },
              { name: "Linked List Cycle II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/" },
              { name: "Happy Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/happy-number/" },
            ]
          },
          {
            id: "fs-middle",
            name: "Find Middle",
            description: "Find middle element of linked list",
            problems: [
              { name: "Middle of Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/middle-of-the-linked-list/" },
            ]
          }
        ]
      },
      {
        id: "ll-reversal",
        name: "Reversal Patterns",
        description: "In-place linked list reversal",
        icon: <Minimize2 className="h-4 w-4" />,
        subTopics: [
          {
            id: "rev-basic",
            name: "Basic Reversal",
            description: "Reverse entire linked list",
            problems: [
              { name: "Reverse Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/" },
              { name: "Reverse Linked List II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list-ii/" },
            ]
          },
          {
            id: "rev-k-group",
            name: "Reverse K Group",
            description: "Reverse nodes in groups of k",
            problems: [
              { name: "Reverse Nodes in K-Group", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
              { name: "Swap Nodes in Pairs", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    description: "LIFO and FIFO data structures",
    icon: <List className="h-5 w-5" />,
    subTopics: [
      {
        id: "stack-monotonic",
        name: "Monotonic Stack",
        description: "Maintain sorted stack for next greater/smaller",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "mono-increasing",
            name: "Increasing Stack",
            description: "Stack in increasing order",
            problems: [
              { name: "Next Greater Element I", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/next-greater-element-i/" },
              { name: "Next Greater Element II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/next-greater-element-ii/" },
            ]
          },
          {
            id: "mono-decreasing",
            name: "Decreasing Stack",
            description: "Stack in decreasing order",
            problems: [
              { name: "Next Smaller Element", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/next-smaller-element/" },
              { name: "Daily Temperatures", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/" },
            ]
          },
          {
            id: "mono-applications",
            name: "Applications",
            description: "Real-world monotonic stack problems",
            problems: [
              { name: "Largest Rectangle in Histogram", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
              { name: "Trapping Rain Water", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/" },
            ]
          }
        ]
      },
      {
        id: "queue-bfs",
        name: "BFS on Matrix",
        description: "Level-order traversal in grids",
        icon: <Square className="h-4 w-4" />,
        subTopics: [
          {
            id: "bfs-basic",
            name: "Basic BFS",
            description: "Standard breadth-first search",
            problems: [
              { name: "Number of Islands", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
              { name: "Max Area of Island", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/max-area-of-island/" },
            ]
          },
          {
            id: "bfs-multi-source",
            name: "Multi-Source BFS",
            description: "BFS from multiple starting points",
            problems: [
              { name: "Rotting Oranges", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/" },
              { name: "Nearest Exit", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "trees",
    name: "Trees",
    description: "Hierarchical node structures",
    icon: <TreeDeciduous className="h-5 w-5" />,
    subTopics: [
      {
        id: "tree-dfs",
        name: "DFS on Trees",
        description: "Depth-first search traversal",
        icon: <GitBranch className="h-4 w-4" />,
        subTopics: [
          {
            id: "dfs-inorder",
            name: "Inorder Traversal",
            description: "Left-Root-Right order",
            problems: [
              { name: "Binary Tree Inorder Traversal", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
              { name: "Validate BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/" },
            ]
          },
          {
            id: "dfs-preorder",
            name: "Preorder Traversal",
            description: "Root-Left-Right order",
            problems: [
              { name: "Binary Tree Preorder Traversal", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
              { name: "Construct Binary Tree", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
            ]
          },
          {
            id: "dfs-postorder",
            name: "Postorder Traversal",
            description: "Left-Right-Root order",
            problems: [
              { name: "Binary Tree Postorder Traversal", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
              { name: "Delete Nodes Return Forest", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/delete-nodes-and-return-forest/" },
            ]
          }
        ]
      },
      {
        id: "tree-bfs",
        name: "BFS on Trees",
        description: "Level-order traversal",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "bfs-level-order",
            name: "Level Order",
            description: "Traverse level by level",
            problems: [
              { name: "Level Order Traversal", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
              { name: "Average of Levels", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/average-of-levels-in-binary-tree/" },
            ]
          },
          {
            id: "bfs-zigzag",
            name: "Zigzag Level Order",
            description: "Alternating direction traversal",
            problems: [
              { name: "Zigzag Level Order", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
            ]
          }
        ]
      },
      {
        id: "tree-bst",
        name: "BST Operations",
        description: "Binary Search Tree specific operations",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "bst-search",
            name: "Search in BST",
            description: "Find elements in BST",
            problems: [
              { name: "Search in Binary Search Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
              { name: "Kth Smallest in BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
            ]
          },
          {
            id: "bst-insert-delete",
            name: "Insert & Delete",
            description: "Modify BST structure",
            problems: [
              { name: "Insert into BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/insert-into-a-binary-search-tree/" },
              { name: "Delete from BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/delete-node-in-a-binary-search-tree/" },
            ]
          }
        ]
      },
      {
        id: "tree-trie",
        name: "Trie (Prefix Tree)",
        description: "Efficient prefix matching",
        icon: <Hexagon className="h-4 w-4" />,
        subTopics: [
          {
            id: "trie-basic",
            name: "Basic Trie",
            description: "Implement and use trie",
            problems: [
              { name: "Implement Trie", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
              { name: "Prefix Tree", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/implement-trie/" },
            ]
          },
          {
            id: "trie-applications",
            name: "Trie Applications",
            description: "Real-world trie problems",
            problems: [
              { name: "Word Search II", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/word-search-ii/" },
              { name: "Replace Words", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/replace-words/" },
              { name: "Maximum XOR", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "graphs",
    name: "Graphs",
    description: "Nodes connected by edges",
    icon: <Network className="h-5 w-5" />,
    subTopics: [
      {
        id: "graph-traversal",
        name: "Graph Traversal",
        description: "DFS and BFS on graphs",
        icon: <GitBranch className="h-4 w-4" />,
        subTopics: [
          {
            id: "graph-dfs",
            name: "DFS on Graph",
            description: "Depth-first traversal",
            problems: [
              { name: "Number of Islands", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
              { name: "Clone Graph", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/clone-graph/" },
            ]
          },
          {
            id: "graph-bfs",
            name: "BFS on Graph",
            description: "Breadth-first traversal",
            problems: [
              { name: "Shortest Path in Binary Matrix", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/shortest-path-in-binary-matrix/" },
              { name: "Snakes and Ladders", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/snakes-and-ladders/" },
            ]
          }
        ]
      },
      {
        id: "graph-topological",
        name: "Topological Sort",
        description: "Order vertices based on dependencies",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "topo-kahn",
            name: "Kahn's Algorithm",
            description: "BFS-based topological sort",
            problems: [
              { name: "Course Schedule", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/course-schedule/" },
              { name: "Course Schedule II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/" },
            ]
          },
          {
            id: "topo-dfs",
            name: "DFS-based Topo Sort",
            description: "Using depth-first search",
            problems: [
              { name: "Alien Dictionary", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/alien-dictionary/" },
            ]
          }
        ]
      },
      {
        id: "graph-dijkstra",
        name: "Shortest Path",
        description: "Find shortest path between nodes",
        icon: <Triangle className="h-4 w-4" />,
        subTopics: [
          {
            id: "dijkstra",
            name: "Dijkstra's Algorithm",
            description: "Weighted shortest path",
            problems: [
              { name: "Network Delay Time", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/network-delay-time/" },
              { name: "Find City With Smallest Neighbors", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" },
            ]
          },
          {
            id: "bellman-ford",
            name: "Bellman-Ford",
            description: "Handle negative weights",
            problems: [
              { name: "Cheapest Flight Within K Stops", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
            ]
          }
        ]
      },
      {
        id: "graph-union-find",
        name: "Union Find",
        description: "Disjoint set union data structure",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "uf-basic",
            name: "Basic Union Find",
            description: "Implement union find",
            problems: [
              { name: "Number of Connected Components", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
              { name: "Graph Valid Tree", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/validate-graph-tree/" },
            ]
          },
          {
            id: "uf-applications",
            name: "Union Find Applications",
            description: "Real-world union find problems",
            problems: [
              { name: "Number of Islands", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
              { name: "Most Stones Removed", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    description: "Optimize recursive solutions by memoization",
    icon: <Zap className="h-5 w-5" />,
    subTopics: [
      {
        id: "dp-1d",
        name: "1D DP",
        description: "Single dimension DP",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "dp-fibonacci",
            name: "Fibonacci Pattern",
            description: "Classic fibonacci problems",
            problems: [
              { name: "Climbing Stairs", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/" },
              { name: "House Robber", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/house-robber/" },
              { name: "House Robber II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/" },
            ]
          },
          {
            id: "dp-linear",
            name: "Linear DP",
            description: "Sequential decision making",
            problems: [
              { name: "Min Cost Climbing Stairs", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
              { name: "Divisor Game", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/divisor-game/" },
            ]
          }
        ]
      },
      {
        id: "dp-2d",
        name: "2D DP",
        description: "Two dimensions for grid problems",
        icon: <Square className="h-4 w-4" />,
        subTopics: [
          {
            id: "dp-grid",
            name: "Grid DP",
            description: "DP on 2D grid",
            problems: [
              { name: "Unique Paths", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/unique-paths/" },
              { name: "Unique Paths II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/unique-paths-ii/" },
              { name: "Minimum Path Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/minimum-path-sum/" },
            ]
          },
          {
            id: "dp-string",
            name: "String DP",
            description: "DP on strings",
            problems: [
              { name: "Longest Common Subsequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/" },
              { name: "Edit Distance", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/edit-distance/" },
              { name: "Interleaving String", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/interleaving-string/" },
            ]
          }
        ]
      },
      {
        id: "dp-partition",
        name: "Partition DP",
        description: "Divide into equal sum subsets",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "part-subset",
            name: "Subset Sum",
            description: "Find subset with given sum",
            problems: [
              { name: "Partition Equal Subset Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/" },
              { name: "Target Sum", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/target-sum/" },
              { name: "Last Stone Weight II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/last-stone-weight-ii/" },
            ]
          }
        ]
      },
      {
        id: "dp-bitmask",
        name: "Bitmask DP",
        description: "DP with bitmask for state representation",
        icon: <Binary className="h-4 w-4" />,
        subTopics: [
          {
            id: "bm-traveling",
            name: "Traveling Salesman",
            description: "Find shortest Hamiltonian path",
            problems: [
              { name: "Traveling Salesman Problem", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/" },
              { name: "Permutation DP", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/permutations/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "recursion",
    name: "Recursion & Backtracking",
    description: "Explore all possibilities",
    icon: <GitBranch className="h-5 w-5" />,
    subTopics: [
      {
        id: "backtrack-permutation",
        name: "Permutations",
        description: "Generate all arrangements",
        icon: <Puzzle className="h-4 w-4" />,
        subTopics: [
          {
            id: "perm-basic",
            name: "Basic Permutation",
            description: "Generate all permutations",
            problems: [
              { name: "Permutations", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/permutations/" },
              { name: "Permutations II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/permutations-ii/" },
            ]
          },
          {
            id: "perm-next",
            name: "Next Permutation",
            description: "Find next lexicographic permutation",
            problems: [
              { name: "Next Permutation", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/next-permutation/" },
              { name: "Permutation Sequence", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/permutation-sequence/" },
            ]
          }
        ]
      },
      {
        id: "backtrack-combination",
        name: "Combinations",
        description: "Generate all selections",
        icon: <Square className="h-4 w-4" />,
        subTopics: [
          {
            id: "com-basic",
            name: "Basic Combinations",
            description: "Generate combinations",
            problems: [
              { name: "Combinations", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combinations/" },
              { name: "Combination Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combination-sum/" },
            ]
          },
          {
            id: "com-advanced",
            name: "Advanced Combinations",
            description: "Complex combination problems",
            problems: [
              { name: "Combination Sum II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combination-sum-ii/" },
              { name: "Combination Sum III", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combination-sum-iii/" },
            ]
          }
        ]
      },
      {
        id: "backtrack-subsets",
        name: "Subsets",
        description: "Generate all subsets",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "subset-basic",
            name: "Basic Subsets",
            description: "Generate all subsets",
            problems: [
              { name: "Subsets", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subsets/" },
              { name: "Subsets II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subsets-ii/" },
            ]
          }
        ]
      },
      {
        id: "backtrack-game",
        name: "Game Theory",
        description: "Minimax and game problems",
        icon: <Cpu className="h-4 w-4" />,
        subTopics: [
          {
            id: "game-basic",
            name: "Basic Game Theory",
            description: "Win-lose analysis",
            problems: [
              { name: "Predict Winner", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/predict-the-winner/" },
              { name: "Stone Game", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/stone-game/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    description: "Various sorting techniques",
    icon: <Binary className="h-5 w-5" />,
    subTopics: [
      {
        id: "sort-comparison",
        name: "Comparison Sorting",
        description: "Sort using element comparisons",
        icon: <Layers className="h-4 w-4" />,
        subTopics: [
          {
            id: "sort-merge",
            name: "Merge Sort",
            description: "Divide and conquer sorting",
            problems: [
              { name: "Merge Sort Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/merge-sorted-array/" },
              { name: "Sort List", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/sort-list/" },
            ]
          },
          {
            id: "sort-quick",
            name: "Quick Sort",
            description: "Pivot-based sorting",
            problems: [
              { name: "Kth Largest Element", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
            ]
          }
        ]
      },
      {
        id: "sort-selection",
        name: "Selection Problems",
        description: "Find kth smallest/largest",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "sel-kth",
            name: "Kth Element",
            description: "Find kth smallest/largest",
            problems: [
              { name: "Kth Largest Element", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
              { name: "Kth Smallest Element in Sorted Matrix", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
            ]
          },
          {
            id: "sel-frequency",
            name: "Top K Frequent",
            description: "Find most frequent elements",
            problems: [
              { name: "Top K Frequent Elements", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/" },
              { name: "Top K Frequent Words", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-words/" },
            ]
          }
        ]
      }
    ]
  },
  {
    id: "math",
    name: "Math & Geometry",
    description: "Mathematical and geometric problems",
    icon: <Cpu className="h-5 w-5" />,
    subTopics: [
      {
        id: "math-gcd",
        name: "GCD & LCM",
        description: "Greatest common divisor problems",
        icon: <Box className="h-4 w-4" />,
        subTopics: [
          {
            id: "gcd-basic",
            name: "Basic GCD",
            description: "Euclidean algorithm",
            problems: [
              { name: "GCD of Array", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/greatest-common-divisor-of-array/" },
              { name: "LCM of Array", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/least-common-multiple-of-array/" },
            ]
          }
        ]
      },
      {
        id: "math-prime",
        name: "Prime Numbers",
        description: "Prime-related problems",
        icon: <Hexagon className="h-4 w-4" />,
        subTopics: [
          {
            id: "prime-sieve",
            name: "Sieve of Eratosthenes",
            description: "Generate prime numbers",
            problems: [
              { name: "Count Primes", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/count-primes/" },
              { name: "Prime Arrangements", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/prime-arrangements/" },
            ]
          }
        ]
      },
      {
        id: "math-bit",
        name: "Bit Manipulation",
        description: "Bit-level operations",
        icon: <Binary className="h-4 w-4" />,
        subTopics: [
          {
            id: "bit-basic",
            name: "Basic Bit Operations",
            description: "AND, OR, XOR operations",
            problems: [
              { name: "Number of 1 Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/" },
              { name: "Reverse Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-bits/" },
            ]
          },
          {
            id: "bit-xor",
            name: "XOR Problems",
            description: "XOR-based solutions",
            problems: [
              { name: "Single Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/single-number/" },
              { name: "Single Number II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/single-number-ii/" },
              { name: "Missing Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/missing-number/" },
            ]
          }
        ]
      }
    ]
  }
];

const difficultyColors: Record<string, string> = {
  "Easy": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Hard": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const DSA = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>(dsaTopics[0].id);
  const [expandedSubTopics, setExpandedSubTopics] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  const toggleSubTopic = (id: string) => {
    const newExpanded = new Set(expandedSubTopics);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubTopics(newExpanded);
  };

  const openProblemsDialog = (problems: Problem[], title: string) => {
    setSelectedProblems(problems);
    setSelectedTitle(title);
    setDialogOpen(true);
  };

  const currentTopic = dsaTopics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container py-12 px-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-violet-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Data Structures & Algorithms
            </h1>
            <p className="text-violet-100 mb-4">
              Master DSA patterns with hierarchical topics. Click to expand and practice.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-violet-200">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>{dsaTopics.length} Main Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>{dsaTopics.reduce((acc, t) => acc + t.subTopics.length, 0)} Sub Topics</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>200+ Problems</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 px-4">
        {/* Main Topic Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {dsaTopics.map((topic) => (
            <Button
              key={topic.id}
              variant={selectedTopic === topic.id ? "default" : "outline"}
              onClick={() => setSelectedTopic(topic.id)}
              className="flex items-center gap-2"
            >
              {topic.icon}
              <span className="hidden sm:inline">{topic.name}</span>
            </Button>
          ))}
        </div>

        {/* Current Topic Content */}
        <ScrollReveal>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {currentTopic?.icon}
              </div>
              <h2 className="text-2xl font-bold">{currentTopic?.name}</h2>
            </div>
            <p className="text-muted-foreground">{currentTopic?.description}</p>
          </div>
        </ScrollReveal>

        {/* Sub Topics List */}
        <div className="space-y-4">
          {currentTopic?.subTopics.map((subTopic, sIndex) => (
            <ScrollReveal key={subTopic.id} delay={sIndex * 50}>
              <Card className="overflow-hidden">
                <Collapsible
                  open={expandedSubTopics.has(subTopic.id)}
                  onOpenChange={() => toggleSubTopic(subTopic.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          {subTopic.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{subTopic.name}</h3>
                          <p className="text-sm text-muted-foreground">{subTopic.description}</p>
                        </div>
                      </div>
                      {expandedSubTopics.has(subTopic.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t pt-4 space-y-3">
                      {subTopic.subTopics?.map((subSubTopic) => (
                        <div 
                          key={subSubTopic.id}
                          className="ml-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{subSubTopic.name}</h4>
                              <p className="text-sm text-muted-foreground">{subSubTopic.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {subSubTopic.problems.slice(0, 3).map((problem, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="secondary"
                                    className={`text-xs ${difficultyColors[problem.difficulty]}`}
                                  >
                                    {problem.difficulty[0]}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openProblemsDialog(subSubTopic.problems, subSubTopic.name)}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Problems Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTitle}</DialogTitle>
            <DialogDescription>
              Practice these problems to master this topic
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedProblems.map((problem, i) => (
              <a
                key={i}
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{problem.name}</span>
                <Badge className={difficultyColors[problem.difficulty]}>
                  {problem.difficulty}
                </Badge>
              </a>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DSA;