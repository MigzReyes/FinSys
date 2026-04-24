import * as utils from "./utils.js";

// GLOBAL ID / VAR
const companyNameNav = document.getElementById("companyNameNav");
const companyIndustryNav = document.getElementById("companyIndustryNav");

const modal = document.getElementById("modal");
const modalContent = document.querySelectorAll(".modal-content");
const businessRegistrationModal = document.getElementById("businessRegistrationModal");
const modalEntity  = document.getElementById("modalEntity"); // REFACTOR
const editTransactionModal = document.getElementById("editTransactionModal"); // REFACTOR
const alertModal = document.getElementById("alertModal");
let form = "";

// MEDIA QUERY
const navOverlayQuery = window.matchMedia('(max-width: 1000px)');

// NAV
//let navListCon = document.getElementById("navListCon"); // UNCOMMENT MO PAG NAG SPA / AJAX NAVIGATION KANA
let openNavVar = document.getElementById("openNav");
let closeNavVar = document.getElementById("closeNav");

// ICONS
const logOutIconModal = document.getElementById("logOutIconModal");

// TEXTS
const alertHead = document.getElementById("alertHead");
const alertSubhead = document.getElementById("alertSubhead");
const alertBtnText = document.getElementById("alertBtnText");

const modalEntityText = document.querySelectorAll(".modal-entity-text"); // REFACTOR

// BUTTONS
const modalBodyButtonConAlert = document.querySelector(".modal-body-button-con-alert");
const modalEntityBtn = document.querySelector(".modal-entity-btn"); // REFACTOR

const alertBtn = document.getElementById("alertBtn");
const cancel = document.querySelectorAll(".cancel");

const cancelBusinessRegistration = document.getElementById("cancelBusinessRegistration"); // REFACTOR

const closeIcon = document.querySelectorAll(".close-icon");

// NAV OVERLAY
navOverlayChange(navOverlayQuery); // IT RUNS THIS EVERYTIME YOU REFRESH
navOverlayQuery.addEventListener("change", navOverlayChange); // LISTENER WATCH FOR CHANGES PARA FLEXIBLE

// NAV LIST ACTIVE HANDLER
// This handles nav list active effect, if ever man na magawa kong dynamic SPA style tong website ito gamitin mo 
/* navListCon.addEventListener("click", function (e) {
    e.target.classList.add("active-nav-item");
}); */


// DISPLAY COMPANY NAME AND INDUSTRY
displayCompanyInfo();

// ALERT MODAL BUTTON DATA ATTRIBUTE HANDLER
// RENAME THIS FOR CLARITY
// `alertBtn` is the primary button for the primary pop up  
alertBtn.addEventListener("click", function () {
    const action = this.dataset.action;
    utils.debug("Button action check", action); // utils.debugGER

    switch (action) {
        case "clearForm": 
            utils.clearForm(form);
            utils.closeModal(modal);
            break;
        case "removeEmployee":
            // create a function that sends a req to the controller with js fetch 
            utils.closeModal(modal);
            break;
        case "removeTransaction":
            utils.closeModal(modal);
            break;
        case "logout": 
            utils.closeModal(modal);
            utils.logout();
            break;
        case "removeAsset": 
            utils.closeModal(modal);
            break;

        case "removeLiability": 
            utils.closeModal(modal);
            break;

        default:
            utils.debug("Action", "No action data attribute received");
            break;
    }
});

let modalEntityBtnAction; // REFACTOR this variable is used to determine the functionality of the modal entity primary button 
utils.initInputListener();
utils.initCloseModalListener(); 

// PAGINATION
const paginationState = {
    Assets: {
        current: 1,
        total: 1
    },

    Liabilities: {
        current: 1,
        total: 1
    }
};

