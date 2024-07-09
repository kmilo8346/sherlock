import { EventEmitter } from 'events';

enum EVENTS_ENUM {
  'USER:LOGGED_IN',
  'USER:LOGGED_OUT',
}
export type EventStreamerTypes = keyof typeof EVENTS_ENUM;

type args = object | number | string | boolean | any;

export class EventStreamer {
  private static emitter = new EventEmitter();

  on(event: EventStreamerTypes | symbol, listener: (...args: args[]) => void) {
    EventStreamer.emitter.on(event, listener);
  }

  off(event: EventStreamerTypes | symbol, listener: (...args: args[]) => void) {
    EventStreamer.emitter.off(event, listener);
  }

  emit(event: EventStreamerTypes | symbol, ...args: args[]): boolean {
    return EventStreamer.emitter.emit(event, ...args);
  }
}

export const streamer = new EventStreamer();
