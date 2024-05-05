function pipe(obj) {
  return (a, b, c) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const value = obj[key];
      if (typeof value === 'function') obj[key] = value(a, b, c);
      else obj[key] = pipe(value)(a, b, c);
    });

    return obj;
  };
}

console.log(
  pipe({
    b: -1,
    c: [],
    a: { a: (a, b, c) => a + b + c },
    d: { d: (a, b, c) => a - b + c },
  })(1, 2, 3)
);
