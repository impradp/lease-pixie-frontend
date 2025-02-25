// Add TextEncoder polyfill for Node.js environment
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Import Jest DOM for DOM testing utilities
import "@testing-library/jest-dom";
