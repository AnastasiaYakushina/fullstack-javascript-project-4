import * as cherio from 'cheerio';

export const getAttributeValues = (html, tag, attr) => {
  const $ = cherio.load(html);
  let result = [];
  $(tag).each((_i, item) => {
    result = [...result, $(item).attr(attr)];
  });
  return result;
};

export const changeAttributeValues = (html, tag, attr, newValues) => {
  const $ = cherio.load(html);
  $(tag).each((i, item) => {
    $(item).attr(attr, newValues[i]);
  });
  return $.html();
};
