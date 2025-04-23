// Usage: <button onclick="exportToPDF('content')">Export to PDF</button>
// Usage: <button onclick="exportToPDF('content', 2)">Export to PDF (2x scale)</button>
// Ensure you include the jsPDF library in your HTML file:
// <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js"></script>

async function exportToPDF(elementId, scale = 1) {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById(elementId);
    if (!content) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }

    const canvas = await html2canvas(content, { scale: scale });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(elementId + '.pdf');
}
