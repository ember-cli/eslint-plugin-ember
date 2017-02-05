var ember = require('./ember');

module.exports = {
  reportUnorderedProperties: reportUnorderedProperties
};

function reportUnorderedProperties(node, context, toPropertyInfo) {
  var maxOrder = -1;
  var firstPropertyOfType = {};

  ember.getModuleProperties(node).forEach(function(property) {
    var info = toPropertyInfo(property);

    // check if this property should be moved further upwards
    if (info.order < maxOrder) {

      // look for correct position to insert this property
      for (var i = info.order + 1; i <= maxOrder; i++) {
        var firstPropertyOfNextType = firstPropertyOfType[i];
        if (firstPropertyOfNextType) {
          break;
        }
      }

      var typeName = info.name;
      var nextTypeName = firstPropertyOfNextType.name;
      var nextSourceLine = firstPropertyOfNextType.node.loc.start.line;

      context.report(property,
        `The ${typeName} should be above the ${nextTypeName} on line ${nextSourceLine}`);

    } else {
      maxOrder = info.order;

      if (!(info.order in firstPropertyOfType)) {
        firstPropertyOfType[info.order] = info;
      }
    }
  });
}
