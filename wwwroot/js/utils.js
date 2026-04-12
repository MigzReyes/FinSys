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

                debug("form", form);
                clearForm(form);
                closeModal(parentModal);
            }
        } 
    });
}


export function closeModal(modal) {
    modal.classList.remove("show");
    modal.querySelectorAll(".closeable-modal").forEach(m => {
        m.classList.remove("show");
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

export function clearForm(formId) {
    formId.forEach(f => f.reset());   
}

export function setDateToday(dateInput) {
    let date = new Date();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let today = date.getFullYear() + "-" + month + "-" + day;

    dateInput.value = today;
}

export function formatNumber(value) {
    value = String(value);
    value = value.replace(/\D/g, '');

    if (value.length > 2 && value.length <= 5)
        return value.replace(/(\d{2})(\d+)/, "$1 $2");

    if (value.length > 5)
        return value.replace(/(\d{2})(\d{3})(\d+)/, "$1 $2 $3");

    return value;
}

export function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.length === 0));
}

export function errorInput(id) {
    id.classList.add("error-input");
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

export function formatEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}


// REFACTOR Rename for clarity
export function showError(message) {
    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("error-tag");
    return p;
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

export function passwordStrength(value) {
    const strength = (value / 4) * 100;
    return strength;
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

export function clearErrorInputFields(form) {
    const inputFields = form;

    inputFields.forEach(i => {
        if (!i.value.trim()) {
            i.classList.add("error-input");
        } else {
            i.classList.remove("error-input");
        }
    });
}

export function inputEmptyValidation(form) {
    const inputFields = Array.from(form);

    const allFilled = inputFields.every(i => {
        if (i.id === "middleName") return true;
        return i.value.trim().length > 0;
    });

    return allFilled;
}

export function selectAllInputFields(form) {
    const inputFields = form.querySelectorAll("input, select, textarea");

    return inputFields;
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