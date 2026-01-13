/*
  Base Class Misc() - Enables all classes to use the elementExists function.
*/
class Base {
  /**
   * @desc Checks if element exists before running element specific code.
   * @param string function
   * @return function | null
   */
  elementExists(element, callback, selectionType = 'single') {
    let selection;
    if (selectionType == 'single') {
      selection = document.querySelector(element);
    } else if (selectionType == 'all') {
      selection = document.querySelectorAll(element);
    } else {
      selection = null;
    }
    if (selection && selectionType === 'single'
        || selection && selectionType === 'all' && selection.length >= 1
    ) {
      return callback(selection);
    } else {
      return null;
    }
  }

  /**
   * Determine the screen size currently in use
   *
   * @return {string}
   */
  getScreenSize() {
    const screenSize = window.innerWidth;

    if (screenSize <= 768) {
      return 'mobile';
    } else if (screenSize <= 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
}

export default Base;
