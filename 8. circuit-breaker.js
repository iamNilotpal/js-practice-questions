function circuitBreaker(fn, failureCount, threshold) {
  let failures = 0;
  let isHalted = false;
  let lastFailureTime = 0;

  return (...args) => {
    try {
      if (isHalted) {
        const diff = Date.now() - lastFailureTime;

        if (diff > threshold) isHalted = false;
        else console.error('Service is being Halted.');

        return;
      }

      const result = fn(...args);
      failures = 0;
      return result;
    } catch (error) {
      failures++;
      lastFailureTime = Date.now();

      if (failures >= failureCount) isHalted = true;
      console.log('There was an error.');
    }
  };
}

function fetchData() {
  let failures = 0;

  return () => {
    failures++;
    if (failures < 4) throw new Error('Error');
    else return Math.floor(Math.random() * 100);
  };
}

const breaker = circuitBreaker(fetchData(), 3, 3000);

breaker();
breaker();
breaker();

breaker();
breaker();
breaker();

setTimeout(() => breaker(), 3001);
setTimeout(() => console.log(breaker()), 3002);
