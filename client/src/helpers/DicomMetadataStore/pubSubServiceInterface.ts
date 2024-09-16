/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/**
 * Create a random GUID
 *
 * @return {string}
 */
const guid = () => {
  const getFourRandomValues = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    getFourRandomValues() +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    getFourRandomValues() +
    getFourRandomValues()
  );
};

/**
 * Subscribe to updates.
 *
 * @param {string} eventName The name of the event
 * @param {Function} callback Events callback
 * @return {Object} Observable object with actions
 */
function subscribe(
  this: {
    listeners: any;
    subscribe: (eventName: string | number, callback: any) => { unsubscribe: () => any };
    _broadcastEvent: (eventName: string | number, callbackProps: any) => void;
    _unsubscribe: (eventName: string | number, listenerId: any) => void;
    _isValidEvent: (eventName: unknown) => boolean;
  },
  eventName: string | number,
  callback: any,
) {
  if (this._isValidEvent(eventName)) {
    const listenerId = guid();
    const subscription = { id: listenerId, callback };

    // Console.info(`Subscribing to '${eventName}'.`);
    if (Array.isArray(this.listeners[eventName])) {
      this.listeners[eventName].push(subscription);
    } else {
      this.listeners[eventName] = [subscription];
    }

    return {
      unsubscribe: () => {
        this._unsubscribe(eventName, listenerId);
      },
    };
  }
  throw new Error(`Event ${eventName} not supported.`);
}

/**
 * Unsubscribe to measurement updates.
 *
 * @param {string} eventName The name of the event
 * @param {string} listenerId The listeners id
 * @return void
 */
function _unsubscribe(
  this: {
    listeners: any;
    subscribe: (eventName: string | number, callback: any) => { unsubscribe: () => any };
    _broadcastEvent: (eventName: string | number, callbackProps: any) => void;
    _unsubscribe: (eventName: string | number, listenerId: any) => void;
    _isValidEvent: (eventName: unknown) => boolean;
  },
  eventName: string | number,
  listenerId: any,
) {
  if (!this.listeners[eventName]) {
    return;
  }

  const listeners = this.listeners[eventName];
  if (Array.isArray(listeners)) {
    this.listeners[eventName] = listeners.filter(({ id }) => id !== listenerId);
  } else {
    this.listeners[eventName] = undefined;
  }
}

/**
 * Check if a given event is valid.
 *
 * @param {string} eventName The name of the event
 * @return {boolean} Event name validation
 */
function _isValidEvent(
  this: {
    EVENTS(EVENTS: any): unknown;
    subscribe: (eventName: string | number, callback: any) => { unsubscribe: () => any };
    _broadcastEvent: (eventName: string | number, callbackProps: any) => void;
    _unsubscribe: (eventName: string | number, listenerId: any) => void;
    _isValidEvent: (eventName: unknown) => boolean;
  },
  eventName: unknown,
) {
  return Object.values(this.EVENTS).includes(eventName);
}

/**
 * Broadcasts changes.
 *
 * @param {string} eventName - The event name
 * @param {func} callbackProps - Properties to pass callback
 * @return void
 */
function _broadcastEvent(
  this: {
    listeners: Record<string, { callback: (arg0: any) => void }[]>;
    subscribe: (eventName: string | number, callback: any) => { unsubscribe: () => any };
    _broadcastEvent: (eventName: string | number, callbackProps: any) => void;
    _unsubscribe: (eventName: string | number, listenerId: any) => void;
    _isValidEvent: (eventName: unknown) => boolean;
  },
  eventName: string | number,
  callbackProps: any,
) {
  const hasListeners = Object.keys(this.listeners).length > 0;
  const hasCallbacks = Array.isArray(this.listeners[eventName]);

  if (hasListeners && hasCallbacks) {
    this.listeners[eventName].forEach((listener: { callback: (arg0: any) => void }) => {
      listener.callback(callbackProps);
    });
  }
}

/** Export a PubSubService class to be used instead of the individual items */
export class PubSubService {
  EVENTS: any;

  subscribe: (eventName: string, callback: Function) => { unsubscribe: () => any };

  _broadcastEvent: (eventName: string, callbackProps: any) => void;

  _unsubscribe: (eventName: string, listenerId: string) => void;

  _isValidEvent: (eventName: string) => boolean;

  listeners: {};

  unsubscriptions: any[];

  constructor(EVENTS: any) {
    this.EVENTS = EVENTS;
    this.subscribe = subscribe;
    this._broadcastEvent = _broadcastEvent;
    this._unsubscribe = _unsubscribe;
    this._isValidEvent = _isValidEvent;
    this.listeners = {};
    this.unsubscriptions = [];
  }

  reset() {
    this.unsubscriptions.forEach((unsub) => unsub());
    this.unsubscriptions = [];
  }

  /**
   * Creates an event that records whether or not someone
   * has consumed it.  Call eventData.consume() to consume the event.
   * Check eventData.isConsumed to see if it is consumed or not.
   * @param props - to include in the event
   */
  protected createConsumableEvent(props: any) {
    return {
      ...props,
      isConsumed: false,
      consume: function Consume() {
        this.isConsumed = true;
      },
    };
  }
}

export interface IPubSubServiceInterface {
  subscribe: (eventName: string, callback: Function) => { unsubscribe: () => any };
  _broadcastEvent: (eventName: string, callbackProps: any) => void;
  _unsubscribe: (eventName: string, listenerId: string) => void;
  _isValidEvent: (eventName: string) => boolean;
}

/**
 * Consumer must implement:
 * this.listeners = {}
 * this.EVENTS = { "EVENT_KEY": "EVENT_VALUE" }
 */
const pubSubServiceInterface: IPubSubServiceInterface = {
  subscribe,
  _broadcastEvent,
  _unsubscribe,
  _isValidEvent,
};

export default pubSubServiceInterface;
