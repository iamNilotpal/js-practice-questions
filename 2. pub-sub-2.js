class PubSubAdvanced {
  #asyncSubscriveMap = new Map();
  #eventsToCallbackMap = new Map();
  #eventsToOnlyOnceCallbackMap = new Map();

  #subscribe_internal(event, callback, map) {
    const hasData = map.has(event);

    if (!hasData) {
      map.set(event, [callback]);
      return;
    }

    const prevData = map.get(event);
    map.set(prevData.concat(callback));
  }

  subscribe(event, callback) {
    this.#subscribe_internal(event, callback, this.#eventsToCallbackMap);
    return () =>
      this.#remove_internal(event, callback, this.#eventsToCallbackMap);
  }

  subscribeOnce(event, callback) {
    this.#subscribe_internal(
      event,
      callback,
      this.#eventsToOnlyOnceCallbackMap
    );
  }

  subscribeAsync(event) {
    return new Promise((resolve) => {
      if (!this.#asyncSubscriveMap.has(event))
        this.#asyncSubscriveMap.set(event, [resolve]);
      else {
        const existingFns = this.#asyncSubscriveMap.get(event) || [];
        this.#asyncSubscriveMap.set(event, existingFns.concat([resolve]));
      }
    });
  }

  #remove_internal(event, callback, map) {
    const prevData = map.get(event);
    map.set(event, prevData?.filter((c) => c !== callback) || []);
  }

  #publish_internal(event, data) {
    if (!event) {
      this.#eventsToCallbackMap.forEach((fns) =>
        fns?.forEach((fn) => fn?.(data))
      );

      this.#eventsToOnlyOnceCallbackMap.forEach((fns, e) => {
        fns?.forEach((fn) => {
          fn?.(data);
          this.#remove_internal(e, fn, this.#eventsToOnlyOnceCallbackMap);
        });
      });

      this.#asyncSubscriveMap.forEach((fns) => {
        fns?.forEach((fn) => fn?.(data));
      });

      return;
    }

    const multipleMapsData = this.#eventsToCallbackMap.get(event);
    const onlyOnceData = this.#eventsToOnlyOnceCallbackMap.get(event);

    if (!multipleMapsData && !onlyOnceData) return;
    if (multipleMapsData) multipleMapsData.forEach((fn) => fn(data));

    if (onlyOnceData)
      onlyOnceData.forEach((fn) => {
        fn(data);
        this.#remove_internal(event, fn, this.#eventsToOnlyOnceCallbackMap);
      });
  }

  publish(event, data) {
    this.#publish_internal(event, data);
  }

  publishAll(data) {
    this.#publish_internal(null, data);
  }
}

const pubsubAdvanced = new PubSubAdvanced();

// pubsubAdvanced.subscribeOnce('greet', console.log);
// pubsubAdvanced.subscribeOnce('hello', console.log);

// pubsubAdvanced.subscribe('user_created', console.log)();
// pubsubAdvanced.publishAll('User created.');

// pubsubAdvanced.publish('greet', 'Hi, Nilotpal.');
// pubsubAdvanced.publish('hello', 'Hello, World.');

// pubsubAdvanced.publish('greet', 'Hi, Nilotpal.');
// pubsubAdvanced.publish('hello', 'Hello, World.');

pubsubAdvanced.subscribeAsync('meow').then(console.log);
pubsubAdvanced.publishAll('Hello Meow');
