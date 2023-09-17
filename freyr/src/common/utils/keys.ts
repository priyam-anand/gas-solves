import { v4 as uuidv4 } from 'uuid';

export function createFileKey({ time }) {
  return `file_${time}_${uuidv4()}`;
}

export function createTestKey({ time }) {
  return `test_${time}_${uuidv4()}`;
}

export function createImageKey({ time }) {
  return `image_${time}_${uuidv4()}`;
}
