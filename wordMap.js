/*
 * This file contains the Map of word --> term substitutions.
 */

/* exported sortedWordMap */

let dictionary = new Map();
dictionary.set('Sabra', '❌Sabra❌')
dictionary.set('Puma', '❌Puma❌')
dictionary.set('Caterpillar Inc', '❌Caterpillar Inc❌')
dictionary.set('Caterpillar', '❌Caterpillar❌')
dictionary.set('Hewlett Packard', '❌Hewlett Packard❌')
dictionary.set('HP', '❌HP❌')
dictionary.set('Ahava', '❌Ahava❌')
dictionary.set('SodaStream', '❌SodaStream❌')
dictionary.set('Siemens', '❌Siemens❌')
dictionary.set('AXA', '❌AXA❌')
dictionary.set('Starbucks', '❌Starbucks❌')
dictionary.set('Marvel', '❌Marvel❌')
dictionary.set('Elbit', '❌Elbit❌')

/*
 * After all the dictionary entries have been set, sort them by length.
 *
 * Because iteration over Maps happens by insertion order, this avoids
 * scenarios where words that are substrings of other words get substituted
 * first, leading to the longer word's substitution never triggering.
 * 
 * For example, the 'woman' substitution would never get triggered
 * if the 'man' substitution happens first because the input term 'woman'
 * would become 'wo👨', and the search for 'woman' would not find any matches.
 */
let tempArray = Array.from(dictionary);
tempArray.sort((pair1, pair2) => {
  // Each pair is an array with two entries: a word, and its word.
  // Ex: ['woman', '👩']
  const firstWord = pair1[0];
  const secondWord = pair2[0];

  if (firstWord.length > secondWord.length) {
    // The first word should come before the second word.
    return -1;
  }
  if (secondWord.length > firstWord.length) {
    // The second word should come before the first word.
    return 1;
  }

  // The words have the same length, it doesn't matter which comes first.
  return 0;
});

// Now that the entries are sorted, put them back into a Map.
let sortedWordMap = new Map(tempArray);
console.log(sortedWordMap);