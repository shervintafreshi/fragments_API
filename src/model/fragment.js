// Parse/create content-type headers
const contentType = require('content-type');
const { nanoid } = require('nanoid');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data/memory');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (typeof ownerId === 'undefined' || typeof type === 'undefined') {
      throw new Error('OwnerId and Type must be defined');
    }

    if (typeof size !== 'number') {
      throw new Error('size must be a number');
    } else if (size < 0) {
      throw new Error('size must be greater than 0');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('type is not supported');
    }

    if (typeof created === 'undefined' || typeof updated === 'undefined') {
      const isoDate = new Date();
      this.created = isoDate;
      this.updated = isoDate;
    } else {
      this.created = created;
      this.updated = updated;
    }

    if (typeof id === 'undefined') {
      this.id = nanoid();
    } else {
      this.id = id;
    }

    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const result = await readFragment(ownerId, id);
    if (typeof result === 'undefined') {
      return Promise.reject(new Error());
    }
    return result;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    const isoDate = new Date();
    const currentFragment = new Fragment({
      id: this.id,
      ownerId: this.ownerId,
      created: this.created,
      updated: isoDate,
      type: this.type,
      size: this.size,
    });

    return writeFragment(currentFragment);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (typeof data === 'undefined') {
      throw new Error('Data provided must be of type Buffer');
    }
    logger.info('----------------------------------------------');
    logger.info('SAVING FRAGMENT DATA IN SETDATA() - Fragment.js');
    logger.info('----------------------------------------------');

    // update the size property based on the buffer size
    this.size = Buffer.byteLength(data);
    // save the updated fragment size
    this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const result = this.type.substring(0, 5) == 'text/';
    return result;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let conversionTypes = [];
    // Currently supporting the text/plain data mime-type
    if (this.type == 'text/plain' || this.type == 'text/plain; charset=utf-8') {
      conversionTypes.push('text/plain');
    } else if (this.type == 'text/markdown') {
      conversionTypes.push('text/html');
    }

    return conversionTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // Define support types
    const supportedTypes = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json',
    ];
    return supportedTypes.includes(value);
  }
}

module.exports = Fragment;
