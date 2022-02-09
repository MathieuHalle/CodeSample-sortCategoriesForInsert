/**
 * Function that will sort a JSON string in a way so it can be inserted
 * in a database without breaking the parent-child relations.
 *
 * The function make sure a parent element will always precede any of it's
 * children based on the id and parent_id properties found in each element
 *
 * @param    {String}  inputJson   A JSON string representing a list of elements to sort
 * @param    {Boolean} flatten     Should the output be flattened or a multi-dimensions array
 * @return   {String|Error}        A JSON string representing a sorted version of the input or an Error
 */

module.exports = function sortCategoriesForInsert(inputJson, flatten = true) {
  try {
    // Convert the input string into a JSON object
    var inputData = JSON.parse(inputJson);

    // Sort the data by parent_id and id
    inputData.sort(function (a, b) {
      return (a.parent_id || -1) - (b.parent_id || -1) || a.id - b.id;
    });

    // Filter the flat array to make a multi-dimensions object
    // based on the id and parent_id
    var nestedData = inputData.filter(function (a) {
      // Prepare the element and insert it
      a.kids = this[a.id] && this[a.id].kids;
      this[a.id] = a;

      // If there is no parent_id, go to the next element
      if (a.parent_id === null) {
        return true;
      }

      // Add the element as children
      this[a.parent_id] = this[a.parent_id] || {};
      this[a.parent_id].kids = this[a.parent_id].kids || [];
      this[a.parent_id].kids.push(a);
    }, Object.create(null));

    // Return the result according to the flatten param
    if (flatten) {
      return JSON.stringify(flattenArray(nestedData));
    } else {
      return JSON.stringify(nestedData);
    }
  } catch (error) {
    return error;
  }
};

/**
 * Function that flattens a multi-dimensions array
 * @param    {Array|Object} obj   An object or an array
 * @return   {Array}              A flatten array
 */
const flattenArray = (obj) => {
  // Make sure we have an array to start with
  const array = Array.isArray(obj) ? obj : [obj];

  // Flatten the array and return it
  return array.reduce((acc, value) => {
    acc.push(value);
    if (value.kids) {
      acc = acc.concat(flattenArray(value.kids));
      delete value.kids;
    }
    return acc;
  }, []);
};
