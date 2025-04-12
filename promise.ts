type FinallyCallback = () => void;
type Reject<E = unknown> = (error: E) => void;
type Resolve<T = unknown> = (value: T) => void;
type ThenCallback<V = unknown> = (value?: V) => void;
type CatchCallback<E = unknown> = (error?: E) => void;

type PromiseState = 'pending' | 'rejected' | 'fulfilled';
type Executor<V = unknown, E = unknown> = (
  resolve: Resolve<V>,
  reject: Reject<E>
) => void;

class CustomPromise<V = unknown, E = unknown> {
  private value: V | undefined;
  private error: E | undefined;
  private promiseState: PromiseState = 'pending';

  private errorCallbacks: ThenCallback<E>[] = [];
  private finallyCallbacks: FinallyCallback[] = [];
  private successCallbacks: ThenCallback<V>[] = [];

  constructor(executor: Executor<V, E>) {
    executor(this._resolve, this._reject);
  }

  public get state() {
    return this.promiseState;
  }

  public static resolve = <V = unknown>(value: V) => {
    return new CustomPromise<V>((resolve) => resolve(value));
  };

  public static reject = <E = unknown>(error: E) => {
    return new CustomPromise<unknown, E>((_, reject) => reject(error));
  };

  public then = (callback: ThenCallback<V>) => {
    if (this.promiseState === 'fulfilled') {
      callback(this.value);
      return this;
    }

    this.successCallbacks.push(callback);
    return this;
  };

  public catch = (callback: CatchCallback<E>) => {
    if (this.promiseState === 'rejected') {
      callback(this.error);
      return this;
    }

    this.errorCallbacks.push(callback);
    return this;
  };

  public finally = (callback: FinallyCallback) => {
    if (this.promiseState !== 'pending') {
      callback();
      return this;
    }

    this.finallyCallbacks.push(callback);
    return this;
  };

  private _resolve = (value: V) => {
    if (this.promiseState !== 'pending') return;

    this.value = value;
    this.promiseState = 'fulfilled';

    this.successCallbacks.forEach((callback) => callback(value));
    this.finallyCallbacks.forEach((callback) => callback());
  };

  private _reject = (error: E) => {
    if (this.promiseState === 'rejected') return;

    this.error = error;
    this.promiseState = 'rejected';

    this.errorCallbacks.forEach((callback) => callback(error));
    this.finallyCallbacks.forEach((callback) => callback());
  };
}