// PAGE BASED INITIALIZATION PATTERN **Para confined yung js code for each page
const PageScripts = {
    dashboard: function() {
        utils.debug("Page", "Dashboard");

        // LOCAL VARIABLE
        let companyRegistration = document.getElementById("companyRegistration");
        let companyName = document.getElementById("companyName");
        let companyIndustry = document.getElementById("companyIndustry");
        let companyCountry = document.getElementById("companyCountry");
        let companyEmployees = companyRegistration.elements["employees"].value;

        let income = document.getElementById("income");
        let expense = document.getElementById("expense");
        let netProfit = document.getElementById("netProfit");
        let expenseStatement = document.getElementById("expenseStatement");
        let netProfitStatement = document.getElementById("netProfitStatement");

         // DISPLAY CLIENT INFO
        fetch("/Member/Home/IsClientPayed")
            .then(res => res.json())
            .then(client => {
                utils.debug("Is payed", client.isPayed);

                if (client.isPayed) {
                    modal.classList.remove("show");
                    businessRegistrationModal.classList.remove("show");
                } else {
                    modal.classList.add("show");
                    businessRegistrationModal.classList.add("show");

                    // CANCEL
                    cancelBusinessRegistration.addEventListener("click", function () {
                        utils.logout();
                    })
                }
            })
            .catch(err => utils.debug("Error", err));

        // DISPLAY DASHBOARD
        displayIncome(income);
        displayExpense(expense);
        displayNetProfit(netProfit);
        displayCommonSizeStatement(expenseStatement, netProfitStatement);

        if (window.matchMedia("(max-width: 760px)").matches) {
            // PIE CHART DISPLAY
            const pieGraph = document.getElementById("pieGraphIncExpComp");

            fetch("GetIncomeExpenseComparisonPieGraph")
            .then(res => res.json())
            .then(data => {
                utils.debug("data compa", data);
                displayPieGraph(pieGraph, data);
            })
            .catch(err => {
                utils.debug("Error", err);
            });
        } else {
            // LINE GRAPH DISPLAY
            const lineGraph = document.getElementById("lineGraphIncExpComp");

            fetch("/Member/Home/GetIncomeExpenseComparisonLineGraph")
            .then(res => res.json())
            .then(data => {
                utils.debug("Line Graph", data);
                displayLineGraphIncExpComp(lineGraph, data);
            })
            .catch(err => {
                utils.debug("Error", err);
            });
        }

        // BAR GRAPH DISPLAY
        const barGraph = document.getElementById("barGraph");
        fetch("/Member/Home/GetExpenseBreakdown")
        .then(res => res.json())
        .then(data => {
            utils.debug("Expense Breakdown Data", data);
            displayBarGraph(barGraph, data);
        })
        .catch(err => {
            utils.debug("Error", err)
        });

        // COMPANY REGISTRATION
        companyRegistration.addEventListener("submit", async function (e) {
            e.preventDefault();

            let inputFields = companyRegistration.querySelectorAll("input, select");

            const checkInputFields = Array.from(inputFields).every(function (input) {
                return input.value.trim().length > 0;
            });

            if (checkInputFields) {

                inputFields.forEach(i => {
                    i.classList.remove("error-input");
                })

                const res = await fetch("/Member/Home/CompanyRegistration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        CompanyName: companyName.value,
                        CompanyIndustry: companyIndustry.value,
                        CompanyCountry: companyCountry.value,
                        Employees: companyEmployees
                    })
                }).then(res => res.json())
                .then(data => {
                    utils.debug("Company Data", data.message);

                    if (data.isPayed) {
                        modal.classList.remove("show");
                        businessRegistrationModal.classList.remove("show");
                        displayCompanyInfo();
                    } else {
                        utils.debug("Company registration", "Company has not been registered" + company);
                    }
                });
            } else {
                inputFields.forEach(i => {
                    if (!i.value.trim()) {
                        i.classList.add("error-input");
                    } else {
                        i.classList.remove("error-input");
                    }
                })
            }

        });


    },

    financialTransactions: function() {
        utils.debug("Page", "Financial Transaction");

        // LOCAL VARIABLE
        const transactionTable = document.getElementById("transactionTable"); // just in case
        const form = document.getElementById("editTransaction");
        const category = document.getElementById("category");
        const amount = document.getElementById("amount");
        const payee = document.getElementById("payee");
        const description = document.getElementById("description");
        const updateTransactionBtn = document.getElementById("updateTransactionBtn");

        // PICKER
        const pickerAll = document.getElementById("pickerAll");
        const pickerIncome = document.getElementById("pickerIncome");
        const pickerExpense = document.getElementById("pickerExpense");

        pickerAll.addEventListener("click", function () {
            pickerAll.classList.add("picked");
            pickerIncome.classList.remove("picked");
            pickerExpense.classList.remove("picked");
        });

        pickerIncome.addEventListener("click", function () {
            pickerIncome.classList.add("picked");
            pickerExpense.classList.remove("picked");
            pickerAll.classList.remove("picked");
        });

        pickerExpense.addEventListener("click", function () {
            pickerExpense.classList.add("picked");
            pickerAll.classList.remove("picked");
            pickerIncome.classList.remove("picked");
        });

        // EDIT TRANSACTION
        const editTransactionBtn = document.querySelectorAll(".editTransactionBtn");
        editTransactionBtn.forEach(e => {
            e.addEventListener("click", function () {
                showModalEditTransaction();
            });
        });

        // REMOVE TRANSACTION
        const deleteTransactionBtn = document.querySelectorAll(".deleteTransactionBtn");
        deleteTransactionBtn.forEach(d => {
            d.addEventListener("click", function () {
                showModalAlert("Do you want to remove this transaction?", "Remove Transaction", "removeTransaction");
            });
        });

        // DISPLAY TRANSACTIONS
        let selectedType;
        loadTransactions();

        document.querySelector(".picker-con").addEventListener("click", function (e) {
            const allTransaction = e.target.closest(".pickerAll")?.dataset.item;
            const income = e.target.closest(".pickerIncome")?.dataset.item;
            const expenses = e.target.closest(".pickerExpense")?.dataset.item;

            if (allTransaction) {
                utils.debug("Picker", "all transaction " + allTransaction);
                selectedType = allTransaction;
                pickerTransaction(allTransaction);
            } else if (income) {
                utils.debug("Picker", "Income " + income);
                selectedType = income;
                pickerTransaction(income);
            } else if (expenses) {  
                utils.debug("Picker", "Expenses " + expenses);
                selectedType = expenses;
                pickerTransaction(expenses);
            } else {
                utils.debug("Picker error", "Nothing picked");
            }
        });

        // EDIT TRANSACTION
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id = updateTransactionBtn.dataset.id;
            const type = form.elements["editTransactionType"].value;

            if (utils.inputEmptyValidation(form)) {
                utils.validateInputFieldsValue(form);

                await fetch("/Member/Home/EditFinancialTransaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Id: id,
                        Type: type,
                        Category: category.value,
                        Amount: amount.value,
                        Payee: payee.value,
                        Description: description.value
                    })
                }).then(res => res.json())
                .then(data => {
                    utils.debug("Message", data.message);
                    utils.clearForm(editTransaction);
                    utils.closeModal(modal);
                })
                .catch(err => utils.debug("Error", err));

                await pickerTransaction(selectedType);
            } else {
                utils.validateInputFieldsValue(form);
            }
        });

        // ONCLICK LISTENER FOR EDIT AND DELETE BUTTON
        let transactionId;
        document.addEventListener("click", function (e) {
            const click = e.target;
            const editBtn = click.closest(".editTransactionBtn");
            const deleteBtn = click.closest(".deleteTransactionBtn");

            if (editBtn) {
                const id = editBtn.dataset.id;
                utils.debug("Clicked", "Edit" + id);
                displayTransaction(id);
            } else if (deleteBtn) {
                transactionId = deleteBtn.dataset.id;
                utils.debug("Clicked", "Delete" + transactionId);

                showModalAlert("Do you want to remove this transaction?", "Remove Transaction", "removeEmployee");
            }
        });
        
        document.querySelector(".confirm").addEventListener("click", function () {
            deleteTransaction(transactionId, selectedType);
        });
        
    },

    employees: function() {
        utils.debug("Page", "Employees");

        // LOCAL VARIABLE

        // SEARCH EMPLOYEE
        const search = document.getElementById("searchEmployee");

        let timeout;
        search.addEventListener("input", function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                employeeSearch(search.value);
            }, 200);
        });

        // ADD EMPLOYEE
        const addEmployeeBtn = document.getElementById("addEmployeeBtn");
        addEmployeeBtn.addEventListener("click", function () {
            showModalEntity("Add Employee", "addEmployee", "employee");
        });

        // EDIT EMPLOYEE
        const editEmployeeBtn = document.querySelectorAll(".editEmployeeBtn");
        editEmployeeBtn.forEach(e => {
            e.addEventListener("click", function () {
                showModalEntity("Edit Employee", "editEmployee", "employee");
            });
        });

        // DELETE EMPLOYEE
        const deleteEmployeeBtn = document.querySelectorAll(".deleteEmployeeBtn");
        deleteEmployeeBtn.forEach(d => {
            d.addEventListener("click", function () {
                showModalAlert("Do you want to remove this employee?", "Remove Employee", "removeEmployee");
            });
        });
    
        const form = document.getElementById("employeeRegistration");

        // REFACTOR
        const firstName = form.querySelector(".firstName");
        const middleName = form.querySelector(".middleName");
        const lastName = form.querySelector(".lastName");
        const role = form.querySelector(".role")
        const position = form.querySelector(".position");
        const address = form.querySelector(".address");

        const email = form.querySelector(".email");
        const phone = form.querySelector(".phone");
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (modalEntityBtnAction === "addEmployee") { 
                
                utils.debug("Action", "Add");

                if (utils.inputEmptyValidation(form)) {

                    // EMAIL AND PHONE AUTH, checks if it already exists
                    /*if (utils.isEmpty(email.value) && utils.isEmpty(phone.value)) {
                        const con = document.querySelectorAll(".modal-body-row");
                        con.forEach(i => {
                            i.querySelectorAll("input").classList.add("error-input");
                        })
                    }*/

                    if (utils.limitInputLength(phone, 11)) {
                        const formData = utils.getFormData(form);

                        utils.debug("Error", "Employee Added"); // REMOVE

                        await fetch("/Member/Home/EmployeeRegistration", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(formData)
                        }).then(res => res.json())
                        .then(data => {
                            utils.debug("Employee Data", data); // REMOVE
                            utils.validateInputFieldsValue(form);
                            utils.clearForm(form);
                            utils.closeModal(modal);
                        })
                        .catch(err => utils.debug("Error", err));

                        await loadEmployees();
                    } else {
                        const phoneCon = document.querySelector(".phone-con");
                        utils.displayErrorInputTag(phoneCon, "Phone invalid");
                    }

                } else {
                    utils.validateInputFieldsValue(form);
                }
        
            } else {
                utils.debug("Action", "edit");
                // EDIT
                if (utils.inputEmptyValidation(form)) {
                    if (utils.limitInputLength(phone, 11)) {     
                        const employeeId = modalEntityBtn.dataset.id;

                        await fetch("/Member/Home/EditEmployee", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                Id: employeeId, // REFACTOR
                                FirstName: firstName.value,
                                MiddleName: middleName.value,
                                LastName: lastName.value,
                                Position: position.value,
                                Role: role.value,
                                Email: email.value,
                                Phone: phone.value,
                                Address: address.value  
                            })
                        }).then(res => res.json())
                        .then(data => {
                            utils.debug("Employee", data.message);
                            utils.validateInputFieldsValue(form);
                            utils.closeModal(modal);
                            loadEmployees();
                        })
                        .catch(err => utils.debug("Error", err));
                    } else {
                        utils.debug("phone input", "error");
                        const phoneCon = document.querySelector(".phone-con");
                        utils.displayErrorInputTag(phoneCon, "Phone invalid");
                    }
                } else {
                    utils.validateInputFieldsValue(form);
                }
            }
        });


        // DISPLAY EMPLOYEE
        loadEmployees();
        let employeeId;
        document.addEventListener("click", function (e) {
            const employeeCardId = e.target.closest(".table-card");
            const editBtn = e.target.closest(".editEmployeeBtn");
            const deleteBtn = e.target.closest(".deleteEmployeeBtn");

            if (editBtn) {
                const employeeId = editBtn.dataset.id;
                utils.debug("Btn", "Clicked " + employeeId);
                displayEmployee(employeeId);
            } else if (deleteBtn) {
                employeeId = employeeCardId.dataset.id;
                utils.debug("Action", "delete " + employeeId);
                
                showModalAlert("Do you want to remove this employee?", "Remove Employee", "removeEmployee");

            }
        });

        document.querySelector(".confirm").addEventListener("click", function () {
            deleteEmployee(employeeId);
        });
        
    },

    reports: function() {
        utils.debug("Page", "Reports");

        // LOCAL VARIABLE
        form = document.getElementById("addTransaction");
        const dateOfTransaction = document.getElementById("date");
        const category = document.getElementById("category");
        const description = document.getElementById("description");
        const amount = document.getElementById("amount");
        const payee = document.getElementById("payee");

        // DATE INPUT FOCUSED OUTLINE DESIGN
        const dateBtn = document.getElementById("date");
        dateBtn.addEventListener("focus", function () {
            dateBtn.classList.add("active-input");
        });

        dateBtn.addEventListener("blur", function () {
            dateBtn.classList.remove("active-input");
        });

        utils.setDateToday(dateBtn);

        // CLEAR FORM
        const clearForm = document.getElementById("clearForm");
        clearForm.addEventListener("click", function () {
            showModalAlert("Do you want to clear the form?", "Clear Form", "clearForm");
        });

        // INSERT FORM ID TO FORM VAR
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const type = form.elements["transactionType"].value; // GET type value

            if (utils.inputEmptyValidation(form)) {
                utils.validateInputFieldsValue(form);
                
                await fetch("/Member/Home/RecordFinancialTransaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Type: type,
                        DateOfTransaction: dateOfTransaction.value,
                        Category: category.value,
                        Description: description.value,
                        Amount: amount.value,
                        Payee: payee.value
                    })
                }).then(res => res.json())
                .then(data => {
                    utils.debug("Transaction", data);
                    showModal("Succes!", "Successfully added a new transaction.");
                })
                .catch(err => utils.debug("Error", err));

            } else {
                utils.validateInputFieldsValue(form);
            }


        });
    },

    investors: function() {
        utils.debug("Page", "Investors");
        
        // DISPLAY CAPITAL INVETSMENT
        const capitalInvestmentSpan = document.getElementById("capitalInvestmentSpan");
        getCapitalInvestment(capitalInvestmentSpan);

        // ADD INVESTOR
        const addInvestorBtn = document.getElementById("addInvestorBtn");
        addInvestorBtn.addEventListener("click", function () {
            showModalEntity("Add Investor", "addInvestor", "investor");
        });

        // FIX THIS .querySelector
        const form = document.getElementById("investorRegistration");
        const email = form.querySelector(".email");
        const phone = form.querySelector(".phone");
        const tin = form.querySelector(".tin");
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (modalEntityBtnAction === "addInvestor") {
                if (utils.inputEmptyValidation(form)) {
                    utils.validateInputFieldsValue(form);

                    if (utils.limitInputLength(phone, 11)) { 
                        utils.clearErrorInputTag(form);      

                        if (utils.limitInputLength(tin, 11)) {
                            utils.clearErrorInputTag(form);      
    
                            const formData = utils.getFormData(form);

                            await fetch("/Member/Home/InvestorRegistration", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formData)
                            }).then(res => res.json())
                            .then(data => {
                                utils.debug("Investor data", data);
                                utils.validateInputFieldsValue(form);
                                utils.clearForm(form);
                                utils.clearAllErrorInputFields(utils.selectAllInputFields(form));
                                utils.closeModal(modal);
                            })
                            .catch(err => utils.debug("Error", err));

                            getCapitalInvestment(capitalInvestmentSpan);
                            loadInvestors();
                        } else {
                            const tinCon = form.querySelector(".tin-con");
                            utils.displayErrorInputTag(tinCon, "Tin invalid");
                        }

                    } else {
                        const phoneCon = form.querySelector(".phone-con");
                        utils.displayErrorInputTag(phoneCon, "Phone invalid");
                    }
                } else {
                    utils.debug("input field", "does mot contain anyting");
                    utils.validateInputFieldsValue(form);
                }

            }
        });


        // DISPLAY INVESTORS
        loadInvestors();

    },

    financialStatement: function() {
        utils.debug("Page", "Financial Statement");
    },

    assetsAndLiabilities: function() {
        utils.debug("Page", "Assets and Liabilities");

        const addAssetBtn = document.getElementById("addAssetBtn");
        addAssetBtn.addEventListener("click", function () {
            showModalEntity("Add Asset", "addAsset", "assets");
        });

        const addLiabilityBtn = document.getElementById("addLiabilityBtn");
        addLiabilityBtn.addEventListener("click", function () {
            showModalEntity("Add Liability", "addLiability", "liabilities");
        });

        const payLiabilityBtn = document.getElementById("payLiabilityBtn");
        payLiabilityBtn.addEventListener("click", function () {
            showModalEntity("Pay Liability", "payLiability", "payLiability");
        });

        
        // DISPLAY DATA
        loadEntity(paginationState["Assets"].current, "Assets");
        loadEntity(paginationState["Liabilities"].current, "Liabilities");
        
        // LIABILITIES DASHBOARD
        const liabilitiesRemainingBalance = document.getElementById("liabilitiesRemainingBalance");
        const totalLiabilities = document.getElementById("totalLiabilities");
        const activeLiabilities = document.getElementById("activeLiabilities");
        const paidLiabilities = document.getElementById("paidLiabilities");
        const  dueLiabilities = document.getElementById("dueLiabilities");

        displayLiabilitesDashboard();

        // PICKER
        const pickerAll = document.getElementById("pickerAll");
        const pickerActive = document.getElementById("pickerActive");
        const pickerPaid = document.getElementById("pickerPaid");
        const pickerDue = document.getElementById("pickerDue");

        pickerAll.addEventListener("click", function () {
            pickerAll.classList.add("picked");
            pickerActive.classList.remove("picked");
            pickerPaid.classList.remove("picked");
            pickerDue.classList.remove("picked");
        });

        pickerActive.addEventListener("click", function () {
            pickerActive.classList.add("picked");
            pickerPaid.classList.remove("picked");
            pickerDue.classList.remove("picked");
            pickerAll.classList.remove("picked");
        });

        pickerPaid.addEventListener("click", function () {
            pickerPaid.classList.add("picked");
            pickerDue.classList.remove("picked");
            pickerAll.classList.remove("picked");
            pickerActive.classList.remove("picked");
        });

        pickerDue.addEventListener("click", function () {
            pickerDue.classList.add("picked");
            pickerAll.classList.remove("picked");
            pickerActive.classList.remove("picked");
            pickerPaid.classList.remove("picked");
        });

        // EVENT DEL
        let selectedEntityId;
        document.addEventListener("click", function (e) {
            const btn = e.target.closest(".editAssetBtn, .editLiabilityBtn, .deleteAssetBtn, .deleteLiabilityBtn");
            if (!btn) return;

            selectedEntityId = btn.dataset.id;

            // EDIT
            if (btn.classList.contains("editAssetBtn")) {
                utils.debug("Edit asset", "clicked");
                displayEntityOnModal("Edit Asset", "editAsset", "assets", selectedEntityId);
            }

            if (btn.classList.contains("editLiabilityBtn")) {
                utils.debug("Edit liability", "clicked");
                displayEntityOnModal("Edit Liability", "editLiability", "liabilities", selectedEntityId);
            }

            // DELETE
            if (btn.classList.contains("deleteAssetBtn")) {
                showModalAlert("Do you want to remove this asset?", "Remove Asset", "removeAsset");
            }

            if (btn.classList.contains("deleteLiabilityBtn")) {
                showModalAlert("Do you want to remove this liability?", "Remove Liability", "removeLiability");
            }
        });

        // DELETE CONFIRM
        document.addEventListener("click", function (e) {
            const actionBtn = e.target.closest("[data-action]");
            if (!actionBtn) return;

            if (actionBtn?.dataset.action === "removeAsset") {
                utils.debug("Delete asset", "Deleted asset");
                deleteEntity(selectedEntityId, "Asset");
            }

            if (actionBtn?.dataset.action === "removeLiability") {
                utils.debug("Delete liabilityt", "Deleted liability");
                deleteEntity(selectedEntityId, "Liability");
                displayLiabilitesDashboard();
            }
        });

        
        // PAGINATION
        document.addEventListener("click", (e) => {
            const btn = e.target.closest(".next, .prev");
            if (!btn) return;

            const entity = btn.dataset.entity;
            if (!entity) return;

            const state = paginationState[entity];
            if (!state) return;

            if (btn.classList.contains("prev")) {
                if (state.current > 1) {
                    state.current--;
                    loadEntity(state.current, entity);
                }
            }

            if (btn.classList.contains("next")) {
                if (state.current < state.total) {
                    state.current++;
                    loadEntity(state.current, entity);
                }
            }

        });

        // ADD and EDIT ASSET
        const assetForm = document.getElementById("assetsRegistration");
        assetForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (modalEntityBtnAction === "addAsset") {
                if (utils.inputEmptyValidation(assetForm)) {
                    utils.validateInputFieldsValue(assetForm);

                    const formData = utils.getFormData(assetForm);

                    utils.debug("Investment", formData);

                    await fetch("/Member/Home/AssetRegistration", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    }).then(res => res.json())
                    .then(data => {
                        utils.debug("Asset data", data);
                        utils.clearAndCloseModal(assetForm, modal);
                    })
                    .catch(err => utils.debug("Error", err));

                    loadEntity(paginationState["Assets"].current, "Assets");
                } else {
                    utils.validateInputFieldsValue(assetForm);
                }
            } else {
                if (utils.inputEmptyValidation(assetForm)) {
                    utils.validateInputFieldsValue(assetForm);

                    const assetId = modalEntityBtn.dataset.id;
                    const formData = utils.getFormData(assetForm);

                    utils.debug("Investment", formData);

                    await fetch("/Member/Home/EditAsset", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            Id: assetId,
                            ...formData
                        })
                    }).then(res => res.json())
                    .then(data => {
                        utils.debug("Asset data", data);
                        utils.clearAndCloseModal(assetForm, modal);
                    })
                    .catch(err => utils.debug("Error", err));

                    loadEntity(paginationState["Assets"].current, "Assets");
                } else {
                    utils.validateInputFieldsValue(assetForm);
                }
            }
        });


        // ADD and EDIT LIABILITIES
        const liabilitiesForm = document.getElementById("liabilitiesRegistration");
        liabilitiesForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            if (modalEntityBtnAction === "addLiability") {
                if (utils.inputEmptyValidation(liabilitiesForm)) {
                    utils.validateInputFieldsValue(liabilitiesForm);

                    const formData = utils.getFormData(liabilitiesForm);

                    await fetch("/Member/Home/LiabilityRegistration", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    }).then(res => res.json())
                    .then(data => {
                        utils.debug("Liability Data", data);
                        utils.clearAndCloseModal(liabilitiesForm, modal);
                    })
                    .catch(err => utils.debug("Error", err));

                    loadEntity(paginationState["Liabilities"].current, "Liabilities");
                    displayLiabilitesDashboard();
                } else {
                    utils.validateInputFieldsValue(liabilitiesForm);
                }
            } else {
                if (utils.inputEmptyValidation(liabilitiesForm)) {
                    utils.validateInputFieldsValue(liabilitiesForm);

                    const liabilityId = modalEntityBtn.dataset.id;
                    const formData = utils.getFormData(liabilitiesForm);

                    await fetch("/Member/Home/EditLiability", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            Id: liabilityId,
                            ...formData
                        })
                    }).then(res => res.json())
                    .then(data => {
                        utils.debug("Liability Data", data);
                        utils.clearAndCloseModal(liabilitiesForm, modal);
                    })
                    .catch(err => utils.debug("Error", err));

                    loadEntity(paginationState["Liabilities"].current, "Liabilities");
                    displayLiabilitesDashboard();
                } else {
                    utils.validateInputFieldsValue(liabilitiesForm);
                }
            }
        });

    },

    settings: function() {
        utils.debug("Page", "Settings");

        // LOG OUT BUTTON
        var logOutBtn = document.getElementById("logOutBtn");
        logOutBtn.addEventListener("click", function () {
            showModalAlert("Do you want to log out?", "Log Out", "logout");
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;

    if (PageScripts[page]) {
        PageScripts[page]();
    }

});

// FUNCTIONS

async function loadEntity(page, entity) {
    const res = await fetch(`/Member/Home/Get${entity}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pageNumber: page,
            pageSize: 5
        })
    });

    const data = await res.json();

    utils.debug("data", data.data);

    renderEntity(data.data, entity);

    paginationState[entity].current = page;
    paginationState[entity].total = data.totalPages;

    if (entity === "Assets") {
        const container = document.querySelector("#assetsPagination");
        renderPagination(container, page, data.totalPages, (p) => {
            paginationState[entity].current = p;
            loadEntity(p, "Assets");
        });
    }

    if (entity === "Liabilities") {
        const container = document.querySelector("#liabilitiesPagination");
        renderPagination(container, page, data.totalPages, (p) => {
            paginationState[entity].current = p;
            loadEntity(p, "Liabilities");
        });
    }

    //renderPagination(entity, page, data.totalPages);
}

function renderEntity(items, entity) {
    let tbody;

    switch (entity) {
        case "Assets": 
            tbody = document.getElementById("assetsTable");
            tbody.innerHTML = "";

            items.forEach(t => {
                tbody.innerHTML += `
                    <tr data-id="${t.id}">
                        <td>${utils.dateFormat(t.createdAt)}</td>
                        <td class="data-text-limit">${t.item}</td>
                        <td>${t.category}</td>
                        <td>${t.assetId}</td>
                        <td>${utils.amountInputFormatToHundreds(t.amount)}</td>
                        <td>
                            <div class="action-con editAssetBtn" data-id="${t.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                            </div>

                            <div class="action-con deleteAssetBtn" data-id="${t.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                            </div>
                        </td>
                    </tr>
                `;
            });
            break;
            
        case "Liabilities": 
            tbody = document.getElementById("liabilitiesTable");
            tbody.innerHTML = "";

            items.forEach(t => {
                const isDue = utils.isDueLiability(t.due);

                tbody.innerHTML += `
                    <tr class="${isDue ?  "" : "due-liability"}" data-id="${t.id}">
                        <td>${utils.dateFormat(t.due)}</td>
                        <td>${t.name}</td>
                        <td>${t.type}</td>
                        <td>₱${utils.amountInputFormatToHundreds(t.debt)}</td>
                        <td>₱${utils.amountInputFormatToHundreds(t.paid)}</td>
                        <td>₱${utils.amountInputFormatToHundreds(t.balance)}</td>
                        <td>${t.progress}%</td>
                        <td class="${t.status === "Paid" ? "liabilities-visual-graph-dashboard-paid" : "liabilities-visual-graph-dashboard-active"}">${t.status}</td>
                        <td>
                            <div class="action-con editLiabilityBtn" data-id="${t.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                            </div>

                            <div class="action-con deleteLiabilityBtn" data-id="${t.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                            </div>
                        </td>
                    </tr>
                `;
            });
            break;

        default: 
            utils.debug("Render Entity", "No Entity");
    }
}


// PAGINATION
function renderPagination(container, page, totalPages, onPageChange) {
    container.innerHTML = "";

    const { start, end } = getPageRange(page, totalPages, 5);

    for (let i = start; i <= end; i++) {
        container.innerHTML += `
            <li class="pagination-item page-number ${i === page ? "active-page" : ""}" data-page="${i}">
                <p>${i}</p>
            </li>
        `;
    }

    container.querySelectorAll(".page-number").forEach(btn => {
        btn.addEventListener("click", () => {
            onPageChange(parseInt(btn.dataset.page));
        });
    });
}

function getPageRange(currentPage, totalPages, maxVisible = 5) {
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(end - maxVisible + 1, 1);
    }

    return { start, end}
}

// LIABILITY
async function getLiability(id, form) {
    try {
        await fetch("/Member/Home/GetLiability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: id
            })
        }).then(res => res.json())
        .then(data => {
            utils.debug("Liability data", data);

            // Display Data
            const inputFields = ["name", "type", "debt", "due", "status"];
            utils.populateForm(form, data, inputFields);
        })
        .catch(err => utils.debug("Error", err));

    } catch (err) {
        utils.debug("Error", err);
    }
}

async function displayLiabilitesDashboard() {
    const data = await getLiabilitiesDashboardData();

    utils.debug("Liabilities Dashboard Data", data);
    liabilitiesRemainingBalance.textContent = utils.amountInputFormatToHundreds(data.remainingBalance);
    totalLiabilities.textContent = data.totalLiabilities;
    activeLiabilities.textContent =  data.active;
    paidLiabilities.textContent = data.paid;
    dueLiabilities.textContent = data.due;
}


async function getLiabilitiesDashboardData() {
    const res = await fetch("/Member/Home/GetLiabilitiesDashboardData");

    const data = await res.json();
    return data;
}


// ASSETS
async function getAsset(id, form) {
    try {
        await fetch("/Member/Home/GetAsset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: id
            })
        }).then(res => res.json())
        .then(data => {
            utils.debug("Asset data", data);

            // Display Data
            const inputFields = ["item", "amount", "category"];
            utils.populateForm(form, data, inputFields);
        })
        .catch(err => utils.debug("Error", err));

    } catch (err) {
        utils.debug("Error", err);
    }
}


// INVESTORS
async function getCapitalInvestment(tag) {
    try {
        const res = await fetch("/Member/Home/GetCapitalInvestment");
        const data = await res.json();

        tag.textContent = utils.amountInputFormatToHundreds(data);
    } catch (err) {
        utils.debug("Get Capital Investment Error", err);
    }
}

async function displayInvestors(data, listCon) {

    const list = listCon;
    list.innerHTML = "";

    data.forEach(e => {
        const li = document.createElement("div");
        li.classList.add("table-card");
        li.dataset.id = e.id;

        let stakeholder;

        utils.debug("Stakeholder", e.stakeholder);

        if (e.stakeholder === "Owner") {
            stakeholder = "owner";
        } else if (e.stakeholder === "Investor") {
            stakeholder = "investor";
        } else {
            stakeholder = "Undefined"
        }

        li.innerHTML = 
        `<div class="table-card-header">
                <div class="table-card-header-info">
                    <p class="table-card-name">${e.firstName} ${e.middleName ?? ""} ${e.lastName}</p>
                    <p class="table-card-role">${e.stakeholderId}</p>
                </div>

                <div class="table-card-actions-con">
                    <div class="action-con editEmployeeBtn" data-id="${e.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                    </div>

                    <div class="action-con deleteEmployeeBtn" data-id="${e.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                    </div>
                </div>
            </div>

            <div class="table-card-info-con">
                <div class="role-con ${stakeholder}">
                    <p>${e.stakeholder}</p>
                </div>

                <div class="table-card-info">
                    <div class="table-info-left">
                        <p>Ownership:</p>
                        <p>Investment:</p>
                        <p>Income:</p>
                        <p>ROI(YTD)</p>
                        <p>Email:</p>
                        <p>Phone:</p>
                        <p>Address:</p>
                        <p>TIN:</p>
                    </div>

                    <div class="table-info-right">
                        <p>${e.ownership}%</p>
                        <p class="safe">₱${utils.amountInputFormatToHundreds(e.investment)}</p>
                        <p>₱${utils.amountInputFormatToHundreds(e.income)}</p>
                        <p class="danger">${e.roi}%</p>
                        <p>${e.email}</p>
                        <p>+63 (09) ${e.phone}</p>
                        <p>${e.address}</p>
                        <p>${utils.tinInputFormat(e.tin)}</p>
                    </div>
                </div>

                <div class="table-card-border"></div>

                <div class="table-card-created-at">
                    <p>Date of Investment: ${utils.dateFormat(e.createdAt)}</p>
                </div>
            </div>
            `;
        
        list.appendChild(li);
    });
}

async function loadInvestors() {
    try {
        const res = await fetch("/Member/Home/GetInvestors");
        const investors = await res.json();

        const investorsCardCon = document.getElementById("investorsCardCon");
        displayInvestors(investors, investorsCardCon);
    } catch (err) {
        utils.debug("Investors Display Error", err);
    }
}


// DASHBOARD

function displayLineGraphIncExpComp(lineGraph, data) {
     const legendItems = [
        { label: "Income", color: "#53AC7F" },  
        { label: "Expense", color: "#E64C4C" } 
    ];

    const width = lineGraph.clientWidth - 20;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = d3.select(`#${lineGraph.id}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet");

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const xScale = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, chartWidth])
        .padding(0.1);

    const yMax = d3.max(data, d => Math.max(d.income, d.expense));

    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([chartHeight, 0]);

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));

    chart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale));

    chart.append("g")
        .call(yAxis);


    const line = d3.line()
        .x(d => xScale(d.month) + xScale.bandwidth() / 2) 
        .y(d => yScale(d.value));

    const incomeLineData = data.map(d => ({ month: d.month, value: d.income }));
    const expenseLineData = data.map(d => ({ month: d.month, value: d.expense }));

    chart.append("path")
        .datum(incomeLineData)
        .attr("fill", "none")
        .attr("stroke", "#53AC7F") 
        .attr("stroke-width", 2)
        .attr("d", line);

    chart.append("path")
        .datum(expenseLineData)
        .attr("fill", "none")
        .attr("stroke", "#E64C4C")
        .attr("stroke-width", 2)
        .attr("d", line);

    chart.selectAll(".income-point")
        .data(incomeLineData)
        .enter()
        .append("circle")
        .attr("class", "income-point")
        .attr("cx", d => xScale(d.month) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", "#53AC7F");

    chart.selectAll(".expense-point")
        .data(expenseLineData)
        .enter()
        .append("circle")
        .attr("class", "expense-point")
        .attr("cx", d => xScale(d.month) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", "#E64C4C");

    const itemSpacing = Math.min(90, width / legendItems.length / 1.5);
    const circleRadius = 6;
    const totalLegendWidth = legendItems.length * itemSpacing;
    const legendY = chartHeight + margin.top + 40;
    const legendX = Math.max(0, (width - totalLegendWidth) / 2);
    const legend = svg.append("g")
            .attr("transform", `translate(${legendX}, ${legendY})`);


    legendItems.forEach((d, i) => {
        // INCOME
        legend.append("circle")
            .attr("cx", i * itemSpacing)
            .attr("cy", 0)
            .attr("r", 6)
            .attr("fill", d.color);

        legend.append("text")
            .attr("x", i * itemSpacing + circleRadius + 5)
            .attr("y", 2)
            .text(d.label)
            .attr("alignment-baseline", "middle");
    });

}

function displayPieGraph(pieGraph, data) {
    const width = pieGraph.clientWidth;  
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(`#${pieGraph.id}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    const pie = d3.pie()
    .value(d => d.value);

    const arc = d3.arc()
    .innerRadius(0)    
    .outerRadius(radius);

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.key))
    .range([ '#53AC7F', '#E64C4C']);

    const label = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 80);

    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => {
            if(d.data.key === "Income") return "#53AC7F"; 
            if(d.data.key === "Expense") return "#E64C4C"; 
            return "#ccc"; 
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    const total = d3.sum(data, d => d.value);

    svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${label.centroid(d)})`)
        .style("text-anchor", "middle")
        .html(d => `
            <tspan x="2" dy="0" class="percentage">${((d.data.value / total) * 100).toFixed(1)}%</tspan>
            <tspan x="0" dy="20">${d.data.key}</tspan>
        `);
}

function displayBarGraph(barGraph, data) {
    // IF EVER CHANGED THE PASSED DATA KEY AND OBJECT NAME TO  {key: object} for modularity

    if (window.matchMedia("(max-width: 760px)").matches) {
        const width = barGraph.clientWidth;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 100 }; 

        const svg = d3.select(`#${barGraph.id}`)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", height);

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, chartWidth]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.key))
            .range([0, chartHeight])
            .padding(0.2);

        const maxLabels = Math.floor(chartWidth / 80);
        const xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % Math.ceil(data.length / maxLabels))));

        chart.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", d => yScale(d.key))
            .attr("x", 0) 
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d.value))
            .attr("fill", "steelblue");

        chart.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale)
                    .tickFormat(d3.format(".2s")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        chart.append("g")
            .call(d3.axisLeft(yScale));
            
    } else {
        const width = barGraph.clientWidth;
        const height = 300;

        const margin = { top: 20, right: 20, bottom: 40, left: 50 };

        const svg = d3.select(`#${barGraph.id}`)
                    .append("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
                    .attr("width", "100%")
                    .attr("height", height);

        const chart = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const xScale = d3
            .scaleBand()
            .domain(data.map(d => d.key)) // CHANGE THIS BASED ON THE KEY
            .range([0, chartWidth])
            .padding(0.2);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([chartHeight, 0]);

        const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));

        chart
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.key)) // CHANGE THIS BASED ON THE KEY
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.value))
            .attr("fill", "steelblue");

        chart
            .append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale));

        chart
            .append("g")
            .call(yAxis);
    }
}

