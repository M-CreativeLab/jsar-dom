import { describe, it, expect } from '@jest/globals';
import ImageDataImpl from './ImageData';

describe('ImageDataImpl', () => {
  it('should create a new instance with default settings', () => {
    // Arrange
    const data = new Uint8ClampedArray([255, 0, 0, 255]);
    const width = 100;
    const height = 200;

    // Act
    const imageData = new ImageDataImpl(data, width, height);

    // Assert
    expect(imageData.data).toBe(data);
    expect(imageData.width).toBe(width);
    expect(imageData.height).toBe(height);
    expect(imageData.colorSpace).toBe('srgb');
  });

  it('should create a new instance with custom settings', () => {
    // Arrange
    const data = new Uint8ClampedArray([255, 0, 0, 255]);
    const width = 100;
    const height = 200;
    const colorSpace = 'p3';

    // Act
    const imageData = new ImageDataImpl(data, width, height, { colorSpace });

    // Assert
    expect(imageData.data).toBe(data);
    expect(imageData.width).toBe(width);
    expect(imageData.height).toBe(height);
    expect(imageData.colorSpace).toBe(colorSpace);
  });

  it('should create a new instance with null data', () => {
    // Arrange
    const width = 100;
    const height = 200;

    // Act
    const imageData = new ImageDataImpl(width, height);

    // Assert
    expect(imageData.data).toBeNull();
    expect(imageData.width).toBe(width);
    expect(imageData.height).toBe(height);
    expect(imageData.colorSpace).toBe('srgb');
  });
});
