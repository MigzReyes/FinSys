export function pageRefresh() {
    window.location.reload(true);
}

export function debug(type, description) {
    console.log(type,": ", description);
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