async function displayStatementIcons(expense) {
    let incomeIncreaseIcon = document.querySelector(".increasedIncome");
    let incomeDecreaseIcon = document.querySelector(".decreasedIncome");

    let expenseIncreaseIcon = document.querySelector(".increasedExpense");
    let expenseDecreaseIcon = document.querySelector(".decreasedExpense");

    let netProfitIncreasedIcon = document.querySelector(".increasedNetProfit");
    let netProfitDecreasedIcon = document.querySelector(".decreasedNetProfit");

    let financialValue = document.querySelectorAll(".financialValue");

    if (expense > 100) {
        utils.debug("Expense", "HIgh");

        incomeIncreaseIcon.classList.remove("show");
        incomeDecreaseIcon.classList.add("show");

        expenseIncreaseIcon.classList.add("show");
        expenseDecreaseIcon.classList.remove("show");

        netProfitIncreasedIcon.classList.remove("show");
        netProfitDecreasedIcon.classList.add("show");

        financialValue.forEach(v => {
            v.classList.add("decrease");
        })

    } else {
        utils.debug("Expense", "low");
        incomeIncreaseIcon.classList.add("show");
        incomeDecreaseIcon.classList.remove("show");

        expenseIncreaseIcon.classList.remove("show");
        expenseDecreaseIcon.classList.add("show");

        netProfitIncreasedIcon.classList.add("show");
        netProfitDecreasedIcon.classList.remove("show"); 

        financialValue.forEach(v => {
            v.classList.remove("decrease");
        })
    }
}

