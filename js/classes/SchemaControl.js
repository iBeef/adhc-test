import Base from "./Base.js";

class SchemaControl extends Base {
  /**
   * @param {node} deleteButtons - The schema delete buttons.
   */
  schemaForm;

  /**
   * @param {nodes} columns - The schema columns in the form.
   */
  columns = [];

  /**
   * @param {node} cardWrapper - The div that wraps the cards.
   */
  cardWrapper;

  /**
   * @param {node} addColBtn - The button used for adding more columns
   */
  addColBtn;

  constructor() {
    super();
  }

  /**
   * Set up the form when the class is initiated
   *
   * @param {Node} schemaForm
   */
  setUpForm = (schemaForm) => {
    this.schemaForm = schemaForm;
    this.getColumns();
    this.cardWrapper = this.schemaForm.querySelector("#card-wrapper");
    this.addColBtn = this.schemaForm.querySelector("#add-col-btn");
    this.addColBtn.addEventListener("click", this.handleAddCol);
    const deleteButtons = this.schemaForm.querySelectorAll(".del-btn");
    // Add the delete col button click event listener for any generated columns
    deleteButtons.forEach((delBtn) =>
      delBtn.addEventListener("click", this.handleDeleteCol)
    );
  };

  /**
   * Get the most up to date columns of the form.
   */
  getColumns = () => {
    this.columns = this.schemaForm.querySelectorAll(".card[data-col-no]");
  };

  /**
   *
   * @returns
   */
  toggleFirstDelBtn = () => {
    if (this.columns.length < 1) {
      console.log("no buttons");
      return;
    }

    const firstCol = this.columns[0];
    const firstColDelBtn = firstCol.querySelector(".del-btn-wrapper");

    if (this.columns.length > 1) {
      console.log("showing btn");
      firstColDelBtn.classList.remove("d-none");
    } else {
      console.log("hiding btn");
      firstColDelBtn.classList.add("d-none");
    }
  };

  /**
   * Re-sort the columns after one has been deleted to keep
   * accurate numbering
   *
   * @param {string} deletedCol
   */
  columnSort = (deletedCol) => {
    const deletedColNo = parseInt(deletedCol);
    this.getColumns();
    this.columns.forEach((col) => {
      let currentColNo = col.getAttribute("data-col-no");
      currentColNo = parseInt(currentColNo);
      if (currentColNo > deletedColNo) {
        const newColNo = currentColNo - 1;
        let delBtn = col.querySelector(".del-btn");
        // Remove the click event listener from the button as it will be "lost" when the html is replaced
        // To prevent any potential memory leaks
        delBtn.removeEventListener("click", this.handleDeleteCol);
        this.applyValues(col);
        const colHtml = col.getHTML();
        // console.log(colHtml);
        // Update the HTML
        const newColHtml = colHtml.replaceAll(
          `columns[${currentColNo}]`,
          `columns[${newColNo}]`
        );

        // console.log(newColHtml);
        // Set the new HTML
        col.innerHTML = newColHtml;
        col.setAttribute("data-col-no", newColNo);
        delBtn = col.querySelector(".del-btn");
        // Re-add the event listener for the delete click based on the new index
        delBtn.addEventListener("click", this.handleDeleteCol);
        delBtn.setAttribute("data-col-no", newColNo);
        const colTitle = col.querySelector(".card-title");
        colTitle.innerText = `Column ${newColNo}`;
      }
    });
  };

  /**
   * Handle the add column functionality
   *
   * @param {Event} e
   */
  handleAddCol = (e) => {
    e.preventDefault();
    const newColNo = this.columns.length + 1;
    // Clone a delete col node (Easy way to get a copy)
    const newColNode = this.columns[0].cloneNode(true);
    const colHtml = newColNode.innerHTML;
    // Update the html for new col index
    let newColHtml = colHtml.replaceAll("columns[1]", `columns[${newColNo}]`);
    newColHtml = newColHtml.replaceAll("checked", "");
    newColNode.innerHTML = newColHtml;
    newColNode.setAttribute("data-col-no", newColNo);
    const colTitle = newColNode.querySelector(".card-title");
    const delBtnWrapper = newColNode.querySelector(".del-btn-wrapper");
    // The first column has a hidden delete button, any added column needs to show.
    delBtnWrapper.classList.remove("d-none");
    const delBtn = newColNode.querySelector(".del-btn");
    delBtn.setAttribute("data-col-no", newColNo);
    // Set the delete click event listener
    delBtn.addEventListener("click", this.handleDeleteCol);
    colTitle.innerText = `Column ${newColNo}`;
    // Remove the input errors that may have come across
    this.resetCol(newColNode);
    // Add the new column to the DOM and update the column list
    this.cardWrapper.appendChild(newColNode);
    this.getColumns();
    this.toggleFirstDelBtn();
  };

  /**
   * Handles the delete column functionality
   * @param {Event} e
   * @returns {null}
   */
  handleDeleteCol = (e) => {
    e.preventDefault();
    const targetColNo = e.target.getAttribute("data-col-no");
    if (!targetColNo) {
      return;
    }

    const delTarget = this.schemaForm.querySelector(
      `.card[data-col-no="${targetColNo}"]`
    );
    delTarget.remove();
    this.columnSort(targetColNo);
    this.toggleFirstDelBtn();
  };

  /**
   * Reset a columns input values
   *
   * @param {Node} col
   */
  resetCol = (col) => {
    const inputs = col.querySelectorAll("input");
    const select = col.querySelector("select");
    inputs.forEach((input) => input.setAttribute("value", ""));
    select.setAttribute("value", "string");
    const options = select.querySelectorAll("option");
    options.forEach((option) => {
      if (option.value == "string") {
        option.setAttribute("selected", true);
      } else {
        option.removeAttribute("selected");
      }
    });
  };

  /**
   * Applies a columns input values and status
   * (A bug occurs because we're re-writing the html which clears the values)
   * (This is unorthodox but fixes it.)
   *
   * @param {Node} col
   */
  applyValues = (col) => {
    const inputs = col.querySelectorAll("input");
    const select = col.querySelector("select");
    inputs.forEach((input) => {
      if (input.type == "checkbox" && input.checked) {
        input.setAttribute("checked", true);
        input.setAttribute("value", true);
      } else {
        input.setAttribute("value", input.value);
      }
    });

    // Only one select value present
    console.log("select");
    select.setAttribute("value", select.value);
    const options = select.querySelectorAll("option");
    options.forEach((option) => {
      if (option.value == select.value) {
        option.setAttribute("selected", true);
      } else {
        option.removeAttribute("selected");
      }
    });
  };

  /**
   * Called to run the class from main.js
   */
  run = () => {
    this.elementExists("#schema-form", this.setUpForm);
  };
}

export default SchemaControl;
