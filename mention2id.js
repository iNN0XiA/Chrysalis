module.exports = (mention) => {
  if (!mention) return;
  if (mention.startsWith('<@!')) return mention.slice(3,-1);
  if (mention.startsWith('<@')) return mention.slice(2,-1);
  return mention;
}
