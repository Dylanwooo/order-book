export const groupByPrice = (levels) => {
  return levels
    .map((level, idx) => {
      const next = levels[idx + 1];
      const prev = levels[idx - 1];

      if (next && level[0] === next[0]) {
        return [level[0], level[1] + next[1]];
      } else if (prev && level[0] === prev[0]) {
        return [];
      } else {
        return level;
      }
    })
    .filter((level) => level.length > 0);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num);
};