async function displayCommonSizeStatement(expenseId, netProfitId) {
    try {
        const res = await fetch("/Member/Home/GetCommonSizeStatement");
        const data = await res.json();

        utils.debug("Expense %", data.expense);
        expenseId.textContent = data.expense;
        netProfitId.textContent = data.netProfit;
        displayStatementIcons(data.expense);
    } catch (err) {
        utils.debug("Error", err);
    }
}

async function displayNetProfit(id) {
    try {
        const res = await fetch("/Member/Home/GetNetProfit");
        const data = await res.json();

        id.textContent = data.totalProfit;
        utils.debug("Net profit", data.totalProfit);
    } catch (err) {
        utils.debug("Error", err);
    } 
}

async function displayExpense(id) {
    try {
        const res = await fetch("/Member/Home/GetExpense");
        const data = await res.json();

        id.textContent = data.totalExpense;
        utils.debug("Total Expense", data.totalExpense);
    } catch (err) {
        utils.debug("Error", err);
    }
}

async function displayIncome(id) {
    
    try {
        const res = await fetch("/Member/Home/GetIncome");
        const data = await res.json();

        id.textContent = data.totalIncome;
        utils.debug("Total Income", data.totalIncome);
    } catch (err) {
        utils.debug("Error", err);
    }
}

