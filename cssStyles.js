const fetch = require("node-fetch");
const freqSelector = require("./freqSelector.js");

// fetch("https://shopify.com")
//   .then((res) => res.text())
//   .then((data) => {})
//   .catch((err) => console.error(err.message));

async function getDocumentData(url) {
  try {
    let response = await fetch(url);
    response = await response.text();
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getStyleSheet(url) {
  try {
    let res = await fetch(url);
    res = res.text();
    return res;
  } catch (e) {
    console.error(e);
  }
}

async function getCSSData(url) {
  let htmlData = await getDocumentData(url);
  //   get any stylesheets
  let linkElements = htmlData.match(/<link rel="stylesheet".*?\/>/gi);
  let links = [];
  for (linkElement of linkElements) {
    links.push(linkElement.match(/(?<=href=").*\b/g)[0]);
  }

  let stylesheets = [];
  for (link of links) {
    stylesheet = await getStyleSheet(link);
    stylesheets.push(stylesheet);
  }

  //   get inline CSS Data
  inlineCSS = htmlData.match(/(?<=style="|;)[^<>]+?(?=[;"])/gi);

  return [stylesheets, inlineCSS];
}

async function getRulesOnAttribute(
  attributes,
  getRelatedAttributes = false,
  url,
  stylseheets,
  inlineCSS
) {
  if (url) {
    let [stylesheets, inlineCSS] = await getCSSData(url);
  }
  let rules = inlineCSS;
  for (stylesheet of stylesheets) {
    rules.push(...stylesheet.match(/(?<=[;{]).+?(?=[;}])/gi));
  }
  // get only certain rules based on some attributes
  let extractedStyles = [];

  //   get expression to search for in the rules array
  regexAttributeSelectors = "";
  for (attribute of attributes) {
    regexAttributeSelectors +=
      (regexAttributeSelectors === "" ? "" : "|") + `(${attribute})`;
  }
  re = new RegExp(
    (getRelatedAttributes ? "" : "(?<!.)") + regexAttributeSelectors,
    "gi"
  );

  //   get rules (either only rules matching the exact attributes, or get related words as well).
  // Related rules will have the given attribute keyword.
  for (rule of rules) {
    if (rule.match(re) != null) {
      extractedStyles.push(rule);
    }
  }

  return [extractedStyles, rules];
}

getCSSData("https://shopify.com").then((res) => {
  [stylesheets, inlineCSS] = res;
  getRulesOnAttribute(["color"], false, false, stylesheets, inlineCSS).then(
    (res) => {
      [extractedStyles, rules] = res;
      console.log(freqSelector(extractedStyles, 4));
    }
  );
});
