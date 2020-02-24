/******** Library Class Information **********
 *
 * Description: Helper Functions
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

/** system helper functions */
class LibSysUtils {
  /**
   * Return string with quotes
   * @param str the string you want to add quotes
   * @param singleQuote use single quote or double quote
   * @returns a string with quotes
   */
  public static getQuoteString(
    str: string,
    singleQuote: boolean = true
  ): string {
    return singleQuote ? `'${str}'` : `"${str}"`;
  }

  /**
   * To merge strings
   * @param symbol the connecting symbol (eg. "and")
   * @param mergeEmpty whether merge with empty string or null
   * @param strs some strings you want to merge
   * @returns a merged string
   */
  public static mergeString(
    symbol: string,
    mergeEmpty: boolean,
    ...strs: string[]
  ): string {
    let returnStr: string = '';
    strs.forEach((str, index) => {
      if (mergeEmpty || (!mergeEmpty && str)) {
        if (returnStr && index !== strs.length - 1) {
          returnStr.concat(` ${symbol}`);
        }
        returnStr.concat(` ${str}`);
      }
    });
    return returnStr;
  }
}

export default LibSysUtils;
