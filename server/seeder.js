require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

const questions = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    difficulty: 'easy',
    tags: ['Array', 'Hash Table'],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n}',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}'
    },
    company: ['Amazon', 'Google', 'Apple', 'Meta', 'Microsoft']
  },
  {
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'easy',
    tags: ['Linked List', 'Recursion'],
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Write your code here\n}'
    },
    company: ['Amazon', 'Microsoft', 'Apple']
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n}'
    },
    company: ['Amazon', 'Meta', 'Microsoft']
  },
  {
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    difficulty: 'medium',
    tags: ['Array', 'Sorting'],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4'
    ],
    starterCode: {
      javascript: 'function merge(intervals) {\n  // Write your code here\n}'
    },
    company: ['Google', 'Meta', 'Uber', 'Amazon']
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    difficulty: 'hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}'
    },
    company: ['Google', 'Amazon', 'Microsoft', 'Apple']
  }
];

const seedDB = async () => {
  try {
    // Delete existing records to avoid duplicates
    await Question.deleteMany();
    console.log('Previous Questions Deleted');

    // Insert new sample records
    await Question.insertMany(questions);
    console.log('Sample Questions Seeded Successfully');

    process.exit();
  } catch (error) {
    console.error('Error with seed data addition: ', error);
    process.exit(1);
  }
};

seedDB();
