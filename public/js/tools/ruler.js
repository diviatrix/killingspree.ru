function formValues() {
    const formElements = ['position', 'length', 'text-size', 'mm-text-size', 'start-from', 'mm-distance', 'cm-distance'];
    const formValues = formElements.map(id => doc(id).value);
    return formValues;
}

function AttachEvents() {
    doc('ruler-form').addEventListener('submit', function(event) {
        event.preventDefault();        
        generateRuler(formValues());
    });    

    doc('ruler-form').addEventListener('submit', function(event) {
        event.preventDefault();
        generateRuler(formValues());
    });

    doc('export-button').addEventListener('click', function() {
        const svg = document.querySelector('#ruler-container svg');
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ruler.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function doc(id) {
    return document.getElementById(id);
}

function generateRuler(formValues) {
    const [position, length, textSize, mmTextSize, startFrom, mmTickLength, cmTickLength] = formValues.map((value, index) => index === 0 || index === 4 ? value : parseInt(value, 10));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const isHorizontal = position === 'horizontal';
    const width = isHorizontal ? length + 10 : 50;
    const height = isHorizontal ? 50 : length + 10;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const mainLine = document.createElementNS(svgNS, "line");
    mainLine.setAttribute(isHorizontal ? "x1" : "y1", "5");
    mainLine.setAttribute(isHorizontal ? "y1" : "x1", "10");
    mainLine.setAttribute(isHorizontal ? "x2" : "y2", length + 5);
    mainLine.setAttribute(isHorizontal ? "y2" : "x2", "10");
    mainLine.setAttribute("stroke", "black");
    mainLine.setAttribute("stroke-width", "1");
    svg.appendChild(mainLine);

    for (let i = 0; i <= length; i++) {
        const mmTick = document.createElementNS(svgNS, "line");
        mmTick.setAttribute(isHorizontal ? "x1" : "y1", 5 + i);
        mmTick.setAttribute(isHorizontal ? "y1" : "x1", "10");
        mmTick.setAttribute(isHorizontal ? "x2" : "y2", 5 + i);
        mmTick.setAttribute(isHorizontal ? "y2" : "x2", 10 + mmTickLength);
        mmTick.setAttribute("stroke", "black");
        mmTick.setAttribute("stroke-width", "0.1");
        svg.appendChild(mmTick);

        if (i % 10 === 0) {
            const cmTick = document.createElementNS(svgNS, "line");
            cmTick.setAttribute(isHorizontal ? "x1" : "y1", 5 + i);
            cmTick.setAttribute(isHorizontal ? "y1" : "x1", "9.5");
            cmTick.setAttribute(isHorizontal ? "x2" : "y2", 5 + i);
            cmTick.setAttribute(isHorizontal ? "y2" : "x2", 10 + cmTickLength);
            cmTick.setAttribute("stroke", "black");
            cmTick.setAttribute("stroke-width", ".5");
            svg.appendChild(cmTick);

            const cmLabel = document.createElementNS(svgNS, "text");
            cmLabel.setAttribute(isHorizontal ? "x" : "y", 5 + i);
            cmLabel.setAttribute(isHorizontal ? "y" : "x", isHorizontal ? "35" : "25");
            cmLabel.setAttribute("text-anchor", isHorizontal ? "middle" : "end");
            cmLabel.setAttribute("font-size", textSize);
            cmLabel.textContent = startFrom === 'start' ? i / 10 : (length - i) / 10;
            svg.appendChild(cmLabel);
        } else {
            const mmLabel = document.createElementNS(svgNS, "text");
            mmLabel.setAttribute(isHorizontal ? "x" : "y", 5 + i);
            mmLabel.setAttribute(isHorizontal ? "y" : "x", isHorizontal ? "25" : "20");
            mmLabel.setAttribute("text-anchor", isHorizontal ? "middle" : "end");
            mmLabel.setAttribute("font-size", mmTextSize);
            mmLabel.textContent = startFrom === 'start' ? i % 10 : (length - i) % 10;
            svg.appendChild(mmLabel);
        }
    }

    const container = doc("ruler-container");
    container.innerHTML = '';
    container.appendChild(svg);

    doc('export-button').style.display = 'block';
    container.scrollIntoView();
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    let viewBox = { x: 0, y: 0, width: width, height: height };
    svg.addEventListener('wheel', function(event) {
        event.preventDefault();
        const scale = event.deltaY > 0 ? 1.1 : 0.9;
        const rect = svg.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const svgX = offsetX / rect.width * viewBox.width + viewBox.x;
        const svgY = offsetY / rect.height * viewBox.height + viewBox.y;
        viewBox.width *= scale;
        viewBox.height *= scale;
        viewBox.x = svgX - (svgX - viewBox.x) * scale;
        viewBox.y = svgY - (svgY - viewBox.y) * scale;
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    });

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    svg.addEventListener('mousedown', function(event) {
        isDragging = true;
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        svg.style.cursor = 'move';
    });

    svg.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const dx = (event.clientX - dragStart.x) * (viewBox.width / svg.clientWidth);
            const dy = (event.clientY - dragStart.y) * (viewBox.height / svg.clientHeight);
            viewBox.x -= dx;
            viewBox.y -= dy;
            svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
            dragStart.x = event.clientX;
            dragStart.y = event.clientY;
        }
    });

    svg.addEventListener('mouseup', function() {
        isDragging = false;
        svg.style.cursor = 'default';
    });

    svg.addEventListener('mouseleave', function() {
        isDragging = false;
        svg.style.cursor = 'default';
    });
}
