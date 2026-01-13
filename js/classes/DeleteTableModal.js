import Base from "./Base.js";

class DeleteTableModal extends Base {
  /**
   * @param {nodes} deleteButtons - The table delete buttons.
   */
  deleteButtons;

  /**
   * @param {node} modal - The delete table modal.
   */
  modal;

  /**
   * @param {node} deleteForm - The form for the delete button.
   */
  deleteForm;

  /**
   * @param {node} bodyText - The form for the delete button.
   */
  bodyText;

  constructor() {
    super();
  }

  /**
   * Set up the modal
   *
   * @param {nodes} deleteButtons
   */
  setUpModal = (deleteButtons) => {
    this.deleteButtons = deleteButtons;
    this.modal = document.querySelector("#delete-table-modal");
    this.deleteForm = this.modal.querySelector("#delete-table-form");
    this.bodyText = this.modal.querySelector(".modal-body");

    this.deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", this.handleOpenModal);
    });

    const options = {
      attributes: true,
    };

    // Mutation observer listens for the class changing on the modal
    // specifically when the modal is closed in this instance to remove
    // data added the modal when it is opened.
    const observer = new MutationObserver(this.handleCloseModal);
    observer.observe(this.modal, options);
  };

  /**
   * Handle the opening of the modal
   *
   * @param {Event} e
   */
  handleOpenModal = (e) => {
    const tableId = e.target.attributes["data-table-id"]?.value ?? null;
    if (!!tableId) {
      this.bodyText.innerText = `Are you sure you want to delete table ${tableId}?`;
      this.deleteForm.action = `/tables/${tableId}/delete`;
    }
  };

  /**
   * Handle the closing of the modal
   *
   * @param {Array} mutationList
   * @param {observer} observer
   */
  handleCloseModal = (mutationList, observer) => {
    // The mutations passed from the mutation observer
    // In particular looking for a class attribute change
    mutationList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        // If 'show' not in class list then it's been closed
        const classList = mutation?.target?.classList ?? [];
        if (!classList.contains("show")) {
          this.bodyText.innerText = "No table has been selected.";
          this.deleteForm.action = "";
        }
      }
    });
  };

  /**
   * Called to run the class from main.js
   */
  run = () => {
    this.elementExists(".delete-table-btn", this.setUpModal, "all");
  };
}

export default DeleteTableModal;
