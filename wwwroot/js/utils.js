
// LISTENER INITIALIZATION
export function initInputListener() {
    document.addEventListener("input", function (e) {
        let input = e.target;
        let inputType = checkInputType(e.target);
        let inputValue = input.value;

        switch (inputType) {
            case "amount":
                input.value = amountInputFormatToHundreds(inputValue);
                break;
            
            case "phone":
                input.value = phoneNumberInputFormat(inputValue);
                break;
                
            case "tin":
                input.value = tinInputFormat(inputValue);
                break;

            default:
                debug("Input Listener", "No input type");
        }
    });
}

export function initCloseModalListener() {
    document.addEventListener("click", function (e) {
        const parentModal = document.querySelector(".modal");
        const parentModalStatus = parentModal.dataset.status;

        if (parentModalStatus === "active") {     
            const isClosedBtn = e.target.closest(".close-icon") || e.target.closest(".cancel");
            const isOutsideClick = e.target === parentModal;

            if (isClosedBtn || isOutsideClick) {
                parentModal.dataset.status = "inactive";  
                const form = document.querySelectorAll("form"); // REFACTOR add data action for form activity check which is active
                
                if (!checkPage("reports")) { 

                    clearAllForm(form);
                    closeCloseableModal(parentModal);
                }

                form.forEach(f => {
                    clearAllErrorInputFields(selectAllInputFields(f));
                });

                hideModalForms(form);
                closeCloseableModal(parentModal);
            }
        } 
    });
}

// CHECK FUNCTIONS
function checkInputType(input) { 
    const type = input.dataset.input;

    switch (type) {
        case "amount":
            return type;
        case "phone":
            return type;
        case "tin":
            return type;
        default:
            debug("Check Input Type", "No input");
    }
}   

function checkPage(page) {
    if (page === document.body.dataset.page) {
        return true;
    } else {
        return false;
    }
}


// INPUT FORMAT
export function tinInputFormat(value) {
    value = textInputFormatToNumber(value);

    if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    }

    return value;
}

export function amountInputFormatToHundreds(value) {
    value = textInputFormatToNumber(value);

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function phoneNumberInputFormat(value) {
    value = textInputFormatToNumber(value);

    // e.g. 09 394 2444
    if (value.length > 2 && value.length <= 5)
        return value.replace(/(\d{2})(\d+)/, "$1 $2");

    if (value.length > 5)
        return value.replace(/(\d{2})(\d{3})(\d+)/, "$1 $2 $3");

    return value;
}

function textInputFormatToNumber(value) {
   return String(value).replace(/\D/g, '');
}

export function limitInputLength(input, length) {
    input = input.value.trim();

    if (input.length === length) {
        return true;
    } else {
        return false;
    }
}


// INPUT VALIDATIONS

// REFACTOR Rename for clarity
export function displayErrorInputTag(inputCon, message) {
    const phoneCon = document.querySelector(".phone-con");
    inputCon.querySelectorAll(".error-tag").forEach(e => e.remove());
    inputCon.appendChild(displayErrorTagMessage(message));
}

function displayErrorTagMessage(message) {
    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("error-tag");
    return p;
}

export function clearErrorInputTag(form) {
    form.querySelectorAll(".error-tag").forEach(e => e.remove());
} 

export async function validateEmail(email) {
    const res = await fetch("/Account/CheckEmailExists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Email: email
        })
    });

    const data = await res.json();

    return data.signedIn;
}

export function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.length === 0));
}

export function errorInput(id) {
    id.classList.add("error-input");
}

export function passwordStrength(value) {
    const strength = (value / 4) * 100;
    return strength;
}

// REFACTOR rename for clarity, it does two things add a class `error-input` when it does not
// contain anyhting vice vera. Misleading function name
export function validateInputFieldsValue(form) {
    const formInput = selectAllInputFields(form);

    formInput.forEach(i => {
        if (!i.value.trim()) {
            i.classList.add("error-input");
        } else {
            i.classList.remove("error-input");
        }
    });
}

export function inputEmptyValidation(form) {
    const formInput = selectAllInputFields(form);

    const inputFields = Array.from(formInput);

    const allFilled = inputFields.every(i => {
        if (i.classList.contains("middleName")) return true;
        return i.value.trim().length > 0;
    });

    return allFilled;
}

export function selectAllInputFields(form) {
    const inputFields = form.querySelectorAll("input, select, textarea");

    inputFields.forEach(input => {
        console.log(input.name, "=>", input.value);
    });

    return inputFields;
}


export function clearErrorInputFields(form) { // REFACTOR remove this
    const inputFields = form;

    inputFields.forEach(i => {
        if (!i.value.trim()) {
            i.classList.add("error-input");
        } else {
            i.classList.remove("error-input");
        }
    });
}

export function clearAllErrorInputFields(form) { // REFACTOR remove this
    const inputFields = form;

    inputFields.forEach(i => {
        i.classList.remove("error-input");
    });
}

export function showError(message) { // REFACTOR remove this
    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("error-tag");
    return p;
}


function hideModalForms(forms) {
    forms.forEach(f => f.classList.remove("show", "active"));
}

export function clearAndCloseModal(form, modal) {
    validateInputFieldsValue(form);
    clearForm(form);
    clearAllErrorInputFields(selectAllInputFields(form));
    closeModal(modal);
}

