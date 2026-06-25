export function aiSchema(contract, options = {}) {
  if (!contract || typeof contract.toJSONSchema !== 'function') {
    throw new Error('aiSchema(contract) requires a Sigil contract');
  }

  return contract.toJSONSchema(options);
}
