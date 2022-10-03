const prettyPrintError = ({ msg, param, value }) => {
  return `${msg} for ${param}: "${value}"`;
}

module.exports = prettyPrintError;