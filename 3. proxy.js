const obj = { value: 0 };

const proxyObj = new Proxy(obj, {
  get: (target, property) => {
    target[property]++;
    return target[property];
  },
});

console.log(proxyObj.value);
console.log(proxyObj.value);
console.log(proxyObj.value);
console.log(proxyObj.value);
