require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const MCQ = require('./models/MCQ');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const codingQuestions = [
  // EASY
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n}',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}'
    },
    company: ['Google', 'Amazon', 'Facebook', 'Apple']
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    difficulty: 'easy',
    tags: ['String', 'Stack'],
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'The brackets match correctly.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All multiple brackets match correctly.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched bracket type.' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your code here\n}',
      python: 'def isValid(s):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}'
    },
    company: ['Facebook', 'Amazon', 'Microsoft']
  },
  {
    title: 'Merge Two Sorted Lists',
    description: 'You are given the heads of two sorted linked lists list1 and list2.\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\nReturn the head of the merged linked list.',
    difficulty: 'easy',
    tags: ['Linked List', 'Recursion'],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'The resulting list is sorted.' },
      { input: 'list1 = [], list2 = []', output: '[]', explanation: 'Empty lists merge into empty list.' }
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    starterCode: {
      javascript: 'function mergeTwoLists(list1, list2) {\n  // Write your code here\n}',
      python: 'def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}'
    },
    company: ['Microsoft', 'Amazon', 'LinkedIn']
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    difficulty: 'easy',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Write your code here\n}',
      python: 'def maxSubArray(nums):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n    }\n}'
    },
    company: ['LinkedIn', 'Amazon', 'Apple']
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    difficulty: 'easy',
    tags: ['Array', 'Dynamic Programming'],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      javascript: 'function maxProfit(prices) {\n  // Write your code here\n}',
      python: 'def maxProfit(prices):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Facebook', 'Microsoft']
  },

  // MEDIUM
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}',
      python: 'def lengthOfLongestSubstring(s):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Google', 'Facebook']
  },
  {
    title: '3Sum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\nNotice that the solution set must not contain duplicate triplets.',
    difficulty: 'medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2].' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'The only possible triplet does not sum up to 0.' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      javascript: 'function threeSum(nums) {\n  // Write your code here\n}',
      python: 'def threeSum(nums):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n    }\n}'
    },
    company: ['Facebook', 'Amazon', 'Apple']
  },
  {
    title: 'Container With Most Water',
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\nReturn the maximum amount of water a container can store.',
    difficulty: 'medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area of water the container can contain is 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'The max area is 1.' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: {
      javascript: 'function maxArea(height) {\n  // Write your code here\n}',
      python: 'def maxArea(height):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n    }\n}'
    },
    company: ['Google', 'Amazon', 'Facebook']
  },
  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    difficulty: 'medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'There is only 1 island.' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: 'There are 3 islands.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1".'],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  // Write your code here\n}',
      python: 'def numIslands(grid):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Bloomberg', 'Microsoft']
  },
  {
    title: 'LRU Cache',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\nThe functions get and put must each run in O(1) average time complexity.',
    difficulty: 'medium',
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', output: '[null, null, null, 1, null, -1, null, -1, 3, 4]', explanation: 'LRUCache operations' }
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put.'],
    starterCode: {
      javascript: 'class LRUCache {\n  constructor(capacity) {\n  }\n  get(key) {\n  }\n  put(key, value) {\n  }\n}',
      python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass',
      java: 'class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    public int get(int key) {\n    }\n    public void put(int key, int value) {\n    }\n}'
    },
    company: ['Amazon', 'Facebook', 'Microsoft']
  },

  // HARD
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\nThe overall run time complexity should be O(log (m+n)).',
    difficulty: 'hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}',
      python: 'def findMedianSortedArrays(nums1, nums2):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Google', 'Apple']
  },
  {
    title: 'Merge k Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\nMerge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'The linked-lists are merged.' },
      { input: 'lists = []', output: '[]', explanation: 'Empty inputs give empty list.' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.', 'The sum of lists[i].length will not exceed 10^4.'],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  // Write your code here\n}',
      python: 'def mergeKLists(lists):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Facebook', 'Google']
  },
  {
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: 'It can trap 9 units of water.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: 'function trap(height) {\n  // Write your code here\n}',
      python: 'def trap(height):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Goldman Sachs', 'Facebook']
  },
  {
    title: 'N-Queens',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\nEach solution contains a distinct board configuration of the n-queens\' placement, where \'Q\' and \'.\' both indicate a queen and an empty space, respectively.',
    difficulty: 'hard',
    tags: ['Array', 'Backtracking'],
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'There are two distinct solutions to the 4-queens puzzle.' },
      { input: 'n = 1', output: '[["Q"]]', explanation: 'Only one distinct solution.' }
    ],
    constraints: ['1 <= n <= 9'],
    starterCode: {
      javascript: 'function solveNQueens(n) {\n  // Write your code here\n}',
      python: 'def solveNQueens(n):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Microsoft', 'Bloomberg']
  },
  {
    title: 'Word Search II',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board.\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.',
    difficulty: 'hard',
    tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'],
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]', explanation: 'Both "eat" and "oath" exists in the grid.' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]', explanation: 'Not possible to reuse cell "b".' }
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', 'board[i][j] is a lowercase English letter.', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10', 'words[i] consists of lowercase English letters.', 'All the strings of words are unique.'],
    starterCode: {
      javascript: 'function findWords(board, words) {\n  // Write your code here\n}',
      python: 'def findWords(board, words):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Microsoft', 'Uber']
  }
];