// FINANCIAL TRANSACTION

async function pickerTransaction(selected) {

    if (selected === "Income" || selected === "Expenses") {
        if (selected === "Expenses") {
            selected = "Expense";
        }

        try {
            const res = await fetch("/Member/Home/GetSelectedTransactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Selected: selected })
            });

            const transactions = await res.json();

            if (window.innerWidth < 760) {
                const cardCon = document.getElementById("transactionCardCon");
                displayTransactions(transactions, cardCon);
            } else {
                const table = document.getElementById("transactionTable");
                displayTransactions(transactions, table);
            }
        } catch (err) {
            utils.debug("Error", err);    
        }
    } else {
        loadTransactions();
    }
}

function showModalEditTransaction() {
    // REFACTOR centralise this

    utils.showParentModal(modal);

    editTransactionModal.classList.add("show");
}

async function deleteTransaction(id, type) {
    const res = await fetch("/Member/Home/DeleteTransaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Id: id
        })
    });

    const data = await res.json();
    utils.debug("Message", data.message);
    await pickerTransaction(type);
}

async function displayTransaction(id) {
    showModalEditTransaction();

    try {
        await fetch("/Member/Home/GetFinancialTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: id
            })
        }).then(res => res.json())
        .then(data => {
            utils.debug("Transaction data", data);

            const radio = document.querySelector(`input[name="editTransactionType"][value="${data.type}"]`);

            if (radio) {
                radio.checked = true;
            }
            category.value = data.category;
            amount.value = data.amount;
            payee.value = data.payee;
            description.value = data.description;
            updateTransactionBtn.dataset.id = data.id;
        })
        .catch(err => utils.debug("Error", err));

    } catch (err) {
        utils.debug("Error", err);
    }
}

