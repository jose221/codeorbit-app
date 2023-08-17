export class ToastipAlert {
  static showToast(message: string) {
    const toastContainer = document.querySelector("body");
    console.log(toastContainer)
    const toastElement = document.createElement('div');
    toastElement.classList.add('toastip');
    toastElement.textContent = message;

    if(toastContainer){
      toastContainer.appendChild(toastElement);

      setTimeout(function() {
        toastElement.remove();
      }, 5000);
    }
  }
}