const mcqs = [
  // OS
  {
    topic: 'OS',
    difficulty: 'easy',
    question: 'Which of the following is responsible for allocating CPU time to processes?',
    options: ['Process Scheduler', 'Memory Manager', 'File Manager', 'I/O Manager'],
    correctAnswer: 0,
    explanation: 'The Process Scheduler is a part of the operating system that makes the decision of which process runs at a certain point in time.'
  },
  {
    topic: 'OS',
    difficulty: 'medium',
    question: 'What is a "僵尸" (zombie) process in an Operating System?',
    options: [
      'A process that has completed execution but still has an entry in the process table',
      'A process that uses excessive CPU resources',
      'A process that continually replicates itself',
      'A parent process that has been killed'
    ],
    correctAnswer: 0,
    explanation: 'A zombie process is a process that has completed its execution but still has an entry in the process table. This entry is needed to allow the parent process to read its child\'s exit status.'
  },
  {
    topic: 'OS',
    difficulty: 'hard',
    question: 'Which scheduling algorithm is most likely to suffer from the "Convoy Effect"?',
    options: ['Round Robin', 'Shortest Job First', 'First-Come, First-Served (FCFS)', 'Multilevel Feedback Queue'],
    correctAnswer: 2,
    explanation: 'First-Come, First-Served (FCFS) is highly prone to the Convoy effect where short processes wait for a long process to finish using the CPU, resulting in lower CPU and device utilization.'
  },
  {
    topic: 'OS',
    difficulty: 'medium',
    question: 'What is thrashing in the context of Operating Systems?',
    options: [
      'When the OS spends more time paging than executing processes',
      'When a process enters an infinite loop',
      'When the hard drive becomes fragmented',
      'When two processes enter a deadlock'
    ],
    correctAnswer: 0,
    explanation: 'Thrashing occurs when an operating system spends a significant amount of its time swapping pages in and out of memory rather than actually executing programs.'
  },
  {
    topic: 'OS',
    difficulty: 'easy',
    question: 'Which of the following is NOT a valid state in a classic thread lifecycle?',
    options: ['New', 'Runnable', 'Waiting', 'Orphaned'],
    correctAnswer: 3,
    explanation: 'The classic thread states typically include New, Runnable, Waiting, Timed Waiting, and Terminated. "Orphaned" is a term generally used for processes whose parent parent process has terminated.'
  },

  // DBMS
  {
    topic: 'DBMS',
    difficulty: 'easy',
    question: 'Which of the following SQL commands is part of the Data Definition Language (DDL)?',
    options: ['SELECT', 'CREATE', 'UPDATE', 'INSERT'],
    correctAnswer: 1,
    explanation: 'CREATE is a DDL command used to create database objects like tables. SELECT, UPDATE, and INSERT are Data Manipulation Language (DML) commands.'
  },
  {
    topic: 'DBMS',
    difficulty: 'medium',
    question: 'In the context of database transactions, what does the "A" in ACID stand for?',
    options: ['Accuracy', 'Availability', 'Atomicity', 'Asynchronous'],
    correctAnswer: 2,
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity ensures that a transaction is treated as a single, indivisible logical unit of work.'
  },
  {
    topic: 'DBMS',
    difficulty: 'hard',
    question: 'Which normal form dictates that there should be no transitive dependency for non-prime attributes?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correctAnswer: 2,
    explanation: 'Third Normal Form (3NF) states that a relation is in 2NF and every non-prime attribute of the relation is non-transitively dependent on every candidate key.'
  },
  {
    topic: 'DBMS',
    difficulty: 'medium',
    question: 'What is a Clustered Index?',
    options: [
      'An index that stores the actual data rows in the indexed order',
      'An index created automatically on a foreign key',
      'An index designed specifically to speed up aggregate functions',
      'An index where data is stored totally separate from the index structure'
    ],
    correctAnswer: 0,
    explanation: 'A clustered index determines the physical order of data in a table. Therefore, a table can only have one clustered index.'
  },
  {
    topic: 'DBMS',
    difficulty: 'easy',
    question: 'What is the purpose of a PRIMARY KEY in a relational database table?',
    options: [
      'To automatically encrypt the row data',
      'To uniquely identify each record in a table',
      'To link the table to an external file',
      'To ensure all columns have different values'
    ],
    correctAnswer: 1,
    explanation: 'A primary key is a column (or set of columns) whose values uniquely identify every row in a table. It cannot contain NULL values.'
  },

  // Networking
  {
    topic: 'Networking',
    difficulty: 'easy',
    question: 'In the OSI model, which layer translates data formats into a syntax universally understood by network devices?',
    options: ['Application Layer', 'Presentation Layer', 'Session Layer', 'Transport Layer'],
    correctAnswer: 1,
    explanation: 'The Presentation Layer (Layer 6) is responsible for data translation, encryption, and compression, making data readable to the application layer.'
  },
  {
    topic: 'Networking',
    difficulty: 'medium',
    question: 'What is the primary function of the Address Resolution Protocol (ARP)?',
    options: [
      'Resolves IP addresses to MAC addresses',
      'Resolves domain names to IP addresses',
      'Determines the shortest path for a packet',
      'Assigns dynamic IP addresses to new devices'
    ],
    correctAnswer: 0,
    explanation: 'ARP is used to map an IP address (Network Layer) to a physical machine address like a MAC address (Data Link Layer) relative to the local network.'
  },
  {
    topic: 'Networking',
    difficulty: 'hard',
    question: 'In TCP, how does the slow start algorithm operate during congestion control?',
    options: [
      'It increments the congestion window size linearly for every ACK received',
      'It immediately falls back to a window size of 1 MSS upon a timeout',
      'It increases the congestion window size exponentially by doubling it every RTT',
      'It restricts packet sends until the receiver explicitly advertises a larger window'
    ],
    correctAnswer: 2,
    explanation: 'In the TCP Slow Start phase, the congestion window size grows exponentially; typically it doubles for every Round Trip Time (RTT) where ACKs are received successfully.'
  },
  {
    topic: 'Networking',
    difficulty: 'medium',
    question: 'Which of the following protocols is stateless?',
    options: ['TCP', 'HTTP', 'FTP', 'SSH'],
    correctAnswer: 1,
    explanation: 'HTTP is a stateless protocol, meaning that the server does not keep any state (information) between two requests from the same client without external structures like cookies.'
  },
  {
    topic: 'Networking',
    difficulty: 'easy',
    question: 'Under IPv4, what is the length of an IP address?',
    options: ['16 bits', '32 bits', '64 bits', '128 bits'],
    correctAnswer: 1,
    explanation: 'An IPv4 address is 32 bits long, generally represented in dotted-decimal notation (e.g., 192.168.1.1).'
  },

  // System Design
  {
    topic: 'System Design',
    difficulty: 'easy',
    question: 'What is the main benefit of using a Content Delivery Network (CDN)?',
    options: [
      'To encrypt data passing between server and client',
      'To reduce latency by serving static assets from geographically closer edge servers',
      'To convert XML formats into JSON for faster parsing',
      'To automatically scale monolithic applications vertically'
    ],
    correctAnswer: 1,
    explanation: 'CDNs cache static assets (like images, CSS, JS) at edge servers distributed globally. This places data physically closer to users, vastly reducing response latency.'
  },
  {
    topic: 'System Design',
    difficulty: 'medium',
    question: 'In distributed systems, what does the CAP Theorem state you cannot have simultaneously?',
    options: [
      'Consistency, Availability, and Partition Tolerance',
      'Concurrency, Atomicity, and Performance',
      'Cost-efficiency, Availability, and Portability',
      'Consistency, Accuracy, and Permission control'
    ],
    correctAnswer: 0,
    explanation: 'The CAP Theorem asserts that any distributed data store can only guarantee two of three properties at the same time: Consistency, Availability, and Partition tolerance.'
  },
  {
    topic: 'System Design',
    difficulty: 'hard',
    question: 'Which of the following strategies is best employed to avoid the "Thundering Herd" problem when a common cache key expires?',
    options: [
      'Read-through caching',
      'Cache invalidation via pub/sub',
      'Mutex locks or adding jitter to expiration times',
      'Evicting the cache key preemptively'
    ],
    correctAnswer: 2,
    explanation: 'A thundering herd happens when a heavily requested cache key expires and many workers simultaneously fetch the data from the database. Mutex locks or randomizing TTLs (jitter) prevents all workers from hitting the DB at once.'
  },
  {
    topic: 'System Design',
    difficulty: 'medium',
    question: 'Which load balancing algorithm randomly selects a server among those with the fewest active connections?',
    options: ['Round Robin', 'Least Connections', 'IP Hash', 'Weighted Round Robin'],
    correctAnswer: 1,
    explanation: 'The Least Connections algorithm directs traffic to the server with the fewest active connections. If multiple servers tie, it may pick randomly among them.'
  },
  {
    topic: 'System Design',
    difficulty: 'easy',
    question: 'Vertical scaling (scaling up) refers to:',
    options: [
      'Adding more nodes or machines to your server cluster',
      'Increasing the processing power (CPU/RAM) of an existing machine',
      'Splitting your database into multiple distinct partitions',
      'Using a managed cloud service instead of on-premise hardware'
    ],
    correctAnswer: 1,
    explanation: 'Vertical scaling involves making an existing server stronger by adding more resources like CPU or RAM. Adding more machines is called horizontal scaling (scaling out).'
  }
];

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data to avoid duplicates/errors if script is run multiple times
    console.log('Clearing existing Questions and MCQs...');
    await Question.deleteMany({});
    await MCQ.deleteMany({});

    // Seed Data
    console.log('Seeding Coding Questions...');
    await Question.insertMany(codingQuestions);
    
    console.log('Seeding MCQs...');
    await MCQ.insertMany(mcqs);

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
