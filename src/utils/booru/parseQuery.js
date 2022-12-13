module.exports = async (message, args) => {
  let query = '';
  if (args.length>0) query = message.author ? args.join(' ') : args[0];
  while (query.includes(' ,')) query = query.replace(' ,',',');
  while (query.includes(', ')) query = query.replace(', ',',');
  while (query.includes(',,')) query = query.replace(',,',',');
  if (query.startsWith(',')) query = query.slice(1);
  if (query.endsWith(',')) query = query.slice(0,-1);
  return query;
}
