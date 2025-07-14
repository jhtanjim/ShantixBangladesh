export const Swal = {
  fire: (options) => {
    if (options.title === "Are you sure?") {
      return Promise.resolve({ isConfirmed: window.confirm(options.text) });
    }
    if (options.icon === "success") {
      const toastDiv = document.createElement("div");
      toastDiv.className =
        "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg bg-green-500 text-white shadow-lg transition-all duration-300";
      toastDiv.textContent = options.title;
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
      return Promise.resolve();
    }
    if (options.icon === "error") {
      const toastDiv = document.createElement("div");
      toastDiv.className =
        "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg bg-red-500 text-white shadow-lg transition-all duration-300";
      toastDiv.textContent = options.title;
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 3000);
      return Promise.resolve();
    }
    return Promise.resolve({ isConfirmed: true });
  },
};

export default Swal;