export function populateForm(form, data, fields) {
    fields.forEach(key => {
        const radios = form.querySelectorAll(`input[name="${key}"]`);
        if (radios.length > 1 && radios[0].type === "radio") {
            radios.forEach(radio => {
                radio.checked = (radio.value === data[key]);
            });
            return;
        }

        const input = form.elements.namedItem(key);
        if (!input) utils.debug("Get Input", "No input");

        if (key === "amount" && data[key] != null) {
            input.value = amountInputFormatToHundreds(Number(data[key]).toLocaleString());
        }
        else if (key === "due" && data[key] != null) {
            input.value = toYYYYMMDD(data[key]); 
        }
        else {
            input.value = data[key] ?? "";
        }
    });
}

function toYYYYMMDD(dateInput = new Date()) {
    const date = new Date(dateInput);
    if (isNaN(date)) return null;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

export async function searchLiabilities(query, dropdown, input, form) {
    try {
        const res = await fetch("/Member/Home/SearchLiabilities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        const data = await res.json();

        debug("Search Liabilities data", data);
        renderDropdown(dropdown, data, input, form);

    } catch (err) {
        console.error(err);
    }
}

export function renderDropdown(dropdown, data, input, form) {
    dropdown.innerHTML = "";
    dropdown.classList.add("show");

    if (!data.length) return;

    const inputFields = ["due", "name", "debt", "balance", "type"];
    data.forEach(l => {
        const li = document.createElement("li");
        li.textContent = l.name;
        li.dataset.id = l.id;

        li.addEventListener("click", function () {
            input.value = l.name;
            input.dataset.id = l.id;

            populateForm(form, l, inputFields);

            dropdown.classList.remove("show");
        });

        dropdown.appendChild(li);
    })
}

export function getModalForm(modal) {
    return modal.querySelector(".active");
}

export function getFormData(form = null) {
    form = form || document.querySelector(".modal-entity-form.active");
    const rawData = Object.fromEntries(new FormData(form).entries());
    const formData = normalizeFormData(rawData);

    debug("Get Form Data", formData);

    return formData;
}

function normalizeFormData(data) {
    delete data.phoneAreaCode; // Temporarily removes phone area code, as it is not included in the database schema (Fix this) 

    return {
        ...data, // keep data

        id: data.id
            ? Number(data.id)
            : null,

        investment: data.investment
            ? Number(data.investment.replace(/,/g, ""))
            : null,

        tin: data.tin
            ? Number(data.tin.replace(/-/g, ""))
            : null,

        amount: data.amount
            ? Number(data.amount.replace(/,/g, ""))
            : null,

        debt: data.debt
            ? Number(data.debt.replace(/,/g, ""))
            : null,

        due: data.due
            ? new Date(data.due).toISOString()
            : null,

        paid: data.paid
            ? Number(data.paid.replace(/,/g, ""))
            : null
        };
}

export function closeCloseableModal(modal) {
    modal.classList.remove("show");
    modal.querySelectorAll(".closeable-modal").forEach(m => {
        m.classList.remove("show");
    });
}

export function closeModal(modal) {
    modal.classList.remove("show");
    
    modal.querySelectorAll(".modal-content").forEach(m => {
        m.classList.remove("show");
    });

    modal.querySelectorAll(".modal-entity-form").forEach(f => {
        f.classList.remove("show", "active");
    });
}

export function showParentModal(modal) {
    modal.classList.add("show");
    modal.dataset.status = "active";
}

export function hideParentModal(modal) {
    modal.classList.remove("show");
    modal.dataset.status = "inactive";
}

export function pageRefresh() {
    window.location.reload(true);
}

export function debug(type, description) {
    console.log(type,": ", description);
}

export function clearAllForm(formId) {
    formId.forEach(f => f.reset());   
}

export function clearForm(formId) {
    formId.reset();   
}

export function setDateToday(dateInput) {
    let date = new Date();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + month + "-" + day;

    dateInput.value = today;
}

export function isDueLiability(date) {
    const [y, m, d] = date.split("T")[0].split("-").map(Number);

    const input = new Date(y, m - 1, d);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return input >= today;
}

export function dateFormat(date) {
    const format = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });

    return format;
}

export function formatEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}



export function togglePasswordVisibility(input, icon) {
    const con = icon.closest(".password-input");

    const seeIcon = con.querySelector(".see-eye");
    const unseeIcon = con.querySelector(".unsee-eye");

    if (input.type === "password") {
        input.type = "text";

        seeIcon.classList.remove("see");
        unseeIcon.classList.add("see");
    } else {
        input.type = "password";

        seeIcon.classList.add("see");
        unseeIcon.classList.remove("see");
    }
}


export function removeUserSession() {
    window.addEventListener("pageshow", function (event) {
        debug("Check", "Remove use session");
        fetch("/Member/Home/Logout", { method: "POST" })
        .then(() => {
            window.location.href = "/Public/Account/LogIn?error=accessdenied";
        });
    });
}

export async function RemoveForgotPassSession() {
    try {
        const res = await fetch("/Public/Account/RemoveForgotPassSession");
        const data = await res.json();

        debug("Session", data.message);
        return data.message;
    } catch (err) {
        return debug("Error", err);
    }
}

export async function logout() {
    await fetch("/Member/Home/Logout", {
        method: "POST"
    });

    window.location.replace("/Public/Account/LogIn"); // FIX THIS, CLIENTS MUST NOT CLICK BACK button and get to see the /member
}