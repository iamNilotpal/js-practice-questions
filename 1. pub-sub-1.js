class PubSub {
  #subscribers = new Set();

  subscribe(fn) {
    this.#subscribers.add(fn);
  }

  unsubscribe(fn) {
    this.#subscribers.delete(fn);
  }

  fire(data) {
    this.#subscribers.forEach((_, val) => val(data));
  }
}

const pubsub = new PubSub();

const handler1 = (data) => {
  console.log('handler1 called.', { data });
};

const handler2 = (data) => {
  console.log('handler2 called.', { data });
};

pubsub.subscribe(handler1);
pubsub.fire('Hello World');

pubsub.unsubscribe(handler1);

pubsub.subscribe(handler2);
pubsub.subscribe(handler1);
pubsub.fire('Hello World');

pubsub.unsubscribe(handler1);
pubsub.unsubscribe(handler2);
