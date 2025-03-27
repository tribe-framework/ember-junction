import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import pako from 'pako';

export default class GzipService extends Service {
  @tracked lastCompressedData = null;
  @tracked lastError = null;

  /**
   * Compresses and encodes a CSV string using native compression
   * @param {string} csvString - The CSV string to compress
   * @returns {Promise<string>} Base64 encoded compressed string
   */
  async compressAndEncode(csvString) {
    try {
      this.lastError = null;
      const compressed = pako.gzip(csvString);
      const base64String = btoa(String.fromCharCode.apply(null, compressed));
      this.lastCompressedData = base64String;
      return base64String;
    } catch (error) {
      this.lastError = error;
      throw new Error(`Pako compression failed: ${error.message}`);
    }
  }

  /**
   * Decodes and decompresses a base64 encoded compressed string
   * @param {string} base64String - The compressed string to decompress
   * @returns {Promise<string>} Original CSV string
   */
  async decodeAndDecompress(base64String) {
    try {
      this.lastError = null;
      const binary = atob(base64String);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return pako.ungzip(bytes, { to: 'string' });
    } catch (error) {
      this.lastError = error;
      throw new Error(`Pako decompression failed: ${error.message}`);
    }
  }
}
