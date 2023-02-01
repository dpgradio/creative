/**
 * @template T
 * @param {T} value
 * @param {function(T): void} callback
 * @returns {T}
 */
export default function tap(value, callback) {
  callback(value)
  return value
}
