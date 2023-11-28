import { describe, expect, it, jest } from '@jest/globals';
import { ResourceQueue } from './ResourceQueue';

describe('ResourceQueue', () => {
  it('should initialize with default values', () => {
    const queue = new ResourceQueue();
    expect(queue.paused).toBe(false);
    expect(queue.tail).toBeNull();
    expect(queue._asyncQueue).toBeNull();
  });

  it('should initialize with custom values', () => {
    const queue = new ResourceQueue({
      paused: true,
    });
    expect(queue.paused).toBe(true);
    expect(queue._asyncQueue).toBeUndefined();
  });

  it('should load script immediately', () => {
    const queue = new ResourceQueue();
    const onload = () => Promise.resolve();
    queue.push(null, onload, null, false, {
      id: 0,
      localName: 'script',
    } as any);
    expect(queue.tail).toBeNull();
  });

  it('should push a request to the queue', async () => {
    const queue = new ResourceQueue();
    const request = Promise.resolve('data');
    const onload = jest.fn() as any;
    const onerror = jest.fn() as any;

    const future = queue.push(request, onload, onerror, false);

    expect(queue.tail).toBeDefined();
    expect(queue.tail.isScript).toBe(false);
    expect(queue.tail.prev).toBeNull();
    expect(queue.tail.next).toBeNull();
    expect(queue.tail.onload).toBe(onload);
    expect(queue.tail.onerror).toBe(onerror);

    await future;
    expect(queue.tail).toBeNull();
  });

  it('should resume the queue', () => {
    const queue = new ResourceQueue();
    queue.paused = true;
    const item1 = { check: jest.fn() };
    const item2 = { check: jest.fn(), prev: item1 };
    const item3 = { check: jest.fn(), prev: item2 };
    queue.tail = item3 as any;

    queue.resume();
    expect(queue.paused).toBe(false);
    expect(item1.check).toHaveBeenCalled();
    expect(item2.check).not.toHaveBeenCalled();
    expect(item3.check).not.toHaveBeenCalled();
  });

  it('should push requests after resuming', async () => {
    const queue = new ResourceQueue({ paused: true });
    queue.resume();

    const onload = jest.fn() as any;
    const dummyPromise = Promise.resolve();
    await queue.push(dummyPromise, onload, null, false);

    expect(onload).toBeCalled();
  });
});