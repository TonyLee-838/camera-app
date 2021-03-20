const tryCatch = (fn) => {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      console.error(error);
    }
  };
};

export default tryCatch;
