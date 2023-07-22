const span = document.querySelectorAll("span");
const table = document.querySelectorAll("table");
const ol = document.querySelectorAll("ol");
const ul = document.querySelectorAll("ul");

if (table.length !== 0) {
    table.forEach((el) => {
        el.classList.add("custom_table");
        el.style.cssText = "border-collapse: collapse; width: 100%;";
        el.setAttribute("border", "1");
    });
}

if (ul.length !== 0) {
    ul.forEach((el) => {
        el.classList.add("custom_ul");
        el.style.cssText = "list-style-type: disc;";
        el.setAttribute("data-ke-list-type", "disc");
    });
}

if (ol.length !== 0) {
    ol.forEach((el) => {
        el.style.cssText = "list-style-type: decimal;";
        el.setAttribute("data-ke-list-type", "decimal");
    });
}

const copy = () => {
    let html = document.body.innerHTML;
    const copyTag = document.querySelector(".copy");
    html = html.replace(copyTag.outerHTML, ""); // copy 클래스 제외시키기

    // 클립보드에 복사
    window.navigator.clipboard.writeText(html).then(() => {
        alert("복사 완료 !");
    });
};
console.log("js");
