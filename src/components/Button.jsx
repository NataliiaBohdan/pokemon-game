function Button({ onClick, children }) {
  return (
    <button className="primary-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
