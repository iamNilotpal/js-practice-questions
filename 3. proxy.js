const obj = { value: 0 };

const proxiedObj = new Proxy(obj, {
  get: (target, property) => {
    target[property]++;
    return target[property];
  },
});

console.log(proxiedObj.value);
console.log(proxiedObj.value);
console.log(proxiedObj.value);
console.log(proxiedObj.value);
