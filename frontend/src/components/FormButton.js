function FormButton({children, onClick}) {
    return (              <button
        class="frm-ctrl button-style small-button"
        type="button"
        onClick={onClick}
      >
        {children}
      </button>)
}

export default FormButton;