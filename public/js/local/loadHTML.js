async function loadHTML(source, target) {
    const response = await fetch(source);
    const content = await response.text();
    document.getElementById(target).innerHTML = content;
}