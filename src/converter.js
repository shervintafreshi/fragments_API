const markdownIt = require('markdown-it')({ html: true });
const sharp = require('sharp');
const { markdownToTxt } = require('markdown-to-txt');
const { convert } = require('html-to-text');


// Handle fragment data conversion
async function convertFragment(content, contentType, conversionType) {
  let convertedData = null;
  switch(contentType) {
    case 'text/html':
      convertedData = convertHtml(content);
      break;
    case 'text/markdown':
      convertedData = convertMarkdown(content, conversionType);
      break;
    case 'application/json':
      convertedData = convertJson(content);
      break;
    case 'image/png':
    case 'image/jpeg':
    case 'image/webp':
    case 'image/gif':
      convertedData = await convertImage(content, conversionType);
      break;
    default:
      convertedData = content;
  }
  return convertedData;
}

// json conversion
function convertJson(jsonObject){
  return JSON.stringify(jsonObject);
}

// markdown conversion
function convertMarkdown(content, conversionType){
  let convertedData = null;
  if (conversionType == 'text/html')
    convertedData = markdownIt.render(content.toString()).trim();
  else if (conversionType == 'text/plain')
    convertedData = markdownToTxt(content.toString());
  return convertedData;
}

// html conversion
function convertHtml(content) {
  return convert(content.toString());
}

// image conversion
async function convertImage(content, conversionType){
  let convertedImage = null;
  if (conversionType == 'image/png')
    convertedImage = await sharp(content).toFormat('png').toBuffer();
  else if (conversionType == 'image/jpeg')
    convertedImage = await sharp(content).toFormat('jpeg').toBuffer();
  else if (conversionType == 'image/webp')
    convertedImage = await sharp(content).toFormat('webp').toBuffer();
  else if (conversionType == 'image/gif')
    convertedImage = await sharp(content).toFormat('gif').toBuffer();
  return convertedImage;
}

module.exports.convertFragment = convertFragment;
