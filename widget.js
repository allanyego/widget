document.addEventListener("DOMContentLoaded", () => {
  setupWidget();
  // An example handler
  const handler1 = fancyWidget.addHandler((values) => console.log(values));
});

function setupWidget() {
  setupDOMElements();
  window.fancyWidget = {
    HIDDEN_CLASS: "is-hidden",
    DANGER_CLASS: "is-danger",
    submissionHandlers: [],
    addHandler(handler) {
      this.submissionHandlers.push(handler);

      return () => {
        this.submissionHandlers = this.submissionHandlers.filter(
          (h) => h !== handler
        );
      };
    },
  };

  el("#widget-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const toggleFormBtn = el("#toggle-btn");
  toggleFormBtn.addEventListener("click", () => {
    if (toggleFormBtn.classList.contains(fancyWidget.DANGER_CLASS)) {
      toggleFormBtn.innerText = "Chat";
      toggleFormBtn.classList.remove(fancyWidget.DANGER_CLASS);
    } else {
      toggleFormBtn.innerText = "Close";
      toggleFormBtn.classList.add(fancyWidget.DANGER_CLASS);
    }

    toggleElement("widget-form");
  });

  const submitBtn = el("#submit-btn");
  submitBtn.addEventListener("click", () => {
    const phone = el("#phone");
    const message = el("#message");

    fancyWidget.submissionHandlers.map((handler) => {
      try {
        handler({
          phone: phone.value.trim(),
          message: message.value.trim(),
        });
      } catch (error) {
        console.error(error);
      }
    });

    // Reset form values
    phone.value = message.value = "";
  });
}

function toggleElement(elementId) {
  const form = el(`#${elementId}`);

  const hiddenClass = fancyWidget.HIDDEN_CLASS;
  form.classList.contains(hiddenClass)
    ? form.classList.remove(hiddenClass)
    : form.classList.add(hiddenClass);
}

function el(selector) {
  return document.querySelector(selector);
}

function setupDOMElements() {
  const formContainer = createElement("div", {
    class: "form-container",
  });

  const card = createElement("div", {
    class: "card",
  });
  formContainer.append(card);

  const cardContent = createElement("div", {
    class: "card-content",
  });
  card.append(cardContent);

  const formEl = createElement("form", {
    class: "d-flex flex-column is-hidden",
    id: "widget-form",
  });

  const phoneInput = createInputComponent(
    createElement("input", {
      class: "input",
      type: "text",
      id: "phone",
      placeholder: "Phone",
    }),
    "Phone"
  );
  formEl.append(phoneInput);

  const messageInput = createInputComponent(
    createElement("textarea", {
      class: "textarea",
      id: "message",
      placeholder: "Message",
    }),
    "Message"
  );
  formEl.append(messageInput);

  cardContent.append(formEl);

  const toggleBtnContainer = createElement("div", {
    class: "d-flex justify-center",
  });
  const toggleBtn = createElement("button", {
    class: "button is-small",
    id: "toggle-btn",
  });
  toggleBtn.innerText = "Chat";
  toggleBtnContainer.append(toggleBtn);
  cardContent.append(toggleBtnContainer);

  const submitBtnContainer = createElement("div", {
    class: "d-flex justify-end",
  });
  const submitBtn = createElement("button", {
    class: "button is-small",
    id: "submit-btn",
  });
  submitBtn.innerText = "Send";
  submitBtnContainer.append(submitBtn);
  formEl.append(submitBtnContainer);

  el("body").prepend(formContainer);
}

function createInputComponent(inputEl, labelText) {
  const field = createElement("div", {
    class: "field",
  });

  const label = createElement("label", {
    class: "label",
    for: inputEl.id,
  });
  label.innerText = labelText;

  const control = createElement("div", {
    class: "control",
  });
  control.append(inputEl);

  field.append(label);
  field.append(control);

  return field;
}

function createElement(tagName, attributes = {}) {
  const el = document.createElement(tagName);
  Object.keys(attributes).map((key) => {
    el.setAttribute(key, attributes[key]);
  });

  return el;
}
