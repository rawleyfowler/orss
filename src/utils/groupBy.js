module.exports = (by) => 
  (acc, p) => ({
    ...acc,
    [p[by]]: [
      ...(acc[p[by]] || []),
      p
    ]
  })
