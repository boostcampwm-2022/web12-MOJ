const problems = Array.from({ length: 57 }, (_, i) => {
  return {
    id: i + 1,
    title: `${i + 1}번째 문제 - 알고리즘 망령 효석이`,
    content: 'content요',
    input: 'input입니다.',
    output: 'output입니다.',
    example: 'example입니다.',
    limit: 'limit입니다.',
    timeLimit: 100,
    memoryLimit: 512,
    rate: Math.floor(Math.random() * 100) + Math.floor(Math.random() * 10) / 10,
    datetime: new Date().getTime(),
    visible: Math.floor(Math.random() * 2) === 0 ? false : true,
    examples: [{ input: '213', output: '12323' }],
  };
}).reverse();

export { problems };