async function displayTransactions(data, tableId) {
    const table = tableId;
    table.innerHTML = "";

    if (window.innerWidth < 760) { 
        data.forEach(c => {
            const card = document.createElement("div");
            card.classList.add("financial-transaction-card");
            card.dataset.id = c.id;

            let type;

            if (c.type === "Income") {
                type = "income";
            } else if (c.type === "Expense") {
                type = "expense"
            } else {
                type = "undefined"
            }

            card.innerHTML = `
                <div class="financial-transaction-card-header">
                    <div class="financial-transaction-card-head">
                        <p class="card-head">${c.category}</p>
                        <p class="card-date">${utils.dateFormat(c.dateOfTransaction)}</p>
                    </div>

                    <div class="financial-transaction-card-action-con">
                        <div class="action-con editTransactionBtn" data-id="${c.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                        </div>

                        <div class="action-con deleteTransactionBtn" data-id="${c.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                        </div>
                    </div>
                </div>

                <div class="financial-transaction-card-body">
                    <div class="card-body-row">
                        <p class="card-body-row-label">Type:</p>
                        <p class="card-body-row-data ${type}">${c.type}</p>
                    </div>

                    <div class="card-body-row">
                        <p class="card-body-row-label">Amount:</p>
                        <p class="card-body-row-data">₱${c.amount}</p>
                    </div>

                    <div class="card-body-row">
                        <p class="card-body-row-label">Payee:</p>
                        <p class="card-body-row-data">${c.payee}</p>
                    </div>

                    
                    <div class="card-body-row-wrap">
                        <p class="card-body-row-label">Description:</p>
                        <p class="card-body-row-data descriptionCard">${c.description}</p>
                    </div>
                </div>
            `

            table.appendChild(card);
        });

    } else {
        data.forEach(t => {
            const row = document.createElement("tr");
            row.dataset.id = t.id;

            let type;

            if (t.type === "Income") {
                type = "income";
            } else if (t.type === "Expense") {
                type = "expense"
            } else {
                type = "undefined"
            }

            row.innerHTML = `
                <tr data-id="${t.id}">
                    <td>${utils.dateFormat(t.dateOfTransaction)}</td>
                    <td id="type" class="${type}">${t.type}</td>
                    <td>${t.category}</td>
                    <td class="description">${t.description}</td> <!-- Re design this shit set a maximum words then gawa ka ng parang button na "see more" -->
                    <td>₱${t.amount}</td>
                    <td class="payee-col">${t.payee}</td>
                    <td>
                        <div class="action-con editTransactionBtn" data-id="${t.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                        </div>

                        <div class="action-con deleteTransactionBtn" data-id="${t.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                        </div>
                    </td>
                </tr>
            `

            table.appendChild(row);
        });
    }
}

