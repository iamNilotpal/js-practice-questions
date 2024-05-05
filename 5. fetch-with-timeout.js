async function fetchWithTimeout(url, timeout) {
  return new Promise((resolve, reject) => {
    let timerId;
    const controller = new AbortController();

    timerId = setTimeout(() => controller.abort(), timeout);

    fetch(url, { signal: controller.signal })
      .then((r) => r.text())
      .then((data) => {
        clearTimeout(timerId);
        resolve(data);
      })
      .catch((e) => {
        clearTimeout(timerId);
        reject(e);
      });
  });
}

fetchWithTimeout('https://google.com', 5000)
  .then(console.log)
  .catch(console.log);
