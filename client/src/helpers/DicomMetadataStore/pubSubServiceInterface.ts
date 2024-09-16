import { guid } from '@/helpers/random';

export abstract class PubSubInterface<
  EventTypes extends string,
  EventsMap extends Record<EventTypes, unknown>,
> {
  private listeners: {
    [K in keyof EventsMap]?: { id: string; callback: (payload: EventsMap[K]) => void }[];
  } = {};

  /**
   * Subscribe to updates.
   *
   * Returns an object with a method to unsubscribe.
   * @param eventName The name of the event
   * @param callback The callback function
   */
  public subscribe<K extends keyof EventsMap>(
    eventName: K,
    callback: (payload: EventsMap[K]) => void,
  ): () => void {
    const listenerId = guid();
    const subscription = { id: listenerId, callback };

    if (eventName in this.listeners && this.listeners[eventName]) {
      this.listeners[eventName].push(subscription);
    } else {
      this.listeners[eventName] = [subscription];
    }

    return () => {
      this._unsubscribe(eventName, listenerId);
    };
  }

  /**
   * Unsubscribe to measurement updates.
   *
   * @param eventName The name of the event
   * @param listenerId The listeners id
   */
  private _unsubscribe<K extends keyof EventsMap>(eventName: K, listenerId: string): void {
    if (!(eventName in this.listeners)) return;
    this.listeners[eventName] = this.listeners[eventName]?.filter(({ id }) => id !== listenerId);
  }

  /**
   * Broadcasts changes.
   *
   * @param eventName - The event name
   * @param callbackProps - Properties to pass callback
   */
  protected broadcastEvent<K extends keyof EventsMap>(
    eventName: K,
    callbackProps: EventsMap[K],
  ): void {
    this.listeners[eventName]?.forEach((listener) => {
      listener.callback(callbackProps);
    });
  }
}