async function loadTransactions() {
    try {
        const res = await fetch("/Member/Home/GetFinancialTransactions");
        const transactions = await res.json();

        if (window.innerWidth < 760) {
            const cardCon = document.getElementById("transactionCardCon");
            displayTransactions(transactions, cardCon);
        } else {
            const table = document.getElementById("transactionTable");
            displayTransactions(transactions, table);
        }
    } catch (err) {
        utils.debug("Error", err);    
    }
}


// EMPLOYEE

async function employeeSearch(input) {
    try {
        const res = await fetch("/Member/Home/Search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                EmployeeName: input
            })
        });

        const data = await res.json();

        utils.debug("Employee", data);

        const employeesCardCon = document.getElementById("employeesCardCon");
        displayEmployees(data, employeesCardCon);
    } catch (err) {
        utils.debug("Employee Display Error", err);
    }
}

async function deleteEmployee(id) {
    const res = await fetch("/Member/Home/DeleteEmployee", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: id })
    });

    const data = await res.json();
    await loadEmployees();
}

async function displayEmployee(id) {
    showModalEntity("Edit Employee", "editEmployee", "employee");

    // REFACTOR
    const firstName = document.querySelector(".firstName");
    const middleName = document.querySelector(".middleName");
    const lastName = document.querySelector(".lastName");
    const role = document.querySelector(".role")
    const position = document.querySelector(".position");
    const email = document.querySelector(".email");
    const phone = document.querySelector(".phone");
    const address = document.querySelector(".address");

    try {
        await fetch("/Member/Home/GetEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id: id
            })
        }).then(res => res.json())
        .then(data => {
            utils.debug("Employee Data", data);

            firstName.value = data.firstName;
            middleName.value = data.middleName;
            lastName.value = data.lastName;
            role.value = data.role;
            position.value = data.position;
            email.value = data.email;
            phone.value = data.phone;
            address.value = data.address;
            modalEntityBtn.dataset.id = data.id;
        })
        .catch(err => utils.debug("Error", err));

    } catch (err) {
        utils.debug("Error", err);
    }
}

