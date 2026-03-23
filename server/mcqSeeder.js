require('dotenv').config();
const mongoose = require('mongoose');
const MCQ = require('./models/MCQ');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

const mcqs = [
  // DSA Questions
  {
    question: 'What is the time complexity of searching an element in a balanced binary search tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'A balanced BST reduces the search space by half at each step, leading to a logarithmic time complexity O(log n).',
    topic: 'DSA',
    difficulty: 'easy'
  },
  {
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Array'],
    correctAnswer: 1,
    explanation: 'A Stack follows the Last In First Out principle, where the last element inserted is the first one removed.',
    topic: 'DSA',
    difficulty: 'easy'
  },
  {
    question: 'In a hash table, what is the purpose of a hash function?',
    options: ['To map data to a specific index in the array', 'To encrypt the data', 'To sort the data', 'To compress the data'],
    correctAnswer: 0,
    explanation: 'A hash function takes a key and computes an index (or hash code) into an array of buckets or slots, from which the desired value can be found.',
    topic: 'DSA',
    difficulty: 'medium'
  },
  {
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    correctAnswer: 3,
    explanation: 'The worst-case occurs when the pivot chosen is the smallest or largest element, leading to highly unbalanced partitions (e.g., already sorted array), resulting in O(n^2).',
    topic: 'DSA',
    difficulty: 'medium'
  },
  {
    question: 'Which algorithm is used to find the shortest path in a graph with non-negative edge weights?',
    options: ['Depth First Search', 'Breadth First Search', 'Dijkstras Algorithm', 'Kruskals Algorithm'],
    correctAnswer: 2,
    explanation: 'Dijkstras algorithm is specifically designed for finding the shortest paths between nodes in a graph, provided all edge weights are non-negative.',
    topic: 'DSA',
    difficulty: 'hard'
  },
  
  // OS Questions
  {
    question: 'What is a process in an operating system?',
    options: ['A program in execution', 'A block of memory', 'A hardware device', 'A type of file'],
    correctAnswer: 0,
    explanation: 'A process is essentially a program in execution, containing the program code, its current activity, and allocated resources.',
    topic: 'OS',
    difficulty: 'easy'
  },
  {
    question: 'Which memory allocation scheme is subject to external fragmentation?',
    options: ['Paging', 'Contiguous Memory Allocation', 'Segmentation', 'Demand Paging'],
    correctAnswer: 1,
    explanation: 'Contiguous memory allocation can leave free space holes that are too small to satisfy new requests, causing external fragmentation. Paging eliminates external fragmentation.',
    topic: 'OS',
    difficulty: 'medium'
  },
  {
    question: 'What is a deadlock?',
    options: ['A state where a process continuously loops', 'A situation where a set of processes are blocked because each is holding a resource and waiting for another resource held by another process', 'A hardware failure', 'When RAM is completely full'],
    correctAnswer: 1,
    explanation: 'Deadlock describes a condition where two or more processes are unable to proceed because each is waiting for the other to release a resource.',
    topic: 'OS',
    difficulty: 'hard'
  },
  {
    question: 'Which scheduling algorithm is non-preemptive?',
    options: ['Round Robin', 'Shortest Remaining Time First', 'First Come First Serve (FCFS)', 'Multilevel Queue Scheduling'],
    correctAnswer: 2,
    explanation: 'In First Come First Serve (FCFS), once the CPU is allocated to a process, it keeps it until it releases it by terminating or requesting I/O.',
    topic: 'OS',
    difficulty: 'easy'
  },
  {
    question: 'What is thrashing?',
    options: ['When the CPU spends more time paging than executing processes', 'A CPU scheduling algorithm', 'A way to increase hard drive speed', 'A virus taking over the OS'],
    correctAnswer: 0,
    explanation: 'Thrashing occurs when a computer system continuously swaps pages and data back and forth between memory and disk because it does not have enough physical memory.',
    topic: 'OS',
    difficulty: 'medium'
  }
];

const seedDB = async () => {
  try {
    // Delete existing records to avoid duplicates
    await MCQ.deleteMany();
    console.log('Previous MCQs Deleted');

    // Insert new sample records
    await MCQ.insertMany(mcqs);
    console.log('Sample MCQs Seeded Successfully');

    process.exit();
  } catch (error) {
    console.error('Error with seed data addition: ', error);
    process.exit(1);
  }
};

seedDB();
