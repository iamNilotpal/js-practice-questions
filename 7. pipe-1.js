function pipe(obj) {
  return (...args) => {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const value = obj[key];
      if (typeof value === 'function') obj[key] = value(...args);
      else obj[key] = pipe(value)(...args);
    });

    return obj;
  };
}

console.log(
  pipe({
    b: -1,
    c: [],
    a: { a: (a, b, c, d) => a + b + c + d },
    d: { d: (a, b, c, d) => a - b + c + d },
  })(1, 2, 3, 4)
);
