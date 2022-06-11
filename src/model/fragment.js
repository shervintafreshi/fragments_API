// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Use https://www.npmjs.com/package/nanoid to create unique IDs
// const { nanoid } = require('nanoid');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
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
    listFragments(ownerId, expand)
      .then((data) => {
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    readFragment(ownerId, id)
      .then((data) => {
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    deleteFragment(ownerId, id)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    const currentFragment = new Fragment(
      this.id,
      this.ownerId,
      this.created,
      this.updated,
      this.type,
      this.size
    );

    writeFragment(currentFragment)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    readFragmentData(this.ownerId, this.id)
      .then((data) => {
        return Promise.resolve(data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    writeFragmentData(this.ownerId, this.id, data)
      .then(() => {
        return Promise.resolve();
      })
      .then((error) => {
        return Promise.reject(error);
      });
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
    return this.type.substring(0, 5) == 'text/';
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let conversionTypes = [];
    // Currently supporting the text/plain data mime-type
    if (this.type == 'text/plain') {
      conversionTypes.push('.txt');
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
    const supportedTypes = ['text/plain', 'text/plain: charset=utf-8'];
    return supportedTypes.includes(value);
  }
}

module.exports.Fragment = Fragment;