async function displayEmployees(data, listCon) {

    const list = listCon;
    list.innerHTML = "";

    data.forEach(e => {
        const li = document.createElement("div");
        li.classList.add("table-card");
        li.dataset.id = e.id;

        let role;

        if (e.role === "Staff") {
            role = "staff";
        } else if (e.role === "Moderator") {
            role = "moderator";
        } else if (e.role === "Admin") {
            role = "admin";
        } else {
            role = "Undefined"
        }

        li.innerHTML = 
        `<div class="table-card-header">
                <div class="table-card-header-info">
                    <p class="table-card-name">${e.firstName} ${e.middleName ?? ""} ${e.lastName}</p>
                    <p class="table-card-role">${e.position}</p>
                </div>

                <div class="table-card-actions-con">
                    <div class="action-con editEmployeeBtn" data-id="${e.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="edit" d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                    </div>

                    <div class="action-con deleteEmployeeBtn" data-id="${e.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path class="delete" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                    </div>
                </div>
            </div>

            <div class="table-card-info-con">
                <div class="role-con ${role}">
                    <p>${e.role}</p>
                </div>

                <div class="table-card-info">
                    <div class="table-info-left">
                        <p>Email:</p>
                        <p>Phone:</p>
                        <p>Address:</p>
                    </div>

                    <div class="table-info-right">
                        <p>${e.email}</p>
                        <p>+63 (09) ${e.phone}</p>
                        <p>${e.address}</p>
                    </div>
                </div>

                <div class="table-card-border"></div>

                <div class="table-card-created-at">
                    <p>Added: ${utils.dateFormat(e.createdAt)}</p>
                </div>
            </div>
            `;
        
        list.appendChild(li);
    });
}

async function loadEmployees() {
    try {
        const res = await fetch("/Member/Home/GetEmployees");
        const employees = await res.json();

        const employeesCardCon = document.getElementById("employeesCardCon");
        displayEmployees(employees, employeesCardCon);
    } catch (err) {
        utils.debug("Employee Display Error", err);
    }
}


// VALIDATION
function displayCompanyInfo() {
    fetch("/Member/Home/GetCompanyInfo")
        .then(res => res.json())
        .then(data => {
            companyNameNav.textContent = data.companyName;
            companyIndustryNav.textContent = data.companyIndustry;
        })
        .catch(err => utils.debug("Error", err))
}

function navOverlayChange(event) {
    if (event.matches) {
        utils.debug("Media Query", "It works"); // REMOVE THIS
        document.body.classList.add("relative");
        openNavVar.classList.add("absolute");

        // CLEAN UP SHOW AND HIDDEN CLASS
        closeNavVar.classList.remove("hidden");
        openNavVar.classList.remove("show");

        closeNavVar.addEventListener("click", function (e) {
            if (e.target.closest(".nav-item")) return;  
            openNavVar.classList.add("show");

            utils.debug("Text Sidebar", "Open");
        });

        openNavVar.addEventListener("click", function () {
            openNavVar.classList.remove("show");
        
            utils.debug("Text Sidebar", "Close");
        });


    } else {
        document.body.classList.remove("relative");
        openNavVar.classList.remove("absolute");

        // CLEAN UP SHOW AND HIDDEN CLASS
        closeNavVar.classList.remove("hidden");
        openNavVar.classList.remove("show");

        // NAV SIDE BAR OPEN / CLOSE
        closeNavVar.addEventListener("click", function (e) {
            if (e.target.closest(".nav-item")) return;  
            closeNav.classList.add("hidden");
            openNavVar.classList.add("show");
        });

        openNavVar.addEventListener("click", function () {
            closeNavVar.classList.remove("hidden");
            openNavVar.classList.remove("show");
        });
    }
}

// MODAL
async function deleteEntity(id, entity) {
    const res = await fetch(`/Member/Home/Delete${entity}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: id })
    });

    const data = await res.json();

    switch (entity) {
        case "Asset":
            entity = "Assets";
            break;

        case "Liability":
            entity = "Liabilities";
            break;
        
    }

    await loadEntity(paginationState[entity].current, entity); // REFACTOR
}

function displayEntityOnModal(text, actions, entity, id) {
    showModalEntity(text, actions, entity);
    const form = utils.getModalForm(modal);
    modalEntityBtn.dataset.id = id;

    switch (entity) {
        case "employee":
            // Create a function for getting the data from each entity
            break;

        case "assets":
            // Create a function for getting the data from each entity
            getAsset(id, form);
            break;

        case "liabilities":
            // Create a function for getting the data from each entity
            getLiability(id, form);
            break;

        default: 
            utils.debug("Display Entity On Modal", "No Entity");
    }
}

function showModalEntity(text, actions, entity) {
    // REFACTOR centralise this
    utils.showParentModal(modal);
    modalEntity.classList.add("show");

    modalEntity.dataset.entity = entity;
    modalEntityBtn.dataset.action = actions;
    modalEntityText.forEach(m => m.textContent = text);
    
    modalEntityBtnAction = actions; // THIS WILL BE USED TO IDENTIFY THE MODAL ENTITY (Investor, Employee, Clients, etc)

    switch(entity) {
        case "employee": 
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        case "investor":
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        case "financialStatement":
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        case "assets":
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        case "liabilities":
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        case "payLiability":
            utils.debug("Modal Entity", entity);
            showModalEntityForm(entity);
            break;

        default:
            utils.debug("Modal Entity", "No entity");
    }
}

function showModalEntityForm(entity) {
    switch (entity) {
        case "employee":
            document.querySelector(".employee-form").classList.add("show", "active");
            break;

        case "investor":
            document.querySelector(".investor-form").classList.add("show", "active");
            break;

        case "financialStatement":
            document.querySelector(".financialStatement-form").classList.add("show", "active");
            break;

        case "assets":
            document.querySelector(".assets-form").classList.add("show", "active");
            break;

        case "liabilities":
            document.querySelector(".liabilities-form").classList.add("show", "active");
            break;

        case "payLiability":
            document.querySelector(".pay-a-liability-form").classList.add("show", "active");
            break;

        default:
            utils.debug("Modal Entity Form", "Unavailable");
    }
}

function showEditEntityModal() {

}

function showAddEntityModal() {

}

function showModalAlert(subhead, buttonText, actions) {
    utils.showParentModal(modal);
    alertModal.classList.remove("modal-sm");
    alertModal.classList.add("modal-md");
    alertModal.classList.add("show");
    modalBodyButtonConAlert.classList.remove("hide");

    if (actions === "logout") {
        logOutIconModal.classList.remove("hidden");
        alertBtn.dataset.action = actions;
        alertHead.textContent = "Are you sure?";
        alertSubhead.textContent = subhead;
        alertBtnText.textContent = buttonText;
    } else {
        alertBtn.dataset.action = actions;
        alertHead.textContent = "Are you sure?";
        alertSubhead.textContent = subhead;
        alertBtnText.textContent = buttonText;
    }
}   

function showModal(head, subhead) {
    // REFACTOR rename for clarity, this is a function for small alert pop up
    utils.showParentModal(modal);
    alertModal.classList.remove("modal-md");
    alertModal.classList.add("show", "modal-sm");

    modalBodyButtonConAlert.classList.add("hide");

    alertHead.textContent = head;
    alertSubhead.textContent = subhead;
}   