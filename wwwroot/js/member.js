// PAGE BASED INITIALIZATION PATTERN **Para confined yung js code for each page
const PageScripts = {
    dashboard: function() {
        console.log("Dashboard");
    },

    financialTransaction: function() {
        console.log("financialTransaction");
    },

    employees: function() {
        console.log("Employees");
    },

    reports: function() {
        console.log("Reports");

        // DATE INPUT FOCUSED OUTLINE DESIGN
        const dateBtn = document.getElementById("date");
        dateBtn.addEventListener("focus", function () {
            dateBtn.classList.add("active-input");
        });

        dateBtn.addEventListener("blur", function () {
            dateBtn.classList.remove("active-input");
        });
    },

    settings: function() {
        console.log("Settings");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;

    if (PageScripts[page]) {
        PageScripts[page]();
    }

});

// FORMAT PHONE NUMBER
function formatNumber(value) {
    // Remove non-digits
    value = value.replace(/\D/g, '');

    // Apply format: 2 3 4 grouping
    if (value.length > 2 && value.length <= 5)
        return value.replace(/(\d{2})(\d+)/, "$1 $2");

    if (value.length > 5)
        return value.replace(/(\d{2})(\d{3})(\d+)/, "$1 $2 $3");

    return value;
}