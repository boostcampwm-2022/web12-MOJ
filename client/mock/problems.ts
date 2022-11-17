const problems = Array.from({ length: 113 }, (_, i) => {
  return {
    id: i + 1,
    title: `${i + 1}번째 문제 - 알고리즘 망령 효석이`,
    rate: Math.floor(Math.random() * 100) + Math.floor(Math.random() * 10) / 10,
    datetime: new Date().getTime(),
    state: Math.floor(Math.random() * 2),
  };
}).reverse();

export { problems };
