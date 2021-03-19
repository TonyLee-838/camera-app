const tryCatch = (fn) => {
  return () => {
    try {
      return fn();
    } catch (error) {
      console.error(error);
    }
  };
};

export default tryCatch;
