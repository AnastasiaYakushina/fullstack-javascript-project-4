import * as cherio from 'cheerio';

export const getAttributeValues = (html, tag, attr) => {
  const $ = cherio.load(html);
  let result = [];
  $(tag).each((_i, item) => {
    if ($(item).attr(attr) !== undefined) {
      result = [...result, $(item).attr(attr)];
    }
  });
  return result;
};

export const changeAttributeValues = (html, tags, newValues) => {
  const $ = cherio.load(html);
  tags.forEach(({ tag, attr }) => {
    $(tag).each((_i, item) => {
      $(item).attr(attr, newValues[$(item).attr(attr)]);
    });
  });
  return $.html();
};